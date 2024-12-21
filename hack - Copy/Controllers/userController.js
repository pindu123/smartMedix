const db=require('../db')
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const User = require('../models/userModel');
const axios=require('axios');
const userHealthModel = require('../models/userHealthModel');
const {ObjectId}=require('mongodb')

const checkAvail= async(data)=>{
try{
        const[rows]=await db.query("select 1 from user where email=?",[data.email])
        console.log(rows.length)
        return rows.length>0;
     }
     catch(error)
     {
        return 0;
     }
    }


const createUser=async(req,res)=>{
    try{
       
        const user=new User(req.body)

       await user.save() .then(resp=>{
        res.status(200).json("Registered Successfully")

       }) 
          
         
    }
    catch(error)
    {
        console.log(error)
res.status(500).json("Internal Server Error")
    }
}



const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body

const user=await User.find({email})
console.log(user)
    // const passwordMatch = await bcrypt.compare(password, user[0].password);
// console.log(passwordMatch)
    // if(passwordMatch)
    //     {
          const token = jwt.sign(
                {
                userId: user[0].user_id, first_name:user[0].first_name,last_name:user[0].last_name,email:user[0].email,phone:user[0].phone,age:user[0].age },
                process.env.ACCESS_TOKEN_SECRET,
                {
                expiresIn: "3h",
            
                }
                );


               res.status(200).json({
                message:"Login Successfull",
                Token:token,
                user:user[0]
                })
         
          
            

    }
    catch(error)
    {
        console.log(error)
        res.status(500).json("Internal Server Error")
    }
}


  
const  getSuggestionsFromModel=async(req,res)=> {
    const extractedText=req.query.extractedText;
  const apiKey =  'AIzaSyAsF_nX_w8JAfEoNDYNfwS3psim0QvXcZY'; 
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [
              {
                text: `Given the medical report:\n${extractedText}\nPlease summarize the key symptoms, suggest possible diagnoses, and recommend treatment options. Provide the suggestions in JSON format. json  should contain hospital name doctor name, date,health problem,overall summary.`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
 
const rawText=response.data.candidates[0].content.parts[0].text
// JSON.parse( rawText.toString().substring(8,rawText.length-4))
console.log( rawText.toString().substring(8,rawText.length-4))
    res.status(200).json({"data":JSON.parse( rawText.toString().substring(8,rawText.length-4))  })
   } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}
 
const  getSuggestionsFromModel1=async(extractedText)=> {
    // const extractedText=extractedText;
  const apiKey = 'AIzaSyAGh8-VtqyzSabGDbQhK947OOlIQ74EbMU'; 
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [
              {
                text: `You will be provided a text which is extracted from medical report, these can not be clear manage the missing words or remove incomplete words and here is the given the medical report:\n${extractedText}\n this report is being extracted from image so handle as per that and Please summarize the key symptoms, suggest possible diagnoses, and recommend treatment options. Provide the suggestions in JSON format. json  should contain (hospital or clinic or laboratory or lab name as hositalName ) doctor name, date,health problem,overall summary. in case of no data found avoid giving`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
 
const rawText=response.data.candidates[0].content.parts[0].text
 console.log( rawText.toString().substring(8,rawText.length-4))
     return JSON.parse( rawText.toString().substring(8,rawText.length-4))  
   } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}
 

 
async function getHealthTips(disease, description) {
    console.log(disease, description);

    const prompt = `Given the disease "${disease}"${description ? ` with the description "${description}"` : ''}, provide a detailed JSON response including:
    -5 Symptoms
    -  5 Health care tips  
    Use proper medical guidelines in your response.please include disease name  Give a proper JSON so that we should not parse it. use healthcareTips as key and it value is array of json where it contains a various tips as keys similarly for the symptoms, please ignore providing disclaimer as we are already providing ,`;

    const apiKey = 'AIzaSyAsF_nX_w8JAfEoNDYNfwS3psim0QvXcZY'; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(
            apiUrl,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

         console.log('Full API Response:', JSON.stringify(response.data, null, 2));

         if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
            throw new Error('No valid candidates returned from API.');
        }

        const content = response.data.candidates[0];
        const rawText = content.content.parts[0].text ;
  
        
      
        console.log('Parsed JSON:',   rawText.toString().length);

        return JSON.parse( rawText.toString().substring(8,rawText.length-4))

    } catch (error) {
         console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}




const getProfile=async(req,res)=>{
    try{
       const userId=req.params.userId
       console.log(userId)
       const userData=await User.findById(userId,{password:0})
        console.log(userData)
       if(userData )
       {
        res.status(200).json({"data":userData })
       }
       else
       {
        res.status(404).json({"message":"user not found"})
       }


    }
    catch(error)
    {
res.status(500).json({"message":"Internal Server Error"})
    }
}


const updateProfile=async(req,res)=>{
    try{
  const {userId,height,weight,gender}=req.body
 
 
      const heightInMeters = height / 100;  
      const bmi = weight / (heightInMeters * heightInMeters);
  
      let bmiStatus;
      if (bmi < 18.5) {
        bmiStatus = 'Underweight';
      } else if (bmi >= 18.5 && bmi <= 24.9) {
        bmiStatus = 'Healthy weight';
      } else if (bmi >= 25 && bmi <= 29.9) {
        bmiStatus = 'Overweight';
      } else if (bmi >= 30) {
        bmiStatus = 'Obesity';
      }


      await User.findByIdAndUpdate(userId,{height:height,weight:weight,gender:gender,bmi:bmi,bmiStatus:bmiStatus})


      res.status(200).json({"message":"Profile Updated Successfully"})

    }
    catch(error)
    {
    res.status(500).json({"message":"Internal Server Error"})
    }
}




const postUserHealthStatus = async (req, res) => {
    try {
      const { bloodPressure, diabeties, anyOngoingMedications, weight, height, userId,dvalue } = req.body;
     
      if (!weight || !height || !userId) {
        return res.status(400).json({ success: false, message: 'Weight, height, and user ID are required.' });
      }
  
      // Calculate BMI
      const heightInMeters = height / 100; // Convert height to meters
      const bmi = weight / (heightInMeters * heightInMeters);
  
      let bmiStatus;
      if (bmi < 18.5) {
        bmiStatus = 'Underweight';
      } else if (bmi >= 18.5 && bmi <= 24.9) {
        bmiStatus = 'Healthy weight';
      } else if (bmi >= 25 && bmi <= 29.9) {
        bmiStatus = 'Overweight';
      } else if (bmi >= 30) {
        bmiStatus = 'Obesity';
      }
      
      // Fetch user data
      const userData = await userModel.findById(new ObjectId(userId));
      if (!userData) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
  
      const age = userData.age;
    
    //   let healthTips = [];
    //   if (bmiStatus === 'Underweight') {
    //     healthTips.push('Increase calorie intake with nutrient-rich foods.', 'Incorporate strength training exercises.', 'Consult a dietitian if needed.');
    //   } else if (bmiStatus === 'Healthy weight') {
    //     healthTips.push('Maintain your weight through a balanced diet.', 'Exercise regularly to stay fit.', 'Continue monitoring your health regularly.');
    //   } else if (bmiStatus === 'Overweight') {
    //     healthTips.push('Focus on portion control and a balanced diet.', 'Increase physical activity, such as walking or swimming.', 'Monitor your weight and set achievable goals.');
    //   } else if (bmiStatus === 'Obesity') {
    //     healthTips.push('Adopt a calorie-restricted diet.', 'Engage in regular physical activity and consult a fitness expert.', 'Consider medical advice for weight management programs.');

    //   }
  // updating in userModel for profile !
    await userModel.findByIdAndUpdate(userId,{bmi:bmi,bmiStatus:bmiStatus});
  
      // Save 
      const userHealthData = {
        userId,
        bloodPressure,
        diabeties,
        dvalue,
        anyOngoingMedications,
        weight,
        height,
        bmi: bmi.toFixed(2), 
        bmiStatus,
        age
      };
  
      const savedData = await userHealthModel.create(userHealthData);
  
      res.status(201).json({
        success: true,
        message: 'User health status recorded successfully.',
        data: savedData,
        
      });
    } catch (error) {
      console.error('Error saving user health status:', error.message);
      res.status(500).json({
        success: false,
        message: 'An error occurred while saving user health status.',
        error: error.message,
      });
    }
  };



const getBmi=async(req,res)=>{
    try{
        const userId=req.params.userId
          const user=await User.findById(userId,{password:0})

          res.status(200).json({"bmi":user.bmi,"bmiStatus":user.bmiStatus})
    }
    catch(error)
    {
    res.status(500).json({"message":"Internal Server Error"})
    }
}


module.exports={createUser,loginUser,getSuggestionsFromModel,getHealthTips,getSuggestionsFromModel1,getProfile,updateProfile,postUserHealthStatus,getBmi }