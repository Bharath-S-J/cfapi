import path from "node:path";
import fs from "node:fs/promises";
import logger from "../../utils/logger.js";

const INDENT = (level = 1) => "  ".repeat(level);

const mapType = (type) => {
  const map = {
    string: "String",
    number: "Number",
    integer: "Number",
    boolean: "Boolean",
    date: "Date",
    email: "String",
    uuid: "String",
    url: "String",
    ref: "Schema.Types.ObjectId",
  };
  return map[type] || "Schema.Types.Mixed";
};

const convertField = (field, indent = 2) => {
  const i = INDENT(indent);

  // ----- Ref -----
  if (field.type === "ref") {
    const lines = [`type: Schema.Types.ObjectId`, `ref: "${field.model}"`];
    if (field.required) lines.push("required: true");
    if (field.unique) lines.push("unique: true");
    if (field.default !== undefined) {
      lines.push(`default: ${JSON.stringify(field.default)}`);
    }
    return `{\n${i}${lines.join(`,\n${i}`)}\n${INDENT(indent - 1)}}`;
  }

  // ----- Array -----
  if (field.type === "array") {
    const inner = convertField(field.items, indent + 2);
    const isObjectArray = field.items.type === "object";
    const base = isObjectArray
      ? `new Schema(${inner}, { _id: false, versionKey: false })`
      : inner;

    const lines = [`type: [${base}]`];
    if (field.required) lines.push("required: true");
    if (field.minItems !== undefined) {
      lines.push(
        `validate: [v => v.length >= ${field.minItems}, "Minimum ${field.minItems} items required"]`
      );
    }
    if (field.maxItems !== undefined) {
      lines.push(
        `validate: [v => v.length <= ${field.maxItems}, "Maximum ${field.maxItems} items allowed"]`
      );
    }
    return `{\n${i}${lines.join(`,\n${i}`)}\n${INDENT(indent - 1)}}`;
  }

  // ----- Object -----
  if (field.type === "object") {
    const fields = Object.entries(field.properties || {})
      .map(
        ([k, v]) => `${INDENT(indent + 1)}${k}: ${convertField(v, indent + 2)}`
      )
      .join(",\n");
    return `new Schema({\n${fields}\n${i}}, { _id: false, versionKey: false })`;
  }

  // ----- Primitives (string, number, etc.) -----
  const lines = [`type: ${mapType(field.type)}`];
  if (field.required) lines.push("required: true");
  if (field.unique) lines.push("unique: true");
  if (field.default !== undefined) {
    lines.push(`default: ${JSON.stringify(field.default)}`);
  }
  if (field.enum) lines.push(`enum: ${JSON.stringify(field.enum)}`);
  if (field.minLength) lines.push(`minlength: ${field.minLength}`);
  if (field.maxLength) lines.push(`maxlength: ${field.maxLength}`);
  if (field.minimum) lines.push(`min: ${field.minimum}`);
  if (field.maximum) lines.push(`max: ${field.maximum}`);
  if (field.pattern) lines.push(`match: ${new RegExp(field.pattern)}`);

  return `{\n${i}${lines.join(`,\n${i}`)}\n${INDENT(indent - 1)}}`;
};

export default async function generateModel(modelName, modelDef, outputDir) {
  const schemaFields = Object.entries(modelDef.properties)
    .map(([key, val]) => `${INDENT()}${key}: ${convertField(val, 2)}`)
    .join(",\n");

  const code = `import mongoose from 'mongoose';
const { Schema } = mongoose;

const ${modelName}Schema = new Schema({
${schemaFields}
}, {
  timestamps: ${modelDef.timestamps ? "true" : "false"},
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

  const filePath = path.join(outputDir, "models", `${modelName}.js`);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, code, "utf-8");
  logger.success(` Model "${modelName}" generated at ${filePath}`);
}
