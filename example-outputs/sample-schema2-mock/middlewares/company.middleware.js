// Auto-generated middleware for company
import fs from 'node:fs';
import path from 'node:path';

const validatecompany = (req, res, next) => {
  const errors = [];
  if (typeof req.body !== 'object' || Array.isArray(req.body) || req.body === null) {
    errors.push({ field: 'body', message: "Request body must be an object" });
  } else {
    const allowedKeys = ["name","website","location"];
    for (const key of Object.keys(req.body)) {
      if (!allowedKeys.includes(key)) {
        errors.push({ field: key, message: "Field is not allowed" });
      }
    }
  }
  // Validation for name
  {
    const fieldErrors = [];
    const fieldValue = req.body.name;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'name', messages: fieldErrors });
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
  // Validation for location
  {
    const fieldErrors = [];
    const fieldValue = req.body.location;
    if (fieldValue !== undefined) {
  // Validation for location.city
  {
    const fieldErrors = [];
    const fieldValue = req.body.location.city;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'location.city', messages: fieldErrors });
    }
  }
  // Validation for location.country
  {
    const fieldErrors = [];
    const fieldValue = req.body.location.country;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'location.country', messages: fieldErrors });
    }
  }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'location', messages: fieldErrors });
    }
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

const validatePatchcompany = (req, res, next) => {
  const errors = [];
  if (typeof req.body !== 'object' || Array.isArray(req.body) || req.body === null) {
    errors.push({ field: 'body', message: "Request body must be an object" });
  } else {
    const allowedKeys = ["name","website","location"];
    for (const key of Object.keys(req.body)) {
      if (!allowedKeys.includes(key)) {
        errors.push({ field: key, message: "Field is not allowed" });
      }
    }
  }
  // Validation for name
  {
    const fieldErrors = [];
    const fieldValue = req.body.name;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'name', messages: fieldErrors });
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
  // Validation for location
  {
    const fieldErrors = [];
    const fieldValue = req.body.location;
    if (fieldValue !== undefined) {
  // Validation for location.city
  {
    const fieldErrors = [];
    const fieldValue = req.body.location.city;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'location.city', messages: fieldErrors });
    }
  }
  // Validation for location.country
  {
    const fieldErrors = [];
    const fieldValue = req.body.location.country;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'location.country', messages: fieldErrors });
    }
  }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'location', messages: fieldErrors });
    }
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

const validatePutcompany = (req, res, next) => {
  const errors = [];
  if (typeof req.body !== 'object' || Array.isArray(req.body) || req.body === null) {
    errors.push({ field: 'body', message: "Request body must be an object" });
  } else {
    const allowedKeys = ["name","website","location"];
    for (const key of Object.keys(req.body)) {
      if (!allowedKeys.includes(key)) {
        errors.push({ field: key, message: "Field is not allowed" });
      }
    }
  }
  // Validation for name
  {
    const fieldErrors = [];
    const fieldValue = req.body.name;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'name', messages: fieldErrors });
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
  // Validation for location
  {
    const fieldErrors = [];
    const fieldValue = req.body.location;
    if (fieldValue !== undefined) {
  // Validation for location.city
  {
    const fieldErrors = [];
    const fieldValue = req.body.location.city;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'location.city', messages: fieldErrors });
    }
  }
  // Validation for location.country
  {
    const fieldErrors = [];
    const fieldValue = req.body.location.country;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'location.country', messages: fieldErrors });
    }
  }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'location', messages: fieldErrors });
    }
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

export default validatecompany;
export { validatePatchcompany, validatePutcompany };
