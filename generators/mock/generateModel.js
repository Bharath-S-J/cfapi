import path from 'node:path';
import { safeWrite } from '../../utils/fileUtils.js';
import logger from '../../utils/logger.js';

const generateModel = async (modelName, schema, outputDir) => {
  const jsSchema = JSON.stringify(schema, null, 2)
    .replace(/"([^"]+)":/g, '$1:')    
    .replace(/"([^"]+)"/g, `'$1'`);  

  const content = `
// Auto-generated model for ${modelName}

export const schema = ${jsSchema};

export default {
  name: '${modelName}',
  schema,
};
`;

  const filePath = path.join(outputDir, 'models', `${modelName}.js`);
  await safeWrite(filePath, content.trim() + '\n', `model ${modelName}`);
  logger.info(`Created model: ${modelName}`);
};

export default generateModel;
