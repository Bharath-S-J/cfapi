#!/usr/bin/env node

import chalk from 'chalk';
import { parseArgs } from 'node:util';
import generateAPI from '../core/generateAPI.js';
import addModel from '../core/addModel.js';
import logger from '../utils/logger.js';

const SUPPORTED_ENGINES = ['mock', 'mongo'];
const SUPPORTED_TYPES = ['generate', 'add'];

const printSchemaHelp = () => {
  

  const exampleSchema1={
    "user": {
    "type": "object",
    "properties": {
      "id": {
        "type": "uuid"
      },
      "username": {
        "type": "string",
        "required": true,
        "unique": true,
        "minLength": 3,
        "maxLength": 20
      },
      "email": {
        "type": "email",
        "required": true,
        "unique": true
      },
      "age": {
        "type": "integer",
        "minimum": 18,
        "maximum": 100
      },
      "isActive": {
        "type": "boolean"
      },
      "role": {
        "type": "string",
        "enum": ["user", "admin", "moderator"]
      },
      "website": {
        "type": "url"
      },
      "bio": {
        "type": "string",
        "maxLength": 500
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "minItems": 1,
        "maxItems": 5
      },
      "address": {
        "type": "object",
        "properties": {
          "street": {
            "type": "string"
          },
          "city": {
            "type": "string"
          },
          "postalCode": {
            "type": "string",
            "pattern": "^[0-9]{5}$"
          }
        }
      },
      "createdAt": {
        "type": "date"
      }
    }
  }
  }

  const exampleSchema2 = {
    "user": {
    "type": "object",
    "timestamps": true,
    "properties": {
      "username": { "type": "string", "minLength": 3, "unique": true },
      "email": { "type": "email", "required": true, "unique": true },
      "age": { "type": "integer", "minimum": 18 },
      "status": { "type": "string", "enum": ["active", "inactive", "pending"] },
      "password": { "type": "string", "pattern": "^(?=.*\\d).{8,}$" },
      "profile": {
        "type": "object",
        "properties": {
          "bio": "string",
          "dob": "date",
          "social": {
            "type": "object",
            "properties": {
              "twitter": "string",
              "linkedin": "string"
            }
          }
        }
      },
      "roles": {
        "type": "array",
        "items": { "type": "string" },
        "minItems": 1
      },
      "company": { "type": "ref", "model": "company" }
    }
  },
  "company": {
    "type": "object",
    "properties": {
      "name": { "type": "string", "required": true },
      "website": { "type": "url" },
      "location": {
        "type": "object",
        "properties": {
          "city": "string",
          "country": "string"
        }
      }
    }
  }
  };

  console.log(chalk.yellow(`Here's an example of a valid schema 1:\n`));
  console.log(chalk.yellow(JSON.stringify(exampleSchema1, null, 2)));
  console.log(chalk.yellow(`Here's an example of a valid schema 2:\n`));
  console.log(chalk.yellow(JSON.stringify(exampleSchema2, null, 2)));

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
  console.log();
};

const printHelp = () => {
  console.log(`
Usage:
  cfapi --type <generate|add> --schema <path> --output <dir> --engine <mock|mongo>

Options:
  --type, -t     Operation type: "generate" (create full API) or "add" (add models)
  --schema, -s   Path to schema JSON file
  --output, -o   Output directory for generated files
  --engine, -e   Engine to use: "mock" or "mongo"
  --help, -h     Show this help message

Examples:
  cfapi -t generate -s ./schema.json -o ./my-api -e mock
  cfapi -t add -s ./user-posts.json -o ./my-api -e mongo

Notes:
  - Models cannot be added twice. If you try to add an existing model again, it will fail.
  - If something breaks due to outdated or conflicting files, try deleting the generated directory and running again.
  - For model schema format and supported types, refer to the documentation.
`);
printSchemaHelp();
};

// Parse CLI args
const { values } = parseArgs({
  options: {
    schema: { type: 'string', short: 's' },
    output: { type: 'string', short: 'o' },
    engine: { type: 'string', short: 'e' },
    type:   { type: 'string', short: 't' },
    help:   { type: 'boolean', short: 'h' },
  },
});

// Show help if --help is passed
if (values.help) {
  printHelp();
  process.exit(0);
}

// Validate required flags
if (!values.schema || !values.output || !values.engine || !values.type) {
  logger.error('Missing required flags. Use --help to see usage.');
  process.exit(1);
}

if (!SUPPORTED_TYPES.includes(values.type)) {
  logger.error(`Invalid --type "${values.type}". Must be one of: ${SUPPORTED_TYPES.join(', ')}`);
  process.exit(1);
}

if (!SUPPORTED_ENGINES.includes(values.engine)) {
  logger.error(`Invalid --engine "${values.engine}". Must be one of: ${SUPPORTED_ENGINES.join(', ')}`);
  process.exit(1);
}

(async () => {
  try {
    if (values.type === 'generate') {
      await generateAPI(values.schema, values.output, values.engine);
    } else {
      await addModel(values);
    }
  } catch (err) {
    logger.error(`Fatal error: ${err.message}`);
    console.error('\nIf you believe this is due to existing files or schema conflicts, delete the output directory and try again.');
    process.exit(1);
  }
})();
