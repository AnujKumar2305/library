const nodemailer = require("nodemailer");
const {BookModel,UserModel,OtpModel,ContactUsModel,cartModel,OrderModel} = require("../mongoDb.js");

var fs = require("fs");
var ejs = require("ejs");

let  num1 =[];
let num2;
function randNUm(){  
let num = (Math.floor(Math.random() * 1000000)) + 9000000;
//  console.log(num2);
num2 = num;
 num1.push( num2 );
}
// async..await is not allowed in global scope, must use a wrapper
async function main(data,password) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'ghogharinikunj97@gmail.com', // generated ethereal user
        pass: 'tjgjgbpgzsujdnsi', // generated ethereal password
    },
  });
  
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'ghogharinikunj97@gmail.com', // sender address
    to: `${data}`, // list of receivers
    subject: "Hello ✔", // Subject line
    text: `your New password is ${num1[0]}.. use this password for login and change your passsword.`, // plain text body
    // html: `your OTP for Changing Password is : ${otp}`, // html body
    html: `your New password is ${password}.. use this password for login and change your passsword.`, // html body
  });
  console.log(num1[0]);
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

async function proceedToCheck (data1){
  
  // console.log(data1);
  let items=[] ;
  let qty=[];
  console.log(data1.Price);
let books = data1.cartdata;
 for( i=0 ; i<books.length ; i++){
  let book = await BookModel.findOne({_id:books[i].book});
  items.push(book);
  qty.push(books[i].quantity)
}
console.log(items);
console.log(qty);


let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      // user: 'ghogharinikunj97@gmail.com', // generated ethereal user
     user: 'dhruvgohil530@gmail.com', // generated ethereal user
        //user: 'mansigauswami90@gmail.com', // generated ethereal user
      //pass: 'tjgjgbpgzsujdnsi', // generated ethereal password
      //pass: 'khomdgpaiwpbxkgz', // generated ethereal password
        pass: 'ivyetiwkggpheyxz', // generated ethereal password
    },
  });
  fs.readFile(__dirname + '/../views/email.ejs'  ,'utf8',async function (err,data){
    if(err){
      console.log(err);
    }else{

      
    
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'dhruvgohil530@gmail.com', // sender address
   // to: `${data.userid.email}`, // list of receivers
    to: `${data1.userid.email}`, // list of receivers
    subject: "Your Order On Library Of Scientia", // Subject line
    text: `
    Your Order has been confirmed.
    Order Details As Below:`

      
    , // plain text body
    // html: `your OTP for Changing Password is : ${otp}`, // html body
    html: ejs.render(data,{items:items,qty:qty,total:data1.Price }),
    
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

}
})

}

module.exports = {main,num1,num2,randNUm,proceedToCheck};
