import path from 'node:path';
import { safeWrite } from '../../utils/fileUtils.js';
import logger from '../../utils/logger.js';


const buildValidation = (schema, modelName, parentPath = 'req.body', skipRequired = false, isRoot = true, collectUnique = [], collectRefs = [], skipIdOnRoot = false) => {
  const lines = [];

  if (isRoot) {
    const allowedRootKeys = Object.keys(schema);
    lines.push(`if (typeof ${parentPath} !== 'object' || Array.isArray(${parentPath}) || ${parentPath} === null) {`);
    lines.push(`  errors.push({ field: 'body', messages: ["Request body must be an object"] });`);
    lines.push(`} else {`);
    lines.push(`  const allowedKeys = ${JSON.stringify(allowedRootKeys)};`);
    lines.push(`  for (const key of Object.keys(${parentPath})) {`);
    lines.push(`    if (!allowedKeys.includes(key)) {`);
    lines.push(`      errors.push({ field: key, messages: ["Field is not allowed"] });`);
    lines.push(`    }`);
    lines.push(`  }`);
    lines.push(`}`);
  }

  for (const [key, value] of Object.entries(schema)) {

     
    const fieldPath = `${parentPath}.${key}`;
    const errorKey = fieldPath.replace('req.body.', '');

    if (value.unique && !collectUnique.some(item => item.field === key)) {
      collectUnique.push({ field: key, fieldPath });
    }

    if (isRoot && skipIdOnRoot && key === 'id') {
      lines.push(`// Skipping validation for root-level 'id' on PUT/PATCH`);
      continue;
    }

    if (value.type === 'ref' && value.model) {
      collectRefs.push({ field: key, fieldPath, refModel: value.model });
    }

    lines.push(`// Validation for ${errorKey}`);
    lines.push(`{`);
    lines.push(`  const fieldErrors = [];`);
    lines.push(`  const fieldValue = ${fieldPath};`);

    if (!skipRequired && value.required) {
      lines.push(`  if (fieldValue === undefined) {`);
      lines.push(`    fieldErrors.push("Field is required");`);
      lines.push(`  } else {`);
    } else {
      lines.push(`  if (fieldValue !== undefined) {`);
    }

    if (['string', 'email', 'uuid'].includes(value.type)) {
      lines.push(`    if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");`);
      if (value.minLength !== undefined) {
        lines.push(`    if (fieldValue.length < ${value.minLength}) fieldErrors.push("Must be at least ${value.minLength} characters");`);
      }
      if (value.maxLength !== undefined) {
        lines.push(`    if (fieldValue.length > ${value.maxLength}) fieldErrors.push("Must be at most ${value.maxLength} characters");`);
      }
      if (value.pattern) {
        lines.push(`    if (!(new RegExp(${JSON.stringify(value.pattern)})).test(fieldValue)) fieldErrors.push("Does not match required pattern");`);
      }
    }

    if (['number', 'integer'].includes(value.type)) {
      lines.push(`    if (typeof fieldValue !== 'number') fieldErrors.push("Must be a number");`);
      if (value.minimum !== undefined) {
        lines.push(`    if (fieldValue < ${value.minimum}) fieldErrors.push("Must be >= ${value.minimum}");`);
      }
      if (value.maximum !== undefined) {
        lines.push(`    if (fieldValue > ${value.maximum}) fieldErrors.push("Must be <= ${value.maximum}");`);
      }
    }

    if (value.type === 'boolean') {
      lines.push(`    if (typeof fieldValue !== 'boolean') fieldErrors.push("Must be a boolean");`);
    }

    if (value.type === 'array') {
      lines.push(`    if (!Array.isArray(fieldValue)) fieldErrors.push("Must be an array");`);
      if (value.minItems !== undefined) {
        lines.push(`    if (fieldValue.length < ${value.minItems}) fieldErrors.push("Must have at least ${value.minItems} items");`);
      }
      if (value.maxItems !== undefined) {
        lines.push(`    if (fieldValue.length > ${value.maxItems}) fieldErrors.push("Must have at most ${value.maxItems} items");`);
      }
      if (value.items) {
        lines.push(`    if (Array.isArray(fieldValue)) {`);
        lines.push(`      fieldValue.forEach((item, i) => {`);
        if (value.items.type === 'object' && value.items.properties) {
          lines.push(...buildValidation(value.items.properties, modelName, `${fieldPath}[i]`, skipRequired, false, collectUnique, collectRefs).map(line => `        ${line}`));
        } else if (value.items.type) {
          lines.push(`        if (typeof item !== '${value.items.type}') fieldErrors.push("Elements must be of type ${value.items.type}");`);
        }
        lines.push(`      });`);
        lines.push(`    }`);
      }
    }

    if (value.type === 'object' && value.properties) {
      lines.push(...buildValidation(value.properties, modelName, fieldPath, skipRequired, false, collectUnique, collectRefs));
    }

    if (value.enum) {
      const enumArrayStr = JSON.stringify(value.enum);
      const enumMsg = value.enum.map(v => `'${v}'`).join(', ');
      lines.push(`    if (!${enumArrayStr}.includes(fieldValue)) fieldErrors.push("Must be one of [${enumMsg}]");`);
    }

    lines.push(`  }`);
    lines.push(`  if (fieldErrors.length > 0) {`);
    lines.push(`    errors.push({ field: '${errorKey}', messages: fieldErrors });`);
    lines.push(`  }`);
    lines.push(`}`);
  }

  return lines;
};

const buildMongooseExistenceBlock = (uniqueFields, refFields, modelName, isUpdate = false) => {
  if (!uniqueFields.length && !refFields.length) return '';

  // Deduplicate fields to prevent multiple checks
  const uniqueFieldsMap = new Map(uniqueFields.map(item => [item.field, item]));
  const refFieldsMap = new Map(refFields.map(item => [item.field, item]));

  let block = `
  const mongoose = await import('mongoose');
  const ${modelName}Model = mongoose.default.model('${modelName}');
  const seenFields = new Set(); // Track processed fields to prevent duplicates`;

  // Process uniqueness checks
  for (const { field, fieldPath } of uniqueFieldsMap.values()) {
    block += `
  if (${fieldPath} !== undefined && !seenFields.has('${field}')) {
    seenFields.add('${field}');
    const exists = await ${modelName}Model.findOne({
      ${field}: ${fieldPath}${isUpdate ? ', _id: { $ne: req.params.id }' : ''}
    });
    if (exists) {
      errors.push({ 
        field: '${field}', 
        messages: ['Must be unique'],
        code: 'DUPLICATE'
      });
    }
  }`;
  }

  // Process reference checks
  for (const { fieldPath, refModel, field } of refFieldsMap.values()) {
    block += `
  if (${fieldPath} !== undefined && !seenFields.has('${field}')) {
    seenFields.add('${field}');
    try {
      if (!mongoose.Types.ObjectId.isValid(${fieldPath})) {
        errors.push({ 
          field: '${field}', 
          messages: ['Invalid ID format for ${refModel}'],
          code: 'INVALID_ID'
        });
      } else {
        const refExists = await mongoose.default.model('${refModel}').exists({ 
          _id: ${fieldPath} 
        });
        if (!refExists) {
          errors.push({ 
            field: '${field}', 
            messages: ['References non-existent ${refModel}'],
            code: 'REF_NOT_FOUND'
          });
        }
      }
    } catch (err) {
      errors.push({ 
        field: '${field}', 
        messages: ['Error validating reference: ' + err.message],
        code: 'REF_VALIDATION_ERROR'
      });
    }
  }`;
  }

  return block;
};

const generateMongoMiddleware = async (modelName, schema, outputDir) => {
  const uniqueFields = [];
  const refFields = [];

  const fullValidation = buildValidation(schema.properties, modelName, 'req.body', false, true, uniqueFields, refFields);
  const patchValidation = buildValidation(schema.properties, modelName, 'req.body', true, true, uniqueFields, refFields, true);
  const putValidation = buildValidation(schema.properties, modelName, 'req.body', false, true, uniqueFields, refFields, true);

  const content = `// Auto-generated Mongo middleware for ${modelName}
const validate${modelName} = async (req, res, next) => {
  const errors = [];
  ${fullValidation.join('\n  ')}
  ${buildMongooseExistenceBlock(uniqueFields, refFields, modelName)}

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

const validatePatch${modelName} = async (req, res, next) => {
  const errors = [];
  ${patchValidation.join('\n  ')}
  ${buildMongooseExistenceBlock(uniqueFields, refFields, modelName, true)}

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

const validatePut${modelName} = async (req, res, next) => {
  const errors = [];
  ${putValidation.join('\n  ')}
  ${buildMongooseExistenceBlock(uniqueFields, refFields, modelName, true)}

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

export default validate${modelName};
export { validatePatch${modelName}, validatePut${modelName} };
`;

  const filePath = path.join(outputDir, 'middlewares', `${modelName}.middleware.js`);
  await safeWrite(filePath, content, `Mongo middleware for ${modelName}`);
  logger.info(`Created Mongo middleware: ${modelName}`);
};

export default generateMongoMiddleware;
