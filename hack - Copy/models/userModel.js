const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const userSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    },
  aadhaar: {
    type: String,
    required: true,
    },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
  
    required: true
  },
  gender:{
    type:String,
    required:false
  },
  height:{
    type:String,
    required:false
  },
  weight:{
    type:String,
    required:false
  },
  bmi:{
    type:Number,
    required:false
  },
  bmiStatus:{
    type:String,
    required:false
  }

}, {
  timestamps: true  
});

 const User = mongoose.model('users', userSchema);

module.exports = User;
