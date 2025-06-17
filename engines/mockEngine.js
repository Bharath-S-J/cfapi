import path from 'node:path';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'url';

import { ensureDir } from '../utils/fileUtils.js';
import logger from '../utils/logger.js';

import generateModel from '../generators/mock/generateModel.js';
import generateController from '../generators/mock/generateController.js';
import generateRoutes from '../generators/mock/generateRoutes.js';
import generateMiddleware from '../generators/mock/generateMiddleware.js';
import generateMockData from '../utils/generateMockData.js';
import writeServerFile from '../generators/mock/writeServerFile.js';
import writeScaffolding from '../generators/mock/writeScaffolding.js';
import generateOpenApi from '../generators/shared/generateOpenApi.js';
import writeOpenApiModel from '../utils/writeOpenApiModel.js';

const initDirectories = async (outputDir) => {
  const folders = ['models', 'controllers', 'routes', 'middlewares', 'data', 'config', 'openapi-models'];
  for (const folder of folders) {
    await ensureDir(path.join(outputDir, folder));
  }
};

const loadAllOpenApiModels = async (dir) => {
  const files = await fs.readdir(dir);
  const models = {};
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const modelName = file.slice(0, -5); // remove .json
    const content = await fs.readFile(path.join(dir, file), 'utf-8');
    models[modelName] = JSON.parse(content);
  }
  return models;
};


const generateAllFilesForModel = async (modelName, parsedSchema, outputDir) => {
  await generateModel(modelName, parsedSchema, outputDir);
  await generateController(modelName, parsedSchema, outputDir);
  await generateRoutes(modelName, outputDir);
  await generateMiddleware(modelName, parsedSchema, outputDir);
  await writeOpenApiModel(modelName, parsedSchema, outputDir); // Write JSON schema to openapi-models/
};

const mockEngine = {
  generateAPI: async (models, outputDir) => {
    if (!models || Object.keys(models).length === 0) {
      throw new Error('No models provided for mock API generation.');
    }

    await initDirectories(outputDir);

    for (const [modelName, parsedSchema] of Object.entries(models)) {
      try {
        await generateAllFilesForModel(modelName, parsedSchema, outputDir);
      } catch (err) {
        logger.error(`Error generating files for model: ${modelName}`);
        throw err;
      }
    }

    await generateMockData(models, outputDir);
    await writeServerFile(Object.keys(models), outputDir, true);
    await writeScaffolding(outputDir, 'mock');

    const openApiModels = await loadAllOpenApiModels(path.join(outputDir, 'openapi-models'));
    await generateOpenApi(openApiModels, outputDir);

    logger.info('Mock API generation complete.');
  },

  addModel: async (models, outputDir, existingModels) => {
    if (!models || Object.keys(models).length === 0) {
      throw new Error('No models provided to add.');
    }

    const existing = Array.isArray(existingModels) ? existingModels : [];
    const newModels = Object.entries(models).filter(([name]) => !existing.includes(name));
    const newModelNames = [];

    for (const [modelName, parsedSchema] of newModels) {
      try {
        await generateAllFilesForModel(modelName, parsedSchema, outputDir);
        newModelNames.push(modelName);
      } catch (err) {
        logger.error(`Error adding model: ${modelName}`);
        throw err;
      }
    }

    if (newModelNames.length) {
      await generateMockData(Object.fromEntries(newModels), outputDir);
      await writeServerFile([...existing, ...newModelNames], outputDir, false);

      const openApiModels = await loadAllOpenApiModels(path.join(outputDir, 'openapi-models'));
      await generateOpenApi(openApiModels, outputDir);

      logger.info(`Added new mock model(s): ${newModelNames.join(', ')}`);
    } else {
      logger.warn('No new models to add.');
    }
  }
};

export default mockEngine;
