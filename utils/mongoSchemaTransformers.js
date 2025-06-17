import mongoose from 'mongoose';
const { Schema, Types } = mongoose;

/**
 * Maps a normalized type string to a Mongoose type constructor.
 * @param {string} type
 * @returns {any} Mongoose-compatible type
 */
const mapType = (type) => {
  const typeMap = {
    string: String,
    email: String,
    uuid: String,
    url: String,
    date: Date,
    number: Number,
    integer: Number,
    boolean: Boolean,
    object: Object,
    array: Array,
    ref: Types.ObjectId,
  };
  return typeMap[type] || String;
};

/**
 * Recursively builds a field definition compatible with Mongoose schema.
 * @param {object} field
 * @returns {object} Mongoose field schema definition
 */
const buildFieldSchema = (field) => {
  const {
    type,
    required,
    unique,
    default: defaultValue,
    enum: enumValues,
    pattern,
    minLength,
    maxLength,
    minimum,
    maximum,
    items,
    properties,
    model,
    minItems,
    maxItems,
  } = field;

  // Reference field
  if (type === 'ref') {
    return {
      type: Types.ObjectId,
      ref: model,
      ...(required !== false && { required: true }),
      ...(unique && { unique: true }),
      ...(defaultValue !== undefined && { default: defaultValue }),
    };
  }

  // Array field
  if (type === 'array') {
    return {
      type: [buildFieldSchema(items || { type: 'string' })],
      ...(required && { required: true }),
      ...(minItems !== undefined && { minlength: minItems }),
      ...(maxItems !== undefined && { maxlength: maxItems }),
    };
  }

  // Object (nested schema)
  if (type === 'object' && properties) {
    const nestedFields = {};
    for (const [key, val] of Object.entries(properties)) {
      nestedFields[key] = buildFieldSchema(val);
    }
    return {
      type: new Schema(nestedFields, { _id: false }),
      ...(required && { required: true }),
    };
  }

  // Basic field
  const schemaDef = {
    type: mapType(type),
    ...(required && { required: true }),
    ...(unique && { unique: true }),
    ...(defaultValue !== undefined && {
      default: type === 'date' && defaultValue === 'now' ? Date.now : defaultValue,
    }),
  };

  // String constraints
  if (['string', 'email', 'url', 'uuid'].includes(type)) {
    if (minLength !== undefined) schemaDef.minlength = minLength;
    if (maxLength !== undefined) schemaDef.maxlength = maxLength;
    if (pattern) schemaDef.match = new RegExp(pattern);
    if (enumValues) schemaDef.enum = enumValues;
  }

  // Number constraints
  if (['number', 'integer'].includes(type)) {
    if (minimum !== undefined) schemaDef.min = minimum;
    if (maximum !== undefined) schemaDef.max = maximum;
  }

  return schemaDef;
};

/**
 * Transforms a normalized schema object into Mongoose schema fields.
 * @param {Record<string, any>} properties
 * @returns {Record<string, any>} Mongoose field definitions
 */
export const transformSchemaToMongooseFields = (properties) => {
  const result = {};

  for (const [fieldName, fieldDef] of Object.entries(properties)) {
    if (fieldName === 'id') continue;
    result[fieldName] = buildFieldSchema(fieldDef);
  }

  // Ensure _id is included unless explicitly defined
  if (!result._id) {
    result._id = {
      type: Types.ObjectId,
      default: () => new Types.ObjectId(),
    };
  }

  return result;
};
