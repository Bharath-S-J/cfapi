import user from '../models/user.js';

/**
 * Controller for user
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

export const getAllusers = async (req, res) => {
  try {
    const items = await user.find();
    res.json(formatDocuments(items));
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
};

export const getuserById = async (req, res) => {
  try {
    const item = await user.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'NotFound', message: 'user not found' });
    res.json(formatDocument(item));
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
};

export const createuser = async (req, res) => {
  try {
    const newItem = new user(req.body);
    await newItem.save();
    const savedItem = await user.findById(newItem._id);
    res.status(201).json(formatDocument(savedItem));
  } catch (err) {
    res.status(400).json({ error: 'ValidationError', message: err.message });
  }
};

export const updateuser = async (req, res) => {
  try {
    const updated = await user.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'NotFound', message: 'user not found' });
    res.json(formatDocument(updated));
  } catch (err) {
    res.status(400).json({ error: 'ValidationError', message: err.message });
  }
};

export const patchuser = async (req, res) => {
  try {
    const updated = await user.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'NotFound', message: 'user not found' });
    res.json(formatDocument(updated));
  } catch (err) {
    res.status(400).json({ error: 'ValidationError', message: err.message });
  }
};

export const deleteuser = async (req, res) => {
  try {
    const deleted = await user.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'NotFound', message: 'user not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
};
