import path from 'node:path';
import { ensureDir, safeWrite } from './fileUtils.js';

export default async function writeOpenApiModel(modelName, schema, outputDir) {
  const dir = path.join(outputDir, 'openapi-models');
  await ensureDir(dir);

  const filePath = path.join(dir, `${modelName}.json`);
  const content = JSON.stringify(schema, null, 2);
  await safeWrite(filePath, content, `OpenAPI model for ${modelName}`);
}
