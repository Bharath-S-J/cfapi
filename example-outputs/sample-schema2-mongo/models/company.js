import mongoose from 'mongoose';
const { Schema } = mongoose;

const companySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  location: new Schema({
      city: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      }
    }, { _id: false, versionKey: false })
}, {
  timestamps: false,
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

const company = mongoose.model('company', companySchema);

export default company;
export { companySchema };
