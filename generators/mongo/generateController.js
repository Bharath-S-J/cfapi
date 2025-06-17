import path from 'node:path';
import { safeWrite } from '../../utils/fileUtils.js';
import logger from '../../utils/logger.js';
import pluralize from 'pluralize';

/**
 * Transforms a Mongoose document into plain JSON with `id` instead of `_id`
 */
const formatDocument = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject({ virtuals: false });
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

/**
 * Formats an array of Mongoose documents
 */
const formatDocuments = (docs) => docs.map(formatDocument);

/**
 * Generates controller file for a Mongoose model, with proper population and field normalization.
 */
const generateController = async (modelName, schema, outputDir) => {
    const plural = pluralize(modelName);

  const referenceFields = Object.entries(schema)
    .filter(([_, field]) => field.ref)
    .map(([key]) => key);

  const populateCode = referenceFields.length
    ? `.populate(${JSON.stringify(referenceFields)})`
    : '';

  const content = `import ${modelName} from '../models/${modelName}.js';

/**
 * Controller for ${modelName}
 */

const formatDocument = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject({ virtuals: false });
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

const formatDocuments = (docs) => docs.map(formatDocument);

export const getAll${plural} = async (req, res) => {
  try {
    const items = await ${modelName}.find()${populateCode};
    res.json(formatDocuments(items));
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
};

export const get${modelName}ById = async (req, res) => {
  try {
    const item = await ${modelName}.findById(req.params.id)${populateCode};
    if (!item) return res.status(404).json({ error: 'NotFound', message: '${modelName} not found' });
    res.json(formatDocument(item));
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
};

export const create${modelName} = async (req, res) => {
  try {
    const newItem = new ${modelName}(req.body);
    await newItem.save();
    const savedItem = await ${modelName}.findById(newItem._id)${populateCode};
    res.status(201).json(formatDocument(savedItem));
  } catch (err) {
    res.status(400).json({ error: 'ValidationError', message: err.message });
  }
};

export const update${modelName} = async (req, res) => {
  try {
    const updated = await ${modelName}.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )${populateCode};
    if (!updated) return res.status(404).json({ error: 'NotFound', message: '${modelName} not found' });
    res.json(formatDocument(updated));
  } catch (err) {
    res.status(400).json({ error: 'ValidationError', message: err.message });
  }
};

export const patch${modelName} = async (req, res) => {
  try {
    const updated = await ${modelName}.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )${populateCode};
    if (!updated) return res.status(404).json({ error: 'NotFound', message: '${modelName} not found' });
    res.json(formatDocument(updated));
  } catch (err) {
    res.status(400).json({ error: 'ValidationError', message: err.message });
  }
};

export const delete${modelName} = async (req, res) => {
  try {
    const deleted = await ${modelName}.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'NotFound', message: '${modelName} not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
};
`;

  const filePath = path.join(outputDir, 'controllers', `${modelName}.controller.js`);
  await safeWrite(filePath, content, `controller for ${modelName}`);
  logger.info(`Created controller: ${modelName}`);
};

export default generateController;
