const express=require('express')
const multer=require('multer');
const { getSuggestionsFromModel, getHealthTips, getSuggestionsFromModel1, getProfile, updateProfile, getBmi } = require('../Controllers/userController');
const userRoutes=express.Router()
const path = require('path');  
const Tesseract=require('tesseract.js')
const axios=require('axios')
// Import the Google Cloud Vision client
 
// const upload = multer({
//     dest: 'uploads/',
//     limits: { fileSize: 10* 1024 * 1024 }, 
//   });
  
// async function extractTextFromImage(imagePath) {
//     try {
//       const result = await Tesseract.recognize(imagePath, 'eng');
//       console.log('Extracted Text:', result.data.text);
//       return result.data.text;
//     } catch (error) {
//       console.error('Error extracting text:', error.message);
//       throw error;
//     }
//   }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/'); // Directory to store uploaded files
//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
//   });
  
//    const upload = multer({ storage: storage }).single('document');
  

// async function extractTextFromImage(imagePath) {
//     try {
//       const result = await Tesseract.recognize(imagePath, 'eng');
//       console.log('Extracted Text:', result.data.text);
//       return result.data.text;
//     } catch (error) {
//       // Log the error message, not the whole error object
//       console.error('Error extracting text:', error.message);
  
//       // Send only the error message as part of the response
//       throw new Error(error.message);  // This will ensure only the error message is sent
//     }
//   }
 
// const handleFileUpload = (req, res, next) => {
//     upload(req, res, (err) => {
//         console.log(req)
//       if (err) {
//         return res.status(500).json({ message: 'Failed to upload file', error: err.message });
//       }
//       if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//       }
//        req.filePath = req.file.path;
//       next();
//     });
//   };
  

// userRoutes.post('/process-image',handleFileUpload, async (req, res) => {
//     try {

//         console.log('Image Path:', req.file.path); 

//       const imagePath = path.join(__dirname, req.file.path); 
//       console.log(imagePath)
  
//       const extractedText = await extractTextFromImage(req.file.path);
  
//       const suggestions = await getSuggestionsFromModel(extractedText);
  
//       res.status(200).json({
//         success: true,
//         suggestions,
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'An error occurred while processing the image.',
//         error: error.message,
  
//       });
//     }
//   });


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directory to store uploaded files
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage }).single('image');
  

 
   async function extractTextFromImage(imagePath) {
    try {
      

      const result = await Tesseract.recognize(imagePath, "eng")
      
    //   .then(result1=>{
    //     getSuggestionsFromModel(result1.data.text)
    //   })
  
      const text = result.data.text;
      console.log("Extracted Text:", text);
      return text ;
    } catch (error) {
      console.error('Error extracting text:', error.message);
      throw new Error(error.message); // Throw only the error message
    }
  }
  
 


  const handleFileUpload = (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to upload file', error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      req.filePath = req.file.path;  
      console.log(req.file.path)
      next(); 
    });
  };
  

userRoutes.get("/suggestions",getSuggestionsFromModel)

   userRoutes.post('/process-image',handleFileUpload, async (req, res) => {
    try {
      console.log('Image Path:', req.filePath);  
  
      await extractTextFromImage(req.filePath).then( async result=>{
        console.log("extractedText",result)
        await getSuggestionsFromModel1(result).then(suggestions=>{
            res.status(200).json({
                success: true,
                suggestions,
              });
        })
      })
    //  const suggestions = await getSuggestionsFromModel(extractedText);
  
    //   res.status(200).json({
    //     success: true,
    //     suggestions,
    //   });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while processing the image.',
        error: error.message,
      });
    }
  });




  userRoutes.get('/get-health-tips', async (req, res) => {
    const { disease, description } = req.query;
  
    // if (!disease) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Disease name is required.',
    //   });
    // }
  
    try {
        console.log(disease, description)
      const healthTips = await getHealthTips(disease, description);
      console.log(healthTips)
      res.status(200).json({
        success: true,
        data: healthTips,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate health tips.',
        error: error.message,
      });
    }
  });
  

userRoutes.get("/getProfile/:userId",getProfile)

userRoutes.put("/updateProfile",updateProfile)

userRoutes.get("/getBmi/:userId",getBmi)
  module.exports=userRoutes