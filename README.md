# ⚡ cfapi – Code-Free API Generator (Prototype)

**cfapi** is a powerful command-line tool that generates full REST APIs from a simple JSON schema — in seconds. Whether you're prototyping or building real apps, cfapi handles everything from input validation to route generation, database setup, and OpenAPI documentation — **with zero boilerplate**.

> 🔰 This is my **first prototype**. I'm still learning backend and open source patterns — feedback is welcome and appreciated!

---

## ✨ Features

✅ Generate a complete API with one command  
✅ Choose between:

- `mock` engine – JSON file storage with auto-persistence
- `mongo` engine – Mongoose ODM with full validation

✅ Auto-generates:

- Controllers
- Routes
- Middleware validation based on constraints provided in the schema
- Mongoose/mock models
- OpenAPI model schemas

✅ Schema-aware:

- Deeply nested objects and arrays
- References with `ref` fields
- Validation: `required`, `enum`, `pattern`, `minLength`, `unique`, etc.

✅ Built-in support for:

- Unique constraints in both engines
- `addModel` to extend existing APIs
- `.cfapi.config.json` created on first run

✅ Mock engine:

- Auto-generates **10 fake records** per model on creation

✅ MongoDB engine:

- Uses Mongoose schemas with `timestamps`, `ref`, and full validation logic

---

## 📦 CLI Usage

```bash
cfapi --type <generate|add> --schema <path> --output <dir> --engine <mock|mongo>
```

### 🔨 Generate Full API

```bash
cfapi -t generate -s ./schema.json -o ./my-api -e mock
```

> ✅ When using the `mock` engine, **10 sample mock records** are created automatically.

### ➕ Add Model(s)

```bash
cfapi -t add -s ./new-models.json -o ./my-api -e mongo
```

> ⚠️ You cannot add a model twice — existing models will be skipped unless `--force` is used.

---

## 🧠 PATCH Support: Explained

✅ `PATCH` route exists
❌ Only supports top-level fields (e.g. `email`, not `profile.bio`)
🛠️ Nested patching is not supported due to complexity and business logic ambiguity.

---

## ⚠ Limitations

- PATCH only supports flat fields (nested updates are not allowed).
- No built-in support for authentication, pagination, or advanced filtering.
- Malformed schemas may result in validation errors or undefined behavior.
- The id field is handled internally – ensure your schema follows strict rules as demonstrated in the examples.
- Validation is extremely strict – it will reject any input that does not exactly match the schema definition. No extra fields are allowed.

---

## 📦 Example Outputs

cfapi generates complete, ready-to-run REST API scaffolding based on your schema and selected engine. Below are **four full examples** demonstrating both the `mock` and `mongo` engines across two different schemas:

### 🧪 Sample Schema 1: User API

- ✨ Demonstrates a **basic schema** with string, number, boolean, date, array, enum, and nested object types.
- ✅ Both mock and MongoDB engines.
- 📘 Includes auto-generated OpenAPI spec and route/controller/model/middleware files.

| Mock Engine Output                                                                      | MongoDB Engine Output                                                                     |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![Mock Output](https://github.com/Bharath-S-J/cfapi/blob/main/images/mock.png?raw=true) | ![Mongo Output](https://github.com/Bharath-S-J/cfapi/blob/main/images/mongo.png?raw=true) |

- 🔗 [`sample-schema1-mock`](https://github.com/Bharath-S-J/cfapi/tree/main/example-outputs/sample-schema1-mock)
- 🔗 [`sample-schema1-mongo`](https://github.com/Bharath-S-J/cfapi/tree/main/example-outputs/sample-schema1-mongo)

---

### 🏢 Sample Schema 2: User + Company (Nested + Ref)

- 🔗 Shows a **complex schema** with multiple models and references (`ref`), nested object fields, and validations.
- 🌱 Highlights `mock` vs `mongo` behavior with relational handling.
- 📘 Each version includes OpenAPI schema, working routes, and validation middleware.
- 🔗 [`sample-schema2-mock`](https://github.com/Bharath-S-J/cfapi/tree/main/example-outputs/sample-schema2-mock)
- 🔗 [`sample-schema2-mongo`](https://github.com/Bharath-S-J/cfapi/tree/main/example-outputs/sample-schema2-mongo)

---

## 📁 Output Structure

```
my-api/
├── config/
│   └── cfapi.config.json         # Project config
│   └── db.json                   # MongoDB connection details
├── controller/                   # Controller functions
├── middleware/                   # Validation logic
├── models/                       # Mongoose or mock schemas
├── openapi-models/               # OpenAPI model schemas
├── routes/                       # REST routes per model
├── data/                         # Mock engine only: .json files
├── .env
├── package.json
└── server.js
```

---

## 🧪 Example Schema

```json
{
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
```

---

## 🔧 Supported Types & Validation Rules

| Feature                  | Supported | Notes                                                                 |
| ------------------------ | --------- | --------------------------------------------------------------------- |
| `type`                   | ✅        | string, number, boolean, integer, email, uuid, url, date, object, ref |
| `required`               | ✅        | Explicitly mark fields as required                                    |
| `minLength`, `maxLength` | ✅        | Only for strings                                                      |
| `minimum`, `maximum`     | ✅        | Only for numbers                                                      |
| `pattern`                | ✅        | Use string-form regex (e.g. `"^\\d+$"`)                               |
| `enum`                   | ✅        | Array of allowed values                                               |
| `unique`                 | ✅        | Works in both mock and mongo engines                                  |
| `default`                | ✅        | Optional default values                                               |
| `minItems`, `maxItems`   | ✅        | For arrays                                                            |
| `timestamps`             | ✅        | Adds `createdAt` and `updatedAt` automatically                        |

---

## 🚀 Getting Started

Got it! Here’s a clear, step-by-step **Usage & Installation** guide that explains how users can clone your repo, link locally, or install from npm and generate APIs:

---

## 🚀 How to Use cfapi

You can use **cfapi** either by installing it globally from npm or by cloning and linking the repository locally for development.

### Option 1: Install from npm (recommended)

```bash
npm install -g @bharathsj/cfapi
```

Once installed globally, generate your API from a schema:

```bash
cfapi -t generate -s ./schema.json -o ./my-api -e mongo
cd my-api
npm install
npm start
```

### Option 2: Clone & link locally (for development)

If you want to use or modify the source code directly:

```bash
git clone https://github.com/Bharath-S-J/cfapi.git
cd cfapi
chmod +x bin/index.js
npm install
npm link
```

This links the `cfapi` command globally to your local code.

Now you can run the CLI as if installed globally:

```bash
cfapi -t generate -s ./schema.json -o ./my-api -e mock
cd my-api
npm install
npm start
```

---

## 🛠 Example: Complex Schema

```json
{
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
```

---

## 📚 Help Output

```bash
cfapi --help
```

```
Usage:
  cfapi --type <generate|add> --schema <path> --output <dir> --engine <mock|mongo>

Options:
  --type, -t     Operation type: "generate" or "add"
  --schema, -s   Path to schema JSON file
  --output, -o   Output directory
  --engine, -e   Engine to use: "mock" or "mongo"
  --help, -h     Show help

Examples:
  cfapi -t generate -s ./schema.json -o ./my-api -e mock
  cfapi -t add -s ./posts.json -o ./my-api -e mongo
```

---

## 🙌 Final Note

This is a **learning prototype** — designed to explore how far you can go with schema-driven API generation. Feedback, PRs, or issues are all welcome!

---

## 📦 Links

- 🔗 GitHub: [https://github.com/Bharath-S-J/cfapi.git](https://github.com/Bharath-S-J/cfapi.git)
- 📦 npm: [https://npmjs.com/package/@bharathsj/cfapi](https://npmjs.com/package/@bharathsj/cfapi)
