// Auto-generated model for company

export const schema = {
  properties: {
    name: {
      type: 'string',
      required: true
    },
    website: {
      type: 'url',
      required: false
    },
    location: {
      type: 'object',
      required: false,
      properties: {
        city: {
          type: 'string',
          required: true
        },
        country: {
          type: 'string',
          required: true
        }
      }
    }
  }
};

export default {
  name: 'company',
  schema,
};
