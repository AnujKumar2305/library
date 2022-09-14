const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/library');
const {ObjectId} = mongoose.Schema.Types
const bookSchema = new mongoose.Schema({
    title: {type: 'string', required: true},
    bookid: {type: 'string', required: true},
    author: {type: 'string'},
    description: {type: 'string'},
    category: {type: 'string'},
    language: {type: 'string'},
    price: {type: 'string'},
    image:{type: 'string'}
});

const UserSchema = new mongoose.Schema({
    firstname:{type: 'string', required: true},
    lastname:{type: 'string', required: true},
    email:{type: 'string', required: true,unique: true},
    username:{type: 'string', required: true, unique: true},
    phone:{type:'number', required: true},
    password:{type: 'string', required: true},
    userimg : {type:'string', default:'pngwing.com.png'}
})

const otpSchema = new mongoose.Schema({
    username:{type: 'string', required: true},
    otp: {type: 'string', required: true},
    createdAt:{type: Date, expires: '2m', default: Date.now }
})

const contactUsSchema = new mongoose.Schema({
    name: {type: 'string', required: true},
    email: {type: 'string', required: true},
    subject: {type: 'string'},
    message: {type: 'string',required: true}
})

const cartSchema = new mongoose.Schema({
    userid: {
        type: ObjectId,
        ref: "User"
      },
    book: {type :ObjectId, ref: "Book"},
    quantity: Number,
})

const orderSchema = new mongoose.Schema({
    name: {type: 'string', required: true},
    PhoneNo : {type: 'string', required: true},
    address: {type: 'string', required: true},
    userid:{
        type: ObjectId,
        ref: "User"
      },
    cartdata: {type:Array},
    Price : {type: 'number', required: true},
    DeliveryStatus : {type: 'string', default: 'Dispatched'},
    date:{type:Date , default:Date.now}

})



const BookModel = mongoose.model('Book',bookSchema);
const OrderModel = mongoose.model('Order',orderSchema);
const UserModel = mongoose.model('User',UserSchema);
const OtpModel = mongoose.model('OTP',otpSchema);
const cartModel = mongoose.model('cart',cartSchema);
const ContactUsModel = mongoose.model('ContactUsMessage',contactUsSchema);
module.exports = {BookModel,UserModel,OtpModel,ContactUsModel,cartModel,OrderModel};