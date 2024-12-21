const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const userHealthSchema = new Schema({
 
 
 
    bloodPressure: {
        type: Number,
          
      },
      diabaties: {
        type: String,
        dvalue:{
            type:Number,
        }
      },
      weight: {
        type: Number,
        required: true
      },
    
      height: {
        type: Number,
        required: true
      },
      
      bmi:{
       type:Number,
      },
      bmiStatus:{
        type:String,
       },
    
      age:{
       type:Number,
      },
      anyOngoingMedications: {
        type: String,
        required: false,
        },
      
  
}, {
  timestamps: true  
});

 const userHealthModel = mongoose.model('userHealth', userHealthSchema);

module.exports = userHealthModel;