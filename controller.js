const {BookModel,UserModel,OtpModel,ContactUsModel,cartModel,OrderModel} = require("./mongoDb")
const jwt = require('jsonwebtoken');
const JWTFun = require('./middleware/jwtauth');
const mongoose = require('mongoose');
const {main,num1,num2,randNUm,proceedToCheck} = require('./email/email');
const res = require("express/lib/response");
const req = require("express/lib/request");
let checkingObj =[]
const pdfGenerator = require('./pdf.js')

// Controllers for Books....
class BookController {

    static home = async (req, res) => {
        res.redirect('http://localhost:4200');
    }
    // Function for Adding New Book...........
    static  addbook = async(req,res)=>{
        // console.log(req.body);
        console.log(req.file);
        let NewBook = new BookModel(req.body);
        NewBook.image = req.file.originalname;
        await NewBook.save();
        res.send({
            "success": "true",
            "status":"Book Added successfully"
        });
    }

    // Function for Displaying all books...........
    static showbook = async (req, res) => {
        // console.log(req.headers);
        // console.log(req.body);
         BookModel.find({},(err,resu)=>{    
            res.json({"books":resu});
        })
    }

    // Function for Showing Book Details
    static bookdetails =  async (req,res)=>{
         res.render("bookdetails",{data:req.params.image});
    }

    // static show = (req,res)=>{
    //     res.render('bookdetails');
    // }

    // Function for Show books By category/language filter.....
    static sort =async(req,res)=>{
        if(req.body.sort === "all"){
            res.redirect('/showbook');
        }else{
            let book = await BookModel.find({category:req.body.sort});
            let lan = req.body.sort;
            res.render('showbook',{book,lan})
        }
    }

    static findbookBYbookid = async(req,res)=>{
       try {
        let bookid = req.body.bookid;
        console.log(req.body);
        let book = await BookModel.find({bookid:bookid});
        return res.send(book);
       } catch (error) {
        return res.json({"error": error});
       }
    }

    static findBook = async(req,res)=>{
        let data = req.body.title;
        // console.log(data);
        try {
            let book = await BookModel.find({
                '$or':[
                {title:{ $regex: data, '$options' : 'i'}},
                {category:{ $regex: data, '$options' : 'i'}},
                {language:{ $regex: data, '$options' : 'i'}},
                {author:{ $regex: data, '$options' : 'i'}},
                ]
            })
            // let book = await BookModel.find({title: data})
            res.json(book);
        } catch (error) {
            res.json(error);
        }
    }


}


// Controller for Users.......
class UserController {

    // Function for SIgnup of User
    static signup = async(req,res)=>{
        const {firstname,lastname,email,username,phone,password,c_password} = req.body;
        // res.send(firstname + ' ' + lastname + ' ' + email + ' ');
        if(firstname && lastname && email && username && password && c_password){
            const user = await UserModel.findOne({ username:username});
            const emails = await UserModel.findOne({ email:email });
            if(user || emails)
            {return res.status(400).json(
                {"message":"User or Email already exists please login"}
                )
            };
            if(password !== c_password)
            {return res.status(400).json({"message":
                "password and confirm password doesn't match"} )
            };
            if(req.file){
                let newUser = new UserModel({
                    firstname:firstname,
                    lastname:lastname,
                    email:email,
                    phone:phone,
                    username:username,
                    password:password,
                    userimg:req.file.originalname,
                })
            await newUser.save();
            }else{
            let newUser = new UserModel({
                firstname:firstname,
                lastname:lastname,
                email:email,
                phone:phone,
                username:username,
                password:password,
            })
            await newUser.save();
        }
            
            res.status(200).json({"message":`${firstname} ${lastname} welcome your account has Been created successfully Now ${firstname} You can login`});

        }else{
            res.status(400).json( {"message":"all fields are required"});
        }
    }

    // Function for Displaying All users
    static showallusers=async(req,res)=>{
        let users = await UserModel.find();
        // res.send(anuj);
        // res.send("hello")
        res.send(users);
    }

    // Function for LOgin User
    static login=async (req,res)=>{
        console.log(req.body);
        try{
            const {username,password}= req.body;
            
            const user = await UserModel.findOne({username:username});
            // console.log(user.password);
            if(user){
                if(user.password == password){
                    // console.log(user.password);
                    let token = jwt.sign({UserId:user._id}, "secretKey");
                    console.log(token);
                    // res.cookie("jwt",token);
                    // res.json(req.cookies)
                    return res.status(200).json({user,"JWT":token});
                }else{
                    return res.status(400).json({"message":"username or password is invalid"});
                }
            }else{
                return res.status(400).json({"message":"usernot found "})
            }
        }
        catch(err){
            return res.status(400).json(err);
        }
    }

    static profile = async(req,res)=>{
        let userId = req.user.UserId;
        // console.log("hello",req.user.UserId);
        let Nuser = await UserModel.findOne({_id:userId});
        res.json(Nuser);
    }

    static changePassword =async (req,res)=>{
        const {username,curpass,newpass,comfpass} = req.body;
        if(username&&curpass&&newpass&&comfpass) {
           if(newpass == comfpass){
            let user = await UserModel.findOne({username:username});
            if(user) {
                if(curpass==user.password){
                    user.password = newpass;
                    await user.save();
                    return res.json({"success":"true", "message":"Password Changed Successfully"});
                }else{
                    return res.json({"message":"wrong current-password"});
                }
            }
            else{
                return res.json({"message":"wrong username or password"});
            }
           }else{
            return res.json({"message":"new password and confirm password are not the same"});
           }
        }
        else{
            return res.json({"message":"all fields are required"});
        }
    }

    static forgotPassword = async(req,res)=>{
        console.log(req.body);
        const {username } = req.body;
        let user = await UserModel.findOne({username: username});
        if(user){
            randNUm();
            console.log(num1[0]);
            main(user.email,num1[0]).catch(console.error);
            user.password = num1[0];
            num1.pop();
            await user.save();
            return res.json({"message":"New password is sending to your register email id"});
        }else{
            return res.json({"message":"You are not registered. Please register now."});
        }
    }

    static checkOTP =async(req,res)=>{
        const {username } = req.body;
        let user = await UserModel.findOne({username: username});
        if(user){
            randNUm();
            console.log(num1[0]);
            // main(user.email).catch(console.error);
            checkingObj.push({"otp":`${num1[0]}`, "username":`${username}`});
            console.log(checkingObj);            
            num1.pop();
        }else{
            return res.json({"message":"You are not registered. Please register now."});
        }
    }

    static forgottenpassword=async (req,res)=>{
        const {username} = req.body;
        let user = await UserModel.findOne({username: username});
        if(user){
        let num = (Math.floor(Math.random() * 100000)) + 900000;
        console.log(num);
        // main(user.email,num);
        let otp = new OtpModel({
            username: username,
            otp:num
        })
        await otp.save();
        // res.send("done")
        res.json({"username": username});
        }else{
            res.json({"message":"Invalid Username"});
        }
    }

    static checkOTP =async(req,res)=>{
        const {username,otp,new_password,c_password}  = req.body;
        let user = await OtpModel.findOne({username: username})
        if(user){
            if(otp == user.otp){
                if(new_password == c_password){
                    let nuser = await UserModel.findOne({username: username});
                nuser.password = new_password;
                await nuser.save();
                res.json({"message":"Your Password has been updated successfully"});
                }else{
                    res.json({"message":"New Password and confirm password not matched.."})
                }
            }else{
                res.json({"message":"Invalid OTP"});
            }
        }else{
            res.json({"message":"Invalid OTP"})
        }

        
    }

    static redir =async(req,res)=>{
        let token = req.params.token;
        console.log(token);
        if(token){
            try {
                let decode = await jwt.verify(`${token}`,"secretKey");
                console.log(decode.username);
                res.redirect("http://localhost:4200/forgota")
                // res.send(decode.username);
            } catch (error) {
                res.redirect("http://localhost:4200/ChangePassemailExpire")
                // res.send("Invalid Token");
            }
        }
        else{
            return res.json({"message": "token not valid"});
        }
        // res.redirect("http://localhost:4200/forgot");
        // res.send("done");
    }

    static sendToken =async(req, res) => {
        let {username} = req.body;
        let user = await UserModel.findOne({username: username});
        // console.log(user);
        if(user){
            let token = jwt.sign({username:username}, "secretKey");
            res.send(`http://192.168.1.65:7000/users/user/redi/${token}`);
        }else{
            res.json({"message": "username not valid"});
        }
    }

    static updateUser = async (req,res)=>{
        let {firstname,lastname,username,email,phone,_id} = req.body;
        // console.log(req.body);
        // console.log(req.file);
        try {
            if(firstname && lastname && username && email && phone) {
                // let data = await UserModel.findOne({username: username});
       
                 let user = await UserModel.findById({_id:_id});
                user.firstname = firstname;
                user.lastname = lastname;
                user.email = email;
                user.phone = phone;
                user.username = username;

                if(req.file){
                    user.userimg = req.file.originalname;
                }
                user.save();
                res.json({"message":"updated successfully" , user});
            }else{
                throw new Error({"message":"All fields Are required"});
            }
        
     } catch (error) {
    //  res.json({"message":"All fields are required"})
            res.json(error);
     }
        
    }
    
}

// contactUS for admin .....

class ContactUs {
    static message = async(req,res)=>{
      try {
        let {name,email,subject,message} = req.body;
        if(name && email && message){
            let data = new ContactUsModel({
                    name:name,
                    email:email,
                    subject:subject,
                    message:message
            })

            await data.save();
            res.json({"message":"response submitted successfully"});
        }else{
            res.json({"message":"all fields are required"});
        }
      } catch (error) {
        return res.json({"message":"error: "});
      }
    }

    static allmessage = async (req,res)=>{
        let data= await ContactUsModel.find();
        res.json(data);
    }
}

class admin {
    static alluserdata = async (req,res)=>{
        let data= await UserModel.find();
        res.json(data);
    }
    
    static msgdelete = async (req,res)=>{
        // console.log(req.body)
        // let _id ={_id:req.body}
        let data= await ContactUsModel.findByIdAndDelete({_id:req.body._id});
        res.json({"message":"deleted"});
    }

    static deletebook = async (req,res)=>{
    // console.log(req.body);
    let data = await BookModel.find({bookid:req.body.bookidd})
    // console.log(data);
     await BookModel.findByIdAndDelete({_id:data[0]._id});
     res.json({"message":"deleted"});
    }

    static updateBookdata = async(req,res)=>{
        console.log(req.body);
        let data = await BookModel.findByIdAndUpdate({_id:req.body._id},{$set:req.body});
        res.json({"message":"Book data updated successfully"});
    }

    static profileOfUser = async (req ,res) =>{
     try {
        let _id = req.user;
        // console.log(_id);
        let user= await UserModel.findOne({_id:_id.UserId});
        // console.log(user);
        res.json(user);
     } catch (error) {
        res.json(error);
     }
    }
}

class cartController {

    static addtocart = async(req,res)=>{
        console.log(req.body);
    let {id ,bookid ,quantity} = req.body;
    let book = await BookModel.findOne({bookid:bookid})
    let alreadyhave = await cartModel.findOne({book:book._id,userid:id});
    console.log(alreadyhave);
    // console.log(book)
    if(alreadyhave){
        alreadyhave.quantity += quantity;
        await alreadyhave.save();
    }else{
    let data = new cartModel({
        userid:id,
        book:book._id,
        quantity:quantity,
    })

    await data.save();}
    let user = await cartModel.find();
    // console.log(user);
    res.json({"message":"addtocart"});
    }
    
    static cartdata = async (req,res )=>{
        console.log(req.user);
        let user = await UserModel.findById({_id:req.user.UserId});
        // return res.json(user);
        
        let AllCartData =  (await cartModel.find().populate('userid book','_id username bookid title author language price image'));
        let usercartdata = await cartModel.aggregate([{
            $match:{userid:user._id},
            
        },{
            $lookup: {
            from: "books",
            localField: "book",
            foreignField: "_id",
            as: "bookdata"
            }
        }])

        let userdata = await cartModel.find({}).populate('book').aggregate
        // console.log(user[0]);
        let subtotal=0 ;
        usercartdata.forEach((e)=>{
            let price = Number(e.bookdata[0].price.split('$ ')[1]);
            let qty = Number(e.quantity);
            console.log(typeof price, typeof qty);
            subtotal += (price * qty);
        })
        console.log(subtotal);
        res.json({usercartdata,subtotal});

    }

    static qtyUpdate = async(req,res)=>{
        const {_id,qty} = req.body;
        let cart = await cartModel.findById({_id:_id});
        if(qty == 0){ 
            cart.delete();
            return res.json({"message":"successfully removed"})}
        cart.quantity = qty;
        await cart.save();
        // console.log(cart);
    }

    static proceedToCheckout = async (req,res)=>{
        // console.log(req.body);
        let data123 = req.body;
       try {
            let newOrder = new OrderModel({
            name:req.body.order.name,
            
            PhoneNo:req.body.order.pno,
            address:`${req.body.order.address},${req.body.order.city},${req.body.order.state},${req.body.order.pincode} `,
            userid:req.body.cart.usercartdata[0].userid,
            cartdata:req.body.cart.usercartdata,
            Price:req.body.cart.subtotal

        })
            await newOrder.save();
            let invoicedata = await newOrder.populate('userid','username email')
            // console.log(invoicedata);
            // pdfGenerator(invoicedata)
            proceedToCheck(invoicedata)
            let id = data123.cart.usercartdata[0].userid
            console.log(data123.cart.usercartdata[0].userid);
            let cartdel = await cartModel.find({userid:id});
            cartdel.forEach(async (e)=>{
                console.log(e._id);
                let data = await cartModel.findById({_id:e._id});
                await data.delete();
            })
            // console.log(cartdel);
            res.json(newOrder);
            
       } catch (error) {
            return res.json(error);
       }
      
        

    }

    static allOrder = async (req,res)=>{
        let data = await OrderModel.find().populate('userid');
        res.json(data);
    }

}




module.exports = {BookController,UserController,ContactUs,admin,cartController};
