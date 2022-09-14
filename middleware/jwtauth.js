const jwt = require('jsonwebtoken');
const secretKey = "idhar.kya.dekh.raha.hai";
class JWTFun{
static genJwt =(data)=>{
    let token = jwt.sign({UserId:data}, "secretKey");
    return token;
}
 static checkAuth = (req,res,next)=>{
    // console.log(req.headers);
    let {authorization} = req.headers
    if(authorization){
    let token = authorization.replace('Bearer ','')
    let decode = jwt.verify(`${token}`,"secretKey",(err,payload)=>{
        if(err){
             return res.status(400).redirect('http://localhost:4200/login');
            // return res.json({"message":err});
        }
        const {UserId} = payload;
        // console.log(payload);
        req.user = payload;   
         next() ;
    });
                         
    }
    else{
        return res.status(400).redirect('http://localhost:4200/login');
        // return res.json({"message": "token not valid"});
    }
 }
}

module.exports= JWTFun;