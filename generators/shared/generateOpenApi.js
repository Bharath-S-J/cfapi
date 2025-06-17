import path from 'node:path';
import { safeWrite } from '../../utils/fileUtils.js';
import logger from '../../utils/logger.js';
import pluralize from 'pluralize';


// Recursively converts parsed schema into OpenAPI-compatible schema
function convertToOpenApiSchema(schema) {
  const properties = {};
  const required = [];

  for (const [key, field] of Object.entries(schema)) {
    const prop = {};

    switch (field.type) {
      case 'string':
      case 'email':
      case 'uuid':
      case 'url':
      case 'date':
        prop.type = 'string';
        if (field.type === 'email') prop.format = 'email';
        if (field.type === 'uuid') prop.format = 'uuid';
        if (field.type === 'url') prop.format = 'uri';
        if (field.type === 'date') prop.format = 'date-time';
        break;

      case 'number':
      case 'integer':
        prop.type = field.type;
        break;

      case 'boolean':
        prop.type = 'boolean';
        break;

      case 'object':
        prop.type = 'object';
        if (field.properties) {
          const nested = convertToOpenApiSchema(field.properties);
          prop.properties = nested.properties;
          if (nested.required.length > 0) {
            prop.required = nested.required;
          }
        }
        break;

      case 'array':
        prop.type = 'array';
        if (field.items) {
          if (field.items.type === 'object' && field.items.properties) {
            const nested = convertToOpenApiSchema(field.items.properties);
            prop.items = {
              type: 'object',
              properties: nested.properties,
            };
            if (nested.required.length > 0) {
              prop.items.required = nested.required;
            }
          } else {
            prop.items = convertToOpenApiSchema({ dummy: field.items }).properties.dummy;
          }

          if ('minItems' in field) prop.minItems = field.minItems;
          if ('maxItems' in field) prop.maxItems = field.maxItems;
        }
        break;

      case 'ref':
        prop.$ref = `#/components/schemas/${field.model}`;
        break;

      default:
        prop.type = 'string';
    }

    // Common constraints
    if ('enum' in field) prop.enum = field.enum;
    if ('minLength' in field) prop.minLength = field.minLength;
    if ('maxLength' in field) prop.maxLength = field.maxLength;
    if ('minimum' in field) prop.minimum = field.minimum;
    if ('maximum' in field) prop.maximum = field.maximum;
    if ('pattern' in field) {
      try {
        // validate it's a valid regex
        new RegExp(field.pattern);
        prop.pattern = field.pattern;
      } catch {
        prop.pattern = '^.*$'; // fallback safe default
      }
    }

    if (field.description) prop.description = field.description;
    if (field.example !== undefined) prop.example = field.example;
    if (field.default !== undefined) prop.default = field.default;
    if (field.readOnly) prop.readOnly = true;
    if (field.writeOnly) prop.writeOnly = true;

    if (field.required) required.push(key);

    properties[key] = prop;
  }

  return { properties, required };
}

// Main OpenAPI generator using model definitions
async function generateOpenApi(models, outputDir) {
  const openApi = {
    openapi: '3.0.0',
    info: {
      title: 'cfapi Generated API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
    paths: {},
    components: { schemas: {} },
  };

  for (const [modelName, schema] of Object.entries(models)) {
    const baseSchema = schema.properties || schema;
    const pluralRoute = pluralize(modelName.toLowerCase());
    const ref = { $ref: `#/components/schemas/${modelName}` };
    const { properties, required } = convertToOpenApiSchema(baseSchema);

    const idField = baseSchema?.id || { type: 'string' };

    openApi.components.schemas[modelName] = {
      type: 'object',
      properties,
      ...(required.length ? { required } : {}),
    };

    openApi.paths[`/api/${pluralRoute}`] = {
      get: {
        summary: `Get list of ${modelName}`,
        tags: [modelName],
        responses: {
          200: {
            description: `List of ${modelName}`,
            content: {
              'application/json': {
                schema: { type: 'array', items: ref },
              },
            },
          },
        },
      },
      post: {
        summary: `Create a new ${modelName}`,
        tags: [modelName],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: ref },
          },
        },
        responses: {
          201: {
            description: `${modelName} created`,
            content: {
              'application/json': { schema: ref },
            },
          },
        },
      },
    };

    openApi.paths[`/api/${pluralRoute}/{id}`] = {
      get: {
        summary: `Get a single ${modelName} by ID`,
        tags: [modelName],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: idField },
        ],
        responses: {
          200: {
            description: `${modelName} found`,
            content: { 'application/json': { schema: ref } },
          },
          404: { description: `${modelName} not found` },
        },
      },
      put: {
        summary: `Replace a ${modelName} by ID`,
        tags: [modelName],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: idField },
        ],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: ref } },
        },
        responses: {
          200: { description: `Updated successfully` },
          400: { description: `Invalid input` },
          404: { description: `${modelName} not found` },
        },
      },
      patch: {
        summary: `Update a ${modelName} by ID`,
        tags: [modelName],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: idField },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties,
              },
            },
          },
        },
        responses: {
          200: { description: `Patched successfully` },
          400: { description: `Invalid input` },
          404: { description: `${modelName} not found` },
        },
      },
      delete: {
        summary: `Delete a ${modelName} by ID`,
        tags: [modelName],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: idField },
        ],
        responses: {
          200: { description: `Deleted successfully` },
          404: { description: `${modelName} not found` },
        },
      },
    };
  }

  const outPath = path.join(outputDir, 'openapi.json');
  await safeWrite(outPath, JSON.stringify(openApi, null, 2), 'OpenAPI spec');
  logger.info(` OpenAPI spec written to ${outPath}`);
}

export default generateOpenApi;
