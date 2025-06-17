import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    min: 18
  },
  status: {
    type: String,
    enum: ["active","inactive","pending"]
  },
  password: {
    type: String,
    match: /^(?=.*\d).{8,}$/
  },
  profile: new Schema({
    bio: {
      type: String,
      required: true
    },
    dob: {
      type: Date,
      required: true
    },
    social: new Schema({
      twitter: {
        type: String,
        required: true
      },
      linkedin: {
        type: String,
        required: true
      }
    })
  }),
  roles: {
    type: [
    {
        type: String
      }
  ],
    validate: [v => v.length >= 1, 'Minimum 1 items required']
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "company"
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
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
