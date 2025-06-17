// Auto-generated middleware for user
import fs from 'node:fs';
import path from 'node:path';

const validateuser = (req, res, next) => {
  const errors = [];
  if (typeof req.body !== 'object' || Array.isArray(req.body) || req.body === null) {
    errors.push({ field: 'body', message: "Request body must be an object" });
  } else {
    const allowedKeys = ["id","username","email","age","isActive","role","website","bio","tags","address","createdAt"];
    for (const key of Object.keys(req.body)) {
      if (!allowedKeys.includes(key)) {
        errors.push({ field: key, message: "Field is not allowed" });
      }
    }
  }
  // Validation for id
  {
    const fieldErrors = [];
    const fieldValue = req.body.id;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'id', messages: fieldErrors });
    }
  }
  // Validation for username
  {
    const fieldErrors = [];
    const fieldValue = req.body.username;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (fieldValue.length < 3) fieldErrors.push("Must be at least 3 characters");
      if (fieldValue.length > 20) fieldErrors.push("Must be at most 20 characters");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'username', messages: fieldErrors });
    }
  }
  // Validation for email
  {
    const fieldErrors = [];
    const fieldValue = req.body.email;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'email', messages: fieldErrors });
    }
  }
  // Validation for age
  {
    const fieldErrors = [];
    const fieldValue = req.body.age;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'number') fieldErrors.push("Must be a number");
      if (fieldValue < 18) fieldErrors.push("Must be >= 18");
      if (fieldValue > 100) fieldErrors.push("Must be <= 100");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'age', messages: fieldErrors });
    }
  }
  // Validation for isActive
  {
    const fieldErrors = [];
    const fieldValue = req.body.isActive;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'boolean') fieldErrors.push("Must be a boolean");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'isActive', messages: fieldErrors });
    }
  }
  // Validation for role
  {
    const fieldErrors = [];
    const fieldValue = req.body.role;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (!["user","admin","moderator"].includes(fieldValue)) fieldErrors.push("Must be one of ['user', 'admin', 'moderator']");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'role', messages: fieldErrors });
    }
  }
  // Validation for website
  {
    const fieldErrors = [];
    const fieldValue = req.body.website;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'website', messages: fieldErrors });
    }
  }
  // Validation for bio
  {
    const fieldErrors = [];
    const fieldValue = req.body.bio;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (fieldValue.length > 500) fieldErrors.push("Must be at most 500 characters");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'bio', messages: fieldErrors });
    }
  }
  // Validation for tags
  {
    const fieldErrors = [];
    const fieldValue = req.body.tags;
    if (fieldValue !== undefined) {
      if (!Array.isArray(fieldValue)) fieldErrors.push("Must be an array");
      if (fieldValue.length < 1) fieldErrors.push("Must have at least 1 items");
      if (fieldValue.length > 5) fieldErrors.push("Must have at most 5 items");
      if (Array.isArray(fieldValue)) {
        fieldValue.forEach((item, i) => {
          if (typeof item !== 'string') fieldErrors.push("Elements must be of type string");
        });
      }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'tags', messages: fieldErrors });
    }
  }
  // Validation for address
  {
    const fieldErrors = [];
    const fieldValue = req.body.address;
    if (fieldValue !== undefined) {
  // Validation for address.street
  {
    const fieldErrors = [];
    const fieldValue = req.body.address.street;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'address.street', messages: fieldErrors });
    }
  }
  // Validation for address.city
  {
    const fieldErrors = [];
    const fieldValue = req.body.address.city;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'address.city', messages: fieldErrors });
    }
  }
  // Validation for address.postalCode
  {
    const fieldErrors = [];
    const fieldValue = req.body.address.postalCode;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (!(new RegExp("^[0-9]{5}$")).test(fieldValue)) fieldErrors.push("Does not match required pattern");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'address.postalCode', messages: fieldErrors });
    }
  }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'address', messages: fieldErrors });
    }
  }
  // Validation for createdAt
  {
    const fieldErrors = [];
    const fieldValue = req.body.createdAt;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'createdAt', messages: fieldErrors });
    }
  }
  
  try {
    const filePath = path.resolve('data', 'user.json');
    const file = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(file);
    const uniquenessErrors = new Set();
    const referenceErrors = new Set();
    if (req.body.username !== undefined && !uniquenessErrors.has('username')) {
      const exists = data.some(item => item.username === req.body.username);
      if (exists) {
        uniquenessErrors.add('username');
        errors.push({ field: 'username', message: "Must be unique" });
      }
    }
    if (req.body.email !== undefined && !uniquenessErrors.has('email')) {
      const exists = data.some(item => item.email === req.body.email);
      if (exists) {
        uniquenessErrors.add('email');
        errors.push({ field: 'email', message: "Must be unique" });
      }
    }
  } catch (e) {
    // Silent fail for missing model data
  }

  if (errors.length) {
    return res.status(400).json({ 
      errors: errors.map(err => ({
        field: err.field,
        message: err.messages ? err.messages.join('; ') : err.message
      }))
    });
  }
  next();
};

const validatePatchuser = (req, res, next) => {
  const errors = [];
  if (typeof req.body !== 'object' || Array.isArray(req.body) || req.body === null) {
    errors.push({ field: 'body', message: "Request body must be an object" });
  } else {
    const allowedKeys = ["id","username","email","age","isActive","role","website","bio","tags","address","createdAt"];
    for (const key of Object.keys(req.body)) {
      if (!allowedKeys.includes(key)) {
        errors.push({ field: key, message: "Field is not allowed" });
      }
    }
  }
  // Skipping validation for root-level 'id' on PUT/PATCH
  // Validation for username
  {
    const fieldErrors = [];
    const fieldValue = req.body.username;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (fieldValue.length < 3) fieldErrors.push("Must be at least 3 characters");
      if (fieldValue.length > 20) fieldErrors.push("Must be at most 20 characters");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'username', messages: fieldErrors });
    }
  }
  // Validation for email
  {
    const fieldErrors = [];
    const fieldValue = req.body.email;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'email', messages: fieldErrors });
    }
  }
  // Validation for age
  {
    const fieldErrors = [];
    const fieldValue = req.body.age;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'number') fieldErrors.push("Must be a number");
      if (fieldValue < 18) fieldErrors.push("Must be >= 18");
      if (fieldValue > 100) fieldErrors.push("Must be <= 100");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'age', messages: fieldErrors });
    }
  }
  // Validation for isActive
  {
    const fieldErrors = [];
    const fieldValue = req.body.isActive;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'boolean') fieldErrors.push("Must be a boolean");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'isActive', messages: fieldErrors });
    }
  }
  // Validation for role
  {
    const fieldErrors = [];
    const fieldValue = req.body.role;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (!["user","admin","moderator"].includes(fieldValue)) fieldErrors.push("Must be one of ['user', 'admin', 'moderator']");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'role', messages: fieldErrors });
    }
  }
  // Validation for website
  {
    const fieldErrors = [];
    const fieldValue = req.body.website;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'website', messages: fieldErrors });
    }
  }
  // Validation for bio
  {
    const fieldErrors = [];
    const fieldValue = req.body.bio;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (fieldValue.length > 500) fieldErrors.push("Must be at most 500 characters");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'bio', messages: fieldErrors });
    }
  }
  // Validation for tags
  {
    const fieldErrors = [];
    const fieldValue = req.body.tags;
    if (fieldValue !== undefined) {
      if (!Array.isArray(fieldValue)) fieldErrors.push("Must be an array");
      if (fieldValue.length < 1) fieldErrors.push("Must have at least 1 items");
      if (fieldValue.length > 5) fieldErrors.push("Must have at most 5 items");
      if (Array.isArray(fieldValue)) {
        fieldValue.forEach((item, i) => {
          if (typeof item !== 'string') fieldErrors.push("Elements must be of type string");
        });
      }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'tags', messages: fieldErrors });
    }
  }
  // Validation for address
  {
    const fieldErrors = [];
    const fieldValue = req.body.address;
    if (fieldValue !== undefined) {
  // Validation for address.street
  {
    const fieldErrors = [];
    const fieldValue = req.body.address.street;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'address.street', messages: fieldErrors });
    }
  }
  // Validation for address.city
  {
    const fieldErrors = [];
    const fieldValue = req.body.address.city;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'address.city', messages: fieldErrors });
    }
  }
  // Validation for address.postalCode
  {
    const fieldErrors = [];
    const fieldValue = req.body.address.postalCode;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (!(new RegExp("^[0-9]{5}$")).test(fieldValue)) fieldErrors.push("Does not match required pattern");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'address.postalCode', messages: fieldErrors });
    }
  }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'address', messages: fieldErrors });
    }
  }
  // Validation for createdAt
  {
    const fieldErrors = [];
    const fieldValue = req.body.createdAt;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'createdAt', messages: fieldErrors });
    }
  }
  
  try {
    const filePath = path.resolve('data', 'user.json');
    const file = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(file);
    const uniquenessErrors = new Set();
    const referenceErrors = new Set();
    if (req.body.username !== undefined && !uniquenessErrors.has('username')) {
      const exists = data.some(item => item.username === req.body.username && item.id !== req.params.id);
      if (exists) {
        uniquenessErrors.add('username');
        errors.push({ field: 'username', message: "Must be unique" });
      }
    }
    if (req.body.email !== undefined && !uniquenessErrors.has('email')) {
      const exists = data.some(item => item.email === req.body.email && item.id !== req.params.id);
      if (exists) {
        uniquenessErrors.add('email');
        errors.push({ field: 'email', message: "Must be unique" });
      }
    }
  } catch (e) {
    // Silent fail for missing model data
  }

  if (errors.length) {
    return res.status(400).json({ 
      errors: errors.map(err => ({
        field: err.field,
        message: err.messages ? err.messages.join('; ') : err.message
      }))
    });
  }
  next();
};

const validatePutuser = (req, res, next) => {
  const errors = [];
  if (typeof req.body !== 'object' || Array.isArray(req.body) || req.body === null) {
    errors.push({ field: 'body', message: "Request body must be an object" });
  } else {
    const allowedKeys = ["id","username","email","age","isActive","role","website","bio","tags","address","createdAt"];
    for (const key of Object.keys(req.body)) {
      if (!allowedKeys.includes(key)) {
        errors.push({ field: key, message: "Field is not allowed" });
      }
    }
  }
  // Skipping validation for root-level 'id' on PUT/PATCH
  // Validation for username
  {
    const fieldErrors = [];
    const fieldValue = req.body.username;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (fieldValue.length < 3) fieldErrors.push("Must be at least 3 characters");
      if (fieldValue.length > 20) fieldErrors.push("Must be at most 20 characters");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'username', messages: fieldErrors });
    }
  }
  // Validation for email
  {
    const fieldErrors = [];
    const fieldValue = req.body.email;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'email', messages: fieldErrors });
    }
  }
  // Validation for age
  {
    const fieldErrors = [];
    const fieldValue = req.body.age;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'number') fieldErrors.push("Must be a number");
      if (fieldValue < 18) fieldErrors.push("Must be >= 18");
      if (fieldValue > 100) fieldErrors.push("Must be <= 100");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'age', messages: fieldErrors });
    }
  }
  // Validation for isActive
  {
    const fieldErrors = [];
    const fieldValue = req.body.isActive;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'boolean') fieldErrors.push("Must be a boolean");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'isActive', messages: fieldErrors });
    }
  }
  // Validation for role
  {
    const fieldErrors = [];
    const fieldValue = req.body.role;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (!["user","admin","moderator"].includes(fieldValue)) fieldErrors.push("Must be one of ['user', 'admin', 'moderator']");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'role', messages: fieldErrors });
    }
  }
  // Validation for website
  {
    const fieldErrors = [];
    const fieldValue = req.body.website;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'website', messages: fieldErrors });
    }
  }
  // Validation for bio
  {
    const fieldErrors = [];
    const fieldValue = req.body.bio;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (fieldValue.length > 500) fieldErrors.push("Must be at most 500 characters");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'bio', messages: fieldErrors });
    }
  }
  // Validation for tags
  {
    const fieldErrors = [];
    const fieldValue = req.body.tags;
    if (fieldValue !== undefined) {
      if (!Array.isArray(fieldValue)) fieldErrors.push("Must be an array");
      if (fieldValue.length < 1) fieldErrors.push("Must have at least 1 items");
      if (fieldValue.length > 5) fieldErrors.push("Must have at most 5 items");
      if (Array.isArray(fieldValue)) {
        fieldValue.forEach((item, i) => {
          if (typeof item !== 'string') fieldErrors.push("Elements must be of type string");
        });
      }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'tags', messages: fieldErrors });
    }
  }
  // Validation for address
  {
    const fieldErrors = [];
    const fieldValue = req.body.address;
    if (fieldValue !== undefined) {
  // Validation for address.street
  {
    const fieldErrors = [];
    const fieldValue = req.body.address.street;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'address.street', messages: fieldErrors });
    }
  }
  // Validation for address.city
  {
    const fieldErrors = [];
    const fieldValue = req.body.address.city;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'address.city', messages: fieldErrors });
    }
  }
  // Validation for address.postalCode
  {
    const fieldErrors = [];
    const fieldValue = req.body.address.postalCode;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (!(new RegExp("^[0-9]{5}$")).test(fieldValue)) fieldErrors.push("Does not match required pattern");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'address.postalCode', messages: fieldErrors });
    }
  }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'address', messages: fieldErrors });
    }
  }
  // Validation for createdAt
  {
    const fieldErrors = [];
    const fieldValue = req.body.createdAt;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'createdAt', messages: fieldErrors });
    }
  }
  
  try {
    const filePath = path.resolve('data', 'user.json');
    const file = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(file);
    const uniquenessErrors = new Set();
    const referenceErrors = new Set();
    if (req.body.username !== undefined && !uniquenessErrors.has('username')) {
      const exists = data.some(item => item.username === req.body.username && item.id !== req.params.id);
      if (exists) {
        uniquenessErrors.add('username');
        errors.push({ field: 'username', message: "Must be unique" });
      }
    }
    if (req.body.email !== undefined && !uniquenessErrors.has('email')) {
      const exists = data.some(item => item.email === req.body.email && item.id !== req.params.id);
      if (exists) {
        uniquenessErrors.add('email');
        errors.push({ field: 'email', message: "Must be unique" });
      }
    }
  } catch (e) {
    // Silent fail for missing model data
  }

  if (errors.length) {
    return res.status(400).json({ 
      errors: errors.map(err => ({
        field: err.field,
        message: err.messages ? err.messages.join('; ') : err.message
      }))
    });
  }
  next();
};

export default validateuser;
export { validatePatchuser, validatePutuser };
