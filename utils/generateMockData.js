import fs from "node:fs/promises";
import path from "node:path";
import { faker } from "@faker-js/faker";
import logger from "./logger.js";

const generateId = () => faker.string.uuid();

/**
 * Generate a fake value based on type and constraints.
 * @param {string} type
 * @param {string} fieldName
 * @param {object} props
 * @returns {any}
 */
const generateFakeValue = (type, fieldName = "", props = {}) => {
  const field = fieldName.toLowerCase();

  // Enum constraint
  if (props.enum && Array.isArray(props.enum) && props.enum.length > 0) {
    return faker.helpers.arrayElement(props.enum);
  }

  // Type-specific logic
  switch (type) {
    case "string": {
      const min = props.minLength ?? 5;
      const max = props.maxLength ?? min + 5;
      if (max < min)
        throw new Error(
          ` maxLength (${max}) < minLength (${min}) in field "${fieldName}"`
        );

      if (props.pattern?.startsWith("http")) return faker.internet.url();

      if (
        field.includes("url") ||
        field.includes("link") ||
        field.includes("website")
      )
        return faker.internet.url();
      if (field.includes("email")) return faker.internet.email();
      if (field.includes("name")) return faker.person.fullName();
      if (field.includes("title")) return faker.lorem.words(3);
      if (field.includes("bio")) return faker.lorem.paragraph();

      return faker.string.alpha({ length: { min, max } });
    }

    case "number":
    case "integer": {
      const min = props.minimum ?? 0;
      const max = props.maximum ?? min + 100;
      if (max < min)
        throw new Error(
          ` maximum (${max}) < minimum (${min}) in field "${fieldName}"`
        );

      const num = faker.number.float({ min, max, precision: 1 });
      return type === "integer" ? Math.floor(num) : num;
    }

    case "boolean":
      return faker.datatype.boolean();

    case "uuid":
      return faker.string.uuid();

    case "email":
      return faker.internet.email();

    case "date":
      return faker.date.recent().toISOString();

    case "url":
      return faker.internet.url();

    case "array": {
      const min = props.minItems ?? 1;
      const max = props.maxItems ?? 5;
      if (max < min)
        throw new Error(
          ` maxItems (${max}) < minItems (${min}) in field "${fieldName}"`
        );

      const count = faker.number.int({ min, max });
      const itemType = props.items?.type ?? "string";

      return Array.from({ length: count }, () =>
        generateFakeValue(itemType, `${field}_item`, props.items || {})
      );
    }

    case "object": {
      if (!props.properties) return {};
      const result = {};
      for (const [subField, subProps] of Object.entries(props.properties)) {
        result[subField] = generateFakeValue(subProps.type, subField, subProps);
      }
      return result;
    }

    default:
      return null;
  }
};

/**
 * Generate a mock object for a single schema.
 * @param {object} schema
 * @param {string} modelName
 * @param {Record<string, string[]>} idMap
 * @returns {object}
 */
const generateFakeRecord = (schema, modelName, idMap) => {
  const record = {};

  for (const [field, props] of Object.entries(schema.properties || {})) {
    if (!props || typeof props !== "object") {
      record[field] = null;
      continue;
    }

    if (field === "id") continue;

    // Handle nested object
    if (props.type === "object" && props.properties) {
      record[field] = generateFakeRecord(props, modelName, idMap);
      continue;
    }

    // Handle arrays
    if (props.type === "array") {
      const item = props.items || {};
      const count = faker.number.int({ min: 1, max: 3 });

      if (item.type === "object" && item.properties) {
        record[field] = Array.from({ length: count }, () =>
          generateFakeRecord(item, modelName, idMap)
        );
      } else if (item.type === "ref" && item.model) {
        const refIds = idMap[item.model] || [];
        record[field] = Array.from({ length: count }, () =>
          faker.helpers.arrayElement(refIds)
        );
      } else {
        record[field] = Array.from({ length: count }, () =>
          generateFakeValue(item.type || "string", field, item)
        );
      }
      continue;
    }

    // Reference
    if (props.type === "ref" && props.model) {
      const refIds = idMap[props.model];
      if (!refIds) {
        logger.warn(
          `⚠️  Reference model "${props.model}" not found for field "${field}" in "${modelName}"`
        );
        record[field] = null; // or generateId() if you want a dummy
      } else {
        record[field] = faker.helpers.arrayElement(refIds);
      }
      continue;
    }

    // Primitive value
    record[field] = generateFakeValue(props.type || "string", field, props);
  }

  if (schema.timestamps) {
    const now = new Date().toISOString();
    record.createdAt = now;
    record.updatedAt = now;
  }

  return record;
};

/**
 * Generate mock JSON data files for all models.
 * @param {Record<string, any>} schemas - Model schemas
 * @param {string} outDir - Output directory
 * @param {number} count - Records per model
 */
const generateMockData = async (schemas, outDir, count = 10) => {
  const dataDir = path.join(outDir, "data");
  await fs.mkdir(dataDir, { recursive: true });

  logger.info(
    ` Generating fake data for ${Object.keys(schemas).length} models...`
  );

  // Step 1: Preallocate IDs
  const idMap = {};
  for (const modelName of Object.keys(schemas)) {
    idMap[modelName] = Array.from({ length: count }, generateId);
  }

  // Step 2: Generate and write records
  for (const modelName of Object.keys(schemas)) {
    const schema = schemas[modelName];
    const records = [];

    for (let i = 0; i < count; i++) {
      const record = generateFakeRecord(schema, modelName, idMap);
      record.id = idMap[modelName][i];
      records.push(record);
    }

    const filePath = path.join(dataDir, `${modelName}.json`);
    await fs.writeFile(filePath, JSON.stringify(records, null, 2), "utf-8");
    logger.info(` Mock data generated: data/${modelName}.json`);
  }
};

export default generateMockData;
