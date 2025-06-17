import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    min: 18,
    max: 100
  },
  isActive: {
    type: Boolean
  },
  role: {
    type: String,
    enum: ["user","admin","moderator"]
  },
  website: {
    type: String
  },
  bio: {
    type: String,
    maxlength: 500
  },
  tags: {
    type: [
    {
        type: String
      }
  ],
    validate: [v => v.length >= 1, 'Minimum 1 items required'],
    validate: [v => v.length <= 5, 'Maximum 5 items allowed']
  },
  address: new Schema({
    street: {
      type: String
    },
    city: {
      type: String
    },
    postalCode: {
      type: String,
      match: /^[0-9]{5}$/
    }
  }),
  createdAt: {
    type: Date
  }
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

const user = mongoose.model('user', userSchema);

export default user;
export { userSchema };
