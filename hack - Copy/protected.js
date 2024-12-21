const jwt=require('jsonwebtoken')

module.exports.authenticate=(req,res,next)=>{
    const token=req.headers['authorization'].replace('Bearer ', '');
    const d=jwt.verify(token,'privatekey',(err,dec)=>{
        if(dec)
        {
            next();
        }
        else
        {
            res.send(err);
        }
    });
    
}