import path from 'node:path';
import { safeWrite } from '../../utils/fileUtils.js';
import logger from '../../utils/logger.js';

const INDENT = (level = 1) => '  '.repeat(level);

// Convert schema field to string
function convertField(field, indent = 2) {
  const lines = [];
  const i = INDENT(indent);

  // Handle references
  if (field.type === 'ref') {
    const options = [];
    options.push(`type: Schema.Types.ObjectId`);
    options.push(`ref: "${field.model}"`);
    if (field.required) options.push(`required: true`);
    if (field.unique) options.push(`unique: true`);
    if (field.default !== undefined) options.push(`default: ${JSON.stringify(field.default)}`);
    return `{\n${i}${options.join(`,\n${i}`)}\n${INDENT(indent - 1)}}`;
  }

  // Handle arrays
  if (field.type === 'array') {
    const itemStr = convertField(field.items || { type: 'string' }, indent + 2);
    const arrayField = `[\n${INDENT(indent)}${itemStr}\n${INDENT(indent - 1)}]`;
    const constraints = [];

    if (field.required) constraints.push(`required: true`);
    if (field.minItems !== undefined)
      constraints.push(`validate: [v => v.length >= ${field.minItems}, 'Minimum ${field.minItems} items required']`);
    if (field.maxItems !== undefined)
      constraints.push(`validate: [v => v.length <= ${field.maxItems}, 'Maximum ${field.maxItems} items allowed']`);

    return constraints.length
      ? `{\n${i}type: ${arrayField},\n${i}${constraints.join(`,\n${i}`)}\n${INDENT(indent - 1)}}`
      : arrayField;
  }

  // Handle nested objects
  if (field.type === 'object' && field.properties) {
    const nestedProps = Object.entries(field.properties)
      .map(([key, val]) => `${INDENT(indent)}${key}: ${convertField(val, indent + 1)}`)
      .join(',\n');
    const objectSchema = `new Schema({\n${nestedProps}\n${INDENT(indent - 1)}})`;
    return field.required ? `{ type: ${objectSchema}, required: true }` : objectSchema;
  }

  // Handle primitives
  const fieldOptions = [];
  fieldOptions.push(`type: ${getType(field.type)}`);
  if (field.required) fieldOptions.push(`required: true`);
  if (field.unique) fieldOptions.push(`unique: true`);
  if (field.default !== undefined) fieldOptions.push(`default: ${JSON.stringify(field.default)}`);

  if (['string', 'email', 'url', 'uuid'].includes(field.type)) {
    if (field.minLength !== undefined) fieldOptions.push(`minlength: ${field.minLength}`);
    if (field.maxLength !== undefined) fieldOptions.push(`maxlength: ${field.maxLength}`);
    if (field.pattern) fieldOptions.push(`match: ${formatRegex(field.pattern)}`);
    if (field.enum) fieldOptions.push(`enum: ${JSON.stringify(field.enum)}`);
  }

  if (['number', 'integer'].includes(field.type)) {
    if (field.minimum !== undefined) fieldOptions.push(`min: ${field.minimum}`);
    if (field.maximum !== undefined) fieldOptions.push(`max: ${field.maximum}`);
  }

  if (field.type === 'date' && field.default === 'now') {
    const idx = fieldOptions.findIndex(opt => opt.startsWith('default:'));
    if (idx !== -1) fieldOptions.splice(idx, 1, `default: Date.now`);
  }

  return `{\n${i}${fieldOptions.join(`,\n${i}`)}\n${INDENT(indent - 1)}}`;
}

// Helper to map types
function getType(type) {
  switch (type) {
    case 'string':
    case 'email':
    case 'url':
    case 'uuid':
      return 'String';
    case 'number':
    case 'integer':
      return 'Number';
    case 'boolean':
      return 'Boolean';
    case 'date':
      return 'Date';
    case 'ref':
      return 'Schema.Types.ObjectId';
    default:
      return 'Schema.Types.Mixed';
  }
}

function formatRegex(pattern) {
  try {
    const regex = new RegExp(pattern);
    return regex.toString();
  } catch {
    return `new RegExp(${JSON.stringify(pattern)})`;
  }
}

// Main function to generate model file
export default async function generateModel(modelName, parsedSchema, outputDir) {
  const schemaFields = Object.entries(parsedSchema.properties || {})
    .filter(([key]) => key !== 'id')
    .map(([key, value]) => `${INDENT()}${key}: ${convertField(value, 2)}`)
    .join(',\n');

  const code = `import mongoose from 'mongoose';
const { Schema } = mongoose;

const ${modelName}Schema = new Schema({
${schemaFields}
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const ${modelName} = mongoose.model('${modelName}', ${modelName}Schema);

export default ${modelName};
export { ${modelName}Schema };
`;

  const filePath = path.join(outputDir, 'models', `${modelName}.js`);
  await safeWrite(filePath, code);
  logger.success(`Mongo model for ${modelName} generated.`);
}
