import path from 'node:path';
import { safeWrite } from '../../utils/fileUtils.js';
import logger from '../../utils/logger.js';
import pluralize from 'pluralize';

const generateController = async (modelName, schema, outputDir) => {
    const plural = pluralize(modelName);

  const content = `import path from 'path';
import { promises as fs } from 'fs';

const dataPath = path.resolve('data/${modelName}.json');

const readData = async () => {
  const raw = await fs.readFile(dataPath, 'utf-8');
  return JSON.parse(raw);
};

const writeData = async (data) => {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
};

export const getAll${plural} = async (req, res) => {
  try {
    const items = await readData();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to load ${plural}' });
  }
};

export const get${modelName}ById = async (req, res) => {
  try {
    const items = await readData();
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'NotFound', message: '${modelName} not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to retrieve ${modelName}' });
  }
};

export const create${modelName} = async (req, res) => {
  try {
    const items = await readData();
    const newItem = { ...req.body, id: Date.now().toString() };
    items.push(newItem);
    await writeData(items);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to create ${modelName}' });
  }
};

export const update${modelName} = async (req, res) => {
  try {
    const items = await readData();
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'NotFound', message: '${modelName} not found' });
    }

    items[index] = { id: req.params.id, ...req.body };
    await writeData(items);
    res.json(items[index]);
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to update ${modelName}' });
  }
};

export const patch${modelName} = async (req, res) => {
  try {
    const items = await readData();
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'NotFound', message: '${modelName} not found' });
    }

    const updatedItem = {
      ...items[index],
      ...req.body,
      id: req.params.id
    };

    items[index] = updatedItem;
    await writeData(items);
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to patch ${modelName}' });
  }
};

export const delete${modelName} = async (req, res) => {
  try {
    const items = await readData();
    const filtered = items.filter(i => i.id !== req.params.id);
    if (filtered.length === items.length) {
      return res.status(404).json({ error: 'NotFound', message: '${modelName} not found' });
    }
    await writeData(filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to delete ${modelName}' });
  }
};
`;

  const filePath = path.join(outputDir, 'controllers', `${modelName}.controller.js`);
  await safeWrite(filePath, content, `controller for ${modelName}`);
  logger.info(`Created controller: ${modelName}`);
};

export default generateController;
