const express=require('express')
const cookieparser=require('cookie-parser')
const cors=require('cors')

const multer=require('multer')
const mongoose=require('mongoose')
const dotenv = require('dotenv');
 const noAuthRoutes = require('./routes/noAuthRoutes');
const userRoutes = require('./routes/userRoutes');
const app=express()
dotenv.config()
app.use(cookieparser ())
 
 app.use(cors())
app.use(express.json())
 
const port = 3000;

app.use("/user",noAuthRoutes)

app.use("/user1",userRoutes)

// Configure Multer for file uploads
 
  // Middleware
//   app.use(bodyParser.json());
//   app.use(bodyParser.urlencoded({ extended: true }));
  
 


mongoose
  .connect(`mongodb+srv://ITCC:iTsG5cWVMA7oyEEy@atlascluster.30o4fpw.mongodb.net/smartmedix?retryWrites=true&w=majority&appName=AtlasCluster`, {
    useNewUrlParser: true,

    useUnifiedTopology: true,

    tlsAllowInvalidCertificates: true,
  })
  .then(() => {
    console.log("DB Connected");
    
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(port,()=>{
    console.log(`Server is running on the port ${port}.. `)
})