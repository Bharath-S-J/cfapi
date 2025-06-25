import path from 'node:path';
import fs from 'node:fs/promises';

import logger from '../utils/logger.js';
import getEngineHandler from '../engines/getEngineHandler.js';
import parseSchema from '../utils/parseSchema.js';

const CONFIG_DIR = 'config';
const CONFIG_NAME = 'cfapi.config.json';

const addModel = async ({ schema, output, engine }) => {
  try {
    logger.info(`Adding model(s) using schema: ${schema} with engine "${engine}"`);

    const configPath = path.join(output, CONFIG_DIR, CONFIG_NAME);
    let config = { engine, models: [] };
 
    // Step 1: Load config
    try {
      const configData = await fs.readFile(configPath, 'utf-8');
      config = JSON.parse(configData);

      if (config.engine !== engine) {
        throw new Error(`Engine mismatch: existing project uses "${config.engine}"`);
      }
    } catch (err) {
      throw new Error(`No config found at ${configPath}. Make sure to generate the API first.`);
    }

    // Step 2: Parse new schema
    const newModels = await parseSchema(schema);
    const newModelNames = Object.keys(newModels);

    if (newModelNames.length === 0) {
      throw new Error('No valid models found in schema.');
    }

    logger.info(` Models in schema: ${newModelNames.join(', ')}`);

    // Step 3: Check for duplicates
    const existingModels = config.models || [];
    const duplicates = newModelNames.filter((name) => existingModels.includes(name));

    if (duplicates.length > 0) {
      throw new Error(`Model(s) already exist: ${duplicates.join(', ')}`);
    }

    // Step 4: Add models
    const engineHandler = getEngineHandler(engine);
    await engineHandler.addModel(newModels, output, existingModels);

    // Step 5: Update config
    config.models = [...new Set([...existingModels, ...newModelNames])];
    config.updatedAt = new Date().toISOString();

    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    logger.info(`Updated config at ${path.relative(process.cwd(), configPath)}`);
    logger.info(`Successfully added models: ${newModelNames.join(', ')}`);
  } catch (err) {
    logger.error(`Add failed: ${err.message}`);
    throw err;
  }
};

export default addModel;
