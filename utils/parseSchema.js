import fs from 'node:fs/promises';
import path from 'node:path';
import logger from './logger.js';
import chalk from 'chalk';


const VALID_TYPES = new Set([
  'string', 'number', 'integer', 'boolean',
  'email', 'uuid', 'date', 'url',
  'object', 'array', 'ref',
]);

const VALID_RULES = new Set([
  'required', 'minLength', 'maxLength',
  'minimum', 'maximum', 'pattern', 'enum',
  'unique',
]);

const printSchemaHelp = () => {
  console.log(chalk.yellow.bold(`\n  Schema Validation Error`));
  console.log(chalk.yellow(`The provided schema is invalid. Here's an example of a valid schema:\n`));

  console.log(chalk.yellow(`\n Supported Field Types:`));
  console.log(chalk.yellow(`  • string, number, integer, boolean`));
  console.log(chalk.yellow(`  • email, uuid, date, url`));
  console.log(chalk.yellow(`  • object, array, ref, enum`));

  console.log(chalk.yellow(`\n Supported Validation Rules:`));
  console.log(chalk.yellow(`  • required`));
  console.log(chalk.yellow(`  • minLength / maxLength (for strings)`));
  console.log(chalk.yellow(`  • minimum / maximum (for numbers)`));
  console.log(chalk.yellow(`  • pattern (RegExp as string)`));
  console.log(chalk.yellow(`  • enum (array of allowed values)`));
  console.log(chalk.yellow(`  • unique (boolean)`));
  console.log(chalk.yellow(`  • minItems / maxItems (for arrays)`));
  console.log(chalk.yellow(`  • default (optional value)`));

  console.log(chalk.yellow(`\n Notes:`));
  console.log(chalk.yellow(`  • Every field must include a "type"`));
  console.log(chalk.yellow(`  • For "ref", provide a "model" string`));
  console.log(chalk.yellow(`  • For "object", define nested "properties"`));
  console.log(chalk.yellow(`  • For "array", define "items" with valid type`));
  console.log(chalk.yellow(`  • "timestamps: true" adds createdAt and updatedAt fields`));

  console.log(chalk.yellow(`\n\n For help type 'cfapi -h' or 'cfapi --help':`));
  console.log();
};



/**
 * Validates that the type is among allowed schema types.
 * @param {string} type
 * @param {string} fieldName
 */
const validateType = (type, fieldName) => {
  if (!VALID_TYPES.has(type)) {
    throw new Error(` Invalid type "${type}" in field "${fieldName}"`);
  }
};

/**
 * Recursively normalizes a schema field to full format.
 * @param {any} field
 * @param {string} fieldName
 * @returns {object}
 */
const normalizeField = (field, fieldName) => {
  // Shorthand: name: "string"
  if (typeof field === 'string') {
    validateType(field, fieldName);
    return { type: field, required: true };
  }

  // Full form must be an object with a valid type
  if (typeof field !== 'object' || field === null || !field.type) {
    throw new Error(` Missing or invalid 'type' in field "${fieldName}"`);
  }

  const type = field.type;
  validateType(type, fieldName);

  const normalized = { type, required: field.required ?? false };

  if (type === 'object') {
    if (!field.properties || typeof field.properties !== 'object') {
      throw new Error(` 'properties' must be defined for object "${fieldName}"`);
    }
    normalized.properties = {};
    for (const [key, val] of Object.entries(field.properties)) {
      normalized.properties[key] = normalizeField(val, `${fieldName}.${key}`);
    }
  }

  if (type === 'array') {
    if (!field.items) {
      throw new Error(` 'items' must be defined for array "${fieldName}"`);
    }
    normalized.items = normalizeField(field.items, `${fieldName}[]`);
    if ('minItems' in field) normalized.minItems = field.minItems;
    if ('maxItems' in field) normalized.maxItems = field.maxItems;
  }

  if (type === 'ref') {
    if (!field.model || typeof field.model !== 'string') {
      throw new Error(` 'model' must be defined and a string for ref "${fieldName}"`);
    }
    normalized.model = field.model;
  }

  for (const rule of VALID_RULES) {
    if (rule in field) {
      if (rule === 'pattern' && typeof field[rule] !== 'string') {
        throw new Error(` 'pattern' in field "${fieldName}" must be a string`);
      }
      if (rule === 'enum' && !Array.isArray(field[rule])) {
        throw new Error(` 'enum' in field "${fieldName}" must be an array`);
      }
      normalized[rule] = field[rule];
    }
  }

  return normalized;
};

/**
 * Loads and normalizes all models from a schema JSON file.
 * @param {string} schemaPath - Path to schema JSON file
 * @returns {Promise<Record<string, any>>}
 */
const parseSchema = async (schemaPath) => {
  try {
    const raw = await fs.readFile(path.resolve(schemaPath), 'utf-8');
    const json = JSON.parse(raw);
    const parsed = {};

    for (const [modelName, modelDef] of Object.entries(json)) {
      const model = {};
      const isFullForm = typeof modelDef === 'object' && modelDef.type === 'object';

      const timestamps = isFullForm && modelDef.timestamps === true;
      const props = isFullForm ? modelDef.properties : modelDef;

      if (!props || typeof props !== 'object') {
        throw new Error(` Invalid or missing properties in model "${modelName}"`);
      }

      model.properties = {};

      for (const [fieldName, fieldDef] of Object.entries(props)) {
        model.properties[fieldName] = normalizeField(fieldDef, fieldName);
      }

      if (timestamps) {
        model.timestamps = true;
        model.properties.createdAt = { type: 'date', required: false };
        model.properties.updatedAt = { type: 'date', required: false };
      }

      parsed[modelName] = model;
    }

    logger.info(` Parsed schema successfully from: ${schemaPath}`);
    return parsed;

  } catch (err) {
    logger.error(` Schema parsing failed: ${err.message}`);
    printSchemaHelp();
    throw err;
  }
};

export default parseSchema;
