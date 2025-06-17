// Auto-generated model for user

export const schema = {
  properties: {
    username: {
      type: 'string',
      required: false,
      minLength: 3,
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
      minimum: 18
    },
    status: {
      type: 'string',
      required: false,
      enum: [
        'active',
        'inactive',
        'pending'
      ]
    },
    password: {
      type: 'string',
      required: false,
      pattern: '^(?=.*\\d).{8,}$'
    },
    profile: {
      type: 'object',
      required: false,
      properties: {
        bio: {
          type: 'string',
          required: true
        },
        dob: {
          type: 'date',
          required: true
        },
        social: {
          type: 'object',
          required: false,
          properties: {
            twitter: {
              type: 'string',
              required: true
            },
            linkedin: {
              type: 'string',
              required: true
            }
          }
        }
      }
    },
    roles: {
      type: 'array',
      required: false,
      items: {
        type: 'string',
        required: false
      },
      minItems: 1
    },
    company: {
      type: 'ref',
      required: false,
      model: 'company'
    },
    createdAt: {
      type: 'date',
      required: false
    },
    updatedAt: {
      type: 'date',
      required: false
    }
  },
  timestamps: true
};

export default {
  name: 'user',
  schema,
};
