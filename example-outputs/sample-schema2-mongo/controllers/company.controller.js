import company from '../models/company.js';

/**
 * Controller for company
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

export const getAllcompanies = async (req, res) => {
  try {
    const items = await company.find();
    res.json(formatDocuments(items));
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
};

export const getcompanyById = async (req, res) => {
  try {
    const item = await company.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'NotFound', message: 'company not found' });
    res.json(formatDocument(item));
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
};

export const createcompany = async (req, res) => {
  try {
    const newItem = new company(req.body);
    await newItem.save();
    const savedItem = await company.findById(newItem._id);
    res.status(201).json(formatDocument(savedItem));
  } catch (err) {
    res.status(400).json({ error: 'ValidationError', message: err.message });
  }
};

export const updatecompany = async (req, res) => {
  try {
    const updated = await company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'NotFound', message: 'company not found' });
    res.json(formatDocument(updated));
  } catch (err) {
    res.status(400).json({ error: 'ValidationError', message: err.message });
  }
};

export const patchcompany = async (req, res) => {
  try {
    const updated = await company.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'NotFound', message: 'company not found' });
    res.json(formatDocument(updated));
  } catch (err) {
    res.status(400).json({ error: 'ValidationError', message: err.message });
  }
};

export const deletecompany = async (req, res) => {
  try {
    const deleted = await company.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'NotFound', message: 'company not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
};
