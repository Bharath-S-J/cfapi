import path from 'node:path';
import fs from 'node:fs/promises';

import parseSchema from '../utils/parseSchema.js';
import getEngineHandler from '../engines/getEngineHandler.js';
import logger from '../utils/logger.js';

const CONFIG_DIR = 'config';
const CONFIG_NAME = 'cfapi.config.json';

const generateAPI = async (schemaPath, outputDir, engine) => {
  try {
    logger.info(' Starting API generation...');

    const configDir = path.join(outputDir, CONFIG_DIR);
    const configPath = path.join(configDir, CONFIG_NAME);

    // Prevent regeneration if already exists
    try {
      await fs.access(configPath);
      logger.error('   API project already exists in this directory.');
      logger.info('   Generation aborted to avoid overwriting.');
      return;
    } catch {
      // Config file not found — proceed
    }

    // Step 1: Parse + normalize schema
    const models = await parseSchema(schemaPath);
    const modelNames = Object.keys(models);

    if (modelNames.length === 0) {
      throw new Error('No models found in schema');
    }

    logger.info(`Models detected: ${modelNames.join(', ')}`);

    // Step 2: Load engine handler
    const engineHandler = getEngineHandler(engine);

    // Step 3: Generate files via engine
    await engineHandler.generateAPI(models, outputDir);

    // Step 4: Write config to mark as initialized
    const config = {
      engine,
      models: modelNames,
      createdAt: new Date().toISOString(),
    };

    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    logger.info(`Config written: ${path.relative(process.cwd(), configPath)}`);
    logger.info(`Project initialized successfully at ${outputDir}`);
  } catch (err) {
    logger.error(`generateAPI failed: ${err.message}`);
    throw err;
  }
};

export default generateAPI;
