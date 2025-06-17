import path from 'path';
import { promises as fs } from 'fs';

const dataPath = path.resolve('data/user.json');

const readData = async () => {
  const raw = await fs.readFile(dataPath, 'utf-8');
  return JSON.parse(raw);
};

const writeData = async (data) => {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
};

export const getAllusers = async (req, res) => {
  try {
    const items = await readData();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to load users' });
  }
};

export const getuserById = async (req, res) => {
  try {
    const items = await readData();
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'NotFound', message: 'user not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to retrieve user' });
  }
};

export const createuser = async (req, res) => {
  try {
    const items = await readData();
    const newItem = { ...req.body, id: Date.now().toString() };
    items.push(newItem);
    await writeData(items);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to create user' });
  }
};

export const updateuser = async (req, res) => {
  try {
    const items = await readData();
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'NotFound', message: 'user not found' });
    }

    items[index] = { id: req.params.id, ...req.body };
    await writeData(items);
    res.json(items[index]);
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to update user' });
  }
};

export const patchuser = async (req, res) => {
  try {
    const items = await readData();
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'NotFound', message: 'user not found' });
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
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to patch user' });
  }
};

export const deleteuser = async (req, res) => {
  try {
    const items = await readData();
    const filtered = items.filter(i => i.id !== req.params.id);
    if (filtered.length === items.length) {
      return res.status(404).json({ error: 'NotFound', message: 'user not found' });
    }
    await writeData(filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to delete user' });
  }
};
