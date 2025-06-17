// Auto-generated Mongo middleware for user
const validateuser = async (req, res, next) => {
  const errors = [];
  if (typeof req.body !== 'object' || Array.isArray(req.body) || req.body === null) {
    errors.push({ field: 'body', messages: ["Request body must be an object"] });
  } else {
    const allowedKeys = ["username","email","age","status","password","profile","roles","company","createdAt","updatedAt"];
    for (const key of Object.keys(req.body)) {
      if (!allowedKeys.includes(key)) {
        errors.push({ field: key, messages: ["Field is not allowed"] });
      }
    }
  }
  // Validation for username
  {
    const fieldErrors = [];
    const fieldValue = req.body.username;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (fieldValue.length < 3) fieldErrors.push("Must be at least 3 characters");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'username', messages: fieldErrors });
    }
  }
  // Validation for email
  {
    const fieldErrors = [];
    const fieldValue = req.body.email;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'email', messages: fieldErrors });
    }
  }
  // Validation for age
  {
    const fieldErrors = [];
    const fieldValue = req.body.age;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'number') fieldErrors.push("Must be a number");
      if (fieldValue < 18) fieldErrors.push("Must be >= 18");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'age', messages: fieldErrors });
    }
  }
  // Validation for status
  {
    const fieldErrors = [];
    const fieldValue = req.body.status;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (!["active","inactive","pending"].includes(fieldValue)) fieldErrors.push("Must be one of ['active', 'inactive', 'pending']");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'status', messages: fieldErrors });
    }
  }
  // Validation for password
  {
    const fieldErrors = [];
    const fieldValue = req.body.password;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (!(new RegExp("^(?=.*\\d).{8,}$")).test(fieldValue)) fieldErrors.push("Does not match required pattern");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'password', messages: fieldErrors });
    }
  }
  // Validation for profile
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile;
    if (fieldValue !== undefined) {
  // Validation for profile.bio
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.bio;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.bio', messages: fieldErrors });
    }
  }
  // Validation for profile.dob
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.dob;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.dob', messages: fieldErrors });
    }
  }
  // Validation for profile.social
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.social;
    if (fieldValue !== undefined) {
  // Validation for profile.social.twitter
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.social.twitter;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.social.twitter', messages: fieldErrors });
    }
  }
  // Validation for profile.social.linkedin
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.social.linkedin;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.social.linkedin', messages: fieldErrors });
    }
  }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.social', messages: fieldErrors });
    }
  }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile', messages: fieldErrors });
    }
  }
  // Validation for roles
  {
    const fieldErrors = [];
    const fieldValue = req.body.roles;
    if (fieldValue !== undefined) {
      if (!Array.isArray(fieldValue)) fieldErrors.push("Must be an array");
      if (fieldValue.length < 1) fieldErrors.push("Must have at least 1 items");
      if (Array.isArray(fieldValue)) {
        fieldValue.forEach((item, i) => {
          if (typeof item !== 'string') fieldErrors.push("Elements must be of type string");
        });
      }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'roles', messages: fieldErrors });
    }
  }
  // Validation for company
  {
    const fieldErrors = [];
    const fieldValue = req.body.company;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'company', messages: fieldErrors });
    }
  }
  // Validation for createdAt
  {
    const fieldErrors = [];
    const fieldValue = req.body.createdAt;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'createdAt', messages: fieldErrors });
    }
  }
  // Validation for updatedAt
  {
    const fieldErrors = [];
    const fieldValue = req.body.updatedAt;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'updatedAt', messages: fieldErrors });
    }
  }
  
  const mongoose = await import('mongoose');
  const userModel = mongoose.default.model('user');
  const seenFields = new Set(); // Track processed fields to prevent duplicates
  if (req.body.username !== undefined && !seenFields.has('username')) {
    seenFields.add('username');
    const exists = await userModel.findOne({
      username: req.body.username
    });
    if (exists) {
      errors.push({ 
        field: 'username', 
        messages: ['Must be unique'],
        code: 'DUPLICATE'
      });
    }
  }
  if (req.body.email !== undefined && !seenFields.has('email')) {
    seenFields.add('email');
    const exists = await userModel.findOne({
      email: req.body.email
    });
    if (exists) {
      errors.push({ 
        field: 'email', 
        messages: ['Must be unique'],
        code: 'DUPLICATE'
      });
    }
  }
  if (req.body.company !== undefined && !seenFields.has('company')) {
    seenFields.add('company');
    try {
      if (!mongoose.Types.ObjectId.isValid(req.body.company)) {
        errors.push({ 
          field: 'company', 
          messages: ['Invalid ID format for company'],
          code: 'INVALID_ID'
        });
      } else {
        const refExists = await mongoose.default.model('company').exists({ 
          _id: req.body.company 
        });
        if (!refExists) {
          errors.push({ 
            field: 'company', 
            messages: ['References non-existent company'],
            code: 'REF_NOT_FOUND'
          });
        }
      }
    } catch (err) {
      errors.push({ 
        field: 'company', 
        messages: ['Error validating reference: ' + err.message],
        code: 'REF_VALIDATION_ERROR'
      });
    }
  }

  if (errors.length) {
    return res.status(400).json({ 
      errors: errors.map(err => ({
        field: err.field,
        message: err.messages ? err.messages.join('; ') : err.message
      }))
    });
  }
  next();
};

const validatePatchuser = async (req, res, next) => {
  const errors = [];
  if (typeof req.body !== 'object' || Array.isArray(req.body) || req.body === null) {
    errors.push({ field: 'body', messages: ["Request body must be an object"] });
  } else {
    const allowedKeys = ["username","email","age","status","password","profile","roles","company","createdAt","updatedAt"];
    for (const key of Object.keys(req.body)) {
      if (!allowedKeys.includes(key)) {
        errors.push({ field: key, messages: ["Field is not allowed"] });
      }
    }
  }
  // Validation for username
  {
    const fieldErrors = [];
    const fieldValue = req.body.username;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (fieldValue.length < 3) fieldErrors.push("Must be at least 3 characters");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'username', messages: fieldErrors });
    }
  }
  // Validation for email
  {
    const fieldErrors = [];
    const fieldValue = req.body.email;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'email', messages: fieldErrors });
    }
  }
  // Validation for age
  {
    const fieldErrors = [];
    const fieldValue = req.body.age;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'number') fieldErrors.push("Must be a number");
      if (fieldValue < 18) fieldErrors.push("Must be >= 18");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'age', messages: fieldErrors });
    }
  }
  // Validation for status
  {
    const fieldErrors = [];
    const fieldValue = req.body.status;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (!["active","inactive","pending"].includes(fieldValue)) fieldErrors.push("Must be one of ['active', 'inactive', 'pending']");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'status', messages: fieldErrors });
    }
  }
  // Validation for password
  {
    const fieldErrors = [];
    const fieldValue = req.body.password;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (!(new RegExp("^(?=.*\\d).{8,}$")).test(fieldValue)) fieldErrors.push("Does not match required pattern");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'password', messages: fieldErrors });
    }
  }
  // Validation for profile
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile;
    if (fieldValue !== undefined) {
  // Validation for profile.bio
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.bio;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.bio', messages: fieldErrors });
    }
  }
  // Validation for profile.dob
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.dob;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.dob', messages: fieldErrors });
    }
  }
  // Validation for profile.social
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.social;
    if (fieldValue !== undefined) {
  // Validation for profile.social.twitter
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.social.twitter;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.social.twitter', messages: fieldErrors });
    }
  }
  // Validation for profile.social.linkedin
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.social.linkedin;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.social.linkedin', messages: fieldErrors });
    }
  }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.social', messages: fieldErrors });
    }
  }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile', messages: fieldErrors });
    }
  }
  // Validation for roles
  {
    const fieldErrors = [];
    const fieldValue = req.body.roles;
    if (fieldValue !== undefined) {
      if (!Array.isArray(fieldValue)) fieldErrors.push("Must be an array");
      if (fieldValue.length < 1) fieldErrors.push("Must have at least 1 items");
      if (Array.isArray(fieldValue)) {
        fieldValue.forEach((item, i) => {
          if (typeof item !== 'string') fieldErrors.push("Elements must be of type string");
        });
      }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'roles', messages: fieldErrors });
    }
  }
  // Validation for company
  {
    const fieldErrors = [];
    const fieldValue = req.body.company;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'company', messages: fieldErrors });
    }
  }
  // Validation for createdAt
  {
    const fieldErrors = [];
    const fieldValue = req.body.createdAt;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'createdAt', messages: fieldErrors });
    }
  }
  // Validation for updatedAt
  {
    const fieldErrors = [];
    const fieldValue = req.body.updatedAt;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'updatedAt', messages: fieldErrors });
    }
  }
  
  const mongoose = await import('mongoose');
  const userModel = mongoose.default.model('user');
  const seenFields = new Set(); // Track processed fields to prevent duplicates
  if (req.body.username !== undefined && !seenFields.has('username')) {
    seenFields.add('username');
    const exists = await userModel.findOne({
      username: req.body.username, _id: { $ne: req.params.id }
    });
    if (exists) {
      errors.push({ 
        field: 'username', 
        messages: ['Must be unique'],
        code: 'DUPLICATE'
      });
    }
  }
  if (req.body.email !== undefined && !seenFields.has('email')) {
    seenFields.add('email');
    const exists = await userModel.findOne({
      email: req.body.email, _id: { $ne: req.params.id }
    });
    if (exists) {
      errors.push({ 
        field: 'email', 
        messages: ['Must be unique'],
        code: 'DUPLICATE'
      });
    }
  }
  if (req.body.company !== undefined && !seenFields.has('company')) {
    seenFields.add('company');
    try {
      if (!mongoose.Types.ObjectId.isValid(req.body.company)) {
        errors.push({ 
          field: 'company', 
          messages: ['Invalid ID format for company'],
          code: 'INVALID_ID'
        });
      } else {
        const refExists = await mongoose.default.model('company').exists({ 
          _id: req.body.company 
        });
        if (!refExists) {
          errors.push({ 
            field: 'company', 
            messages: ['References non-existent company'],
            code: 'REF_NOT_FOUND'
          });
        }
      }
    } catch (err) {
      errors.push({ 
        field: 'company', 
        messages: ['Error validating reference: ' + err.message],
        code: 'REF_VALIDATION_ERROR'
      });
    }
  }

  if (errors.length) {
    return res.status(400).json({ 
      errors: errors.map(err => ({
        field: err.field,
        message: err.messages ? err.messages.join('; ') : err.message
      }))
    });
  }
  next();
};

const validatePutuser = async (req, res, next) => {
  const errors = [];
  if (typeof req.body !== 'object' || Array.isArray(req.body) || req.body === null) {
    errors.push({ field: 'body', messages: ["Request body must be an object"] });
  } else {
    const allowedKeys = ["username","email","age","status","password","profile","roles","company","createdAt","updatedAt"];
    for (const key of Object.keys(req.body)) {
      if (!allowedKeys.includes(key)) {
        errors.push({ field: key, messages: ["Field is not allowed"] });
      }
    }
  }
  // Validation for username
  {
    const fieldErrors = [];
    const fieldValue = req.body.username;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (fieldValue.length < 3) fieldErrors.push("Must be at least 3 characters");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'username', messages: fieldErrors });
    }
  }
  // Validation for email
  {
    const fieldErrors = [];
    const fieldValue = req.body.email;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'email', messages: fieldErrors });
    }
  }
  // Validation for age
  {
    const fieldErrors = [];
    const fieldValue = req.body.age;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'number') fieldErrors.push("Must be a number");
      if (fieldValue < 18) fieldErrors.push("Must be >= 18");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'age', messages: fieldErrors });
    }
  }
  // Validation for status
  {
    const fieldErrors = [];
    const fieldValue = req.body.status;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (!["active","inactive","pending"].includes(fieldValue)) fieldErrors.push("Must be one of ['active', 'inactive', 'pending']");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'status', messages: fieldErrors });
    }
  }
  // Validation for password
  {
    const fieldErrors = [];
    const fieldValue = req.body.password;
    if (fieldValue !== undefined) {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
      if (!(new RegExp("^(?=.*\\d).{8,}$")).test(fieldValue)) fieldErrors.push("Does not match required pattern");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'password', messages: fieldErrors });
    }
  }
  // Validation for profile
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile;
    if (fieldValue !== undefined) {
  // Validation for profile.bio
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.bio;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.bio', messages: fieldErrors });
    }
  }
  // Validation for profile.dob
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.dob;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.dob', messages: fieldErrors });
    }
  }
  // Validation for profile.social
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.social;
    if (fieldValue !== undefined) {
  // Validation for profile.social.twitter
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.social.twitter;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.social.twitter', messages: fieldErrors });
    }
  }
  // Validation for profile.social.linkedin
  {
    const fieldErrors = [];
    const fieldValue = req.body.profile.social.linkedin;
    if (fieldValue === undefined) {
      fieldErrors.push("Field is required");
    } else {
      if (typeof fieldValue !== 'string') fieldErrors.push("Must be a string");
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.social.linkedin', messages: fieldErrors });
    }
  }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile.social', messages: fieldErrors });
    }
  }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'profile', messages: fieldErrors });
    }
  }
  // Validation for roles
  {
    const fieldErrors = [];
    const fieldValue = req.body.roles;
    if (fieldValue !== undefined) {
      if (!Array.isArray(fieldValue)) fieldErrors.push("Must be an array");
      if (fieldValue.length < 1) fieldErrors.push("Must have at least 1 items");
      if (Array.isArray(fieldValue)) {
        fieldValue.forEach((item, i) => {
          if (typeof item !== 'string') fieldErrors.push("Elements must be of type string");
        });
      }
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'roles', messages: fieldErrors });
    }
  }
  // Validation for company
  {
    const fieldErrors = [];
    const fieldValue = req.body.company;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'company', messages: fieldErrors });
    }
  }
  // Validation for createdAt
  {
    const fieldErrors = [];
    const fieldValue = req.body.createdAt;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'createdAt', messages: fieldErrors });
    }
  }
  // Validation for updatedAt
  {
    const fieldErrors = [];
    const fieldValue = req.body.updatedAt;
    if (fieldValue !== undefined) {
    }
    if (fieldErrors.length > 0) {
      errors.push({ field: 'updatedAt', messages: fieldErrors });
    }
  }
  
  const mongoose = await import('mongoose');
  const userModel = mongoose.default.model('user');
  const seenFields = new Set(); // Track processed fields to prevent duplicates
  if (req.body.username !== undefined && !seenFields.has('username')) {
    seenFields.add('username');
    const exists = await userModel.findOne({
      username: req.body.username, _id: { $ne: req.params.id }
    });
    if (exists) {
      errors.push({ 
        field: 'username', 
        messages: ['Must be unique'],
        code: 'DUPLICATE'
      });
    }
  }
  if (req.body.email !== undefined && !seenFields.has('email')) {
    seenFields.add('email');
    const exists = await userModel.findOne({
      email: req.body.email, _id: { $ne: req.params.id }
    });
    if (exists) {
      errors.push({ 
        field: 'email', 
        messages: ['Must be unique'],
        code: 'DUPLICATE'
      });
    }
  }
  if (req.body.company !== undefined && !seenFields.has('company')) {
    seenFields.add('company');
    try {
      if (!mongoose.Types.ObjectId.isValid(req.body.company)) {
        errors.push({ 
          field: 'company', 
          messages: ['Invalid ID format for company'],
          code: 'INVALID_ID'
        });
      } else {
        const refExists = await mongoose.default.model('company').exists({ 
          _id: req.body.company 
        });
        if (!refExists) {
          errors.push({ 
            field: 'company', 
            messages: ['References non-existent company'],
            code: 'REF_NOT_FOUND'
          });
        }
      }
    } catch (err) {
      errors.push({ 
        field: 'company', 
        messages: ['Error validating reference: ' + err.message],
        code: 'REF_VALIDATION_ERROR'
      });
    }
  }

  if (errors.length) {
    return res.status(400).json({ 
      errors: errors.map(err => ({
        field: err.field,
        message: err.messages ? err.messages.join('; ') : err.message
      }))
    });
  }
  next();
};

export default validateuser;
export { validatePatchuser, validatePutuser };
