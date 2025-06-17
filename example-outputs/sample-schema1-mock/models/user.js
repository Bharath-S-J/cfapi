// Auto-generated model for user

export const schema = {
  properties: {
    id: {
      type: 'uuid',
      required: false
    },
    username: {
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 20,
      unique: true
    },
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    age: {
      type: 'integer',
      required: false,
      minimum: 18,
      maximum: 100
    },
    isActive: {
      type: 'boolean',
      required: false
    },
    role: {
      type: 'string',
      required: false,
      enum: [
        'user',
        'admin',
        'moderator'
      ]
    },
    website: {
      type: 'url',
      required: false
    },
    bio: {
      type: 'string',
      required: false,
      maxLength: 500
    },
    tags: {
      type: 'array',
      required: false,
      items: {
        type: 'string',
        required: false
      },
      minItems: 1,
      maxItems: 5
    },
    address: {
      type: 'object',
      required: false,
      properties: {
        street: {
          type: 'string',
          required: false
        },
        city: {
          type: 'string',
          required: false
        },
        postalCode: {
          type: 'string',
          required: false,
          pattern: '^[0-9]{5}$'
        }
      }
    },
    createdAt: {
      type: 'date',
      required: false
    }
  }
};

export default {
  name: 'user',
  schema,
};
