import logger from '../utils/logger.js';
import mockEngine from './mockEngine.js';
 import mongoEngine from './mongoEngine.js';

const getEngineHandler = (engine) => {
  switch (engine.toLowerCase()) {
    case 'mock':
      logger.info('Using engine: mock');
      return mockEngine;

    case 'mongo':
      logger.info('Using engine: mongodb');
      return mongoEngine;

    default:
      logger.error(`Unknown engine "${engine}"`);
      throw new Error(`Unsupported engine: "${engine}"`);
  }
};

export default getEngineHandler;
