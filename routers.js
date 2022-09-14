const express = require('express');
const router = express.Router();
const BookModel = require('./mongoDb');
const JWTFun = require('./middleware/jwtauth');
var {BookController,UserController,ContactUs,admin,cartController} = require('./controller');
const upload = require('./middleware/multer');
const { checkAuth } = require('./middleware/jwtauth');
router.get('/',(req,res)=>{
    res.render('addbook');
})
router.get('home',BookController.home);
router.post('/',upload.single('image'),BookController.addbook);
router.get('/showbook',BookController.showbook);
router.post('/:image',BookController.bookdetails);
router.post('/sort/name',BookController.sort);
router.post('/user/signup',UserController.signup);
router.get('/users/allusers',UserController.showallusers);
router.post('/users/login',UserController.login);
router.post('/users/changePassword',UserController.changePassword);
router.post('/users/forgotPassword',UserController.forgotPassword);
// router.post('/users/checkOTP',UserController.checkOTP);
router.post('/users/forgottenPassword',UserController.forgottenpassword);
router.post('/users/checkOTP',UserController.checkOTP);
router.get('/users/profile',JWTFun.checkAuth,UserController.profile);
router.get('/users/user/redi/:token',UserController.redir);
// router.post('/users/user/redi/:token',UserController.redir);
router.post('/users/sendToken',UserController.sendToken);
router.post('/users/updateUserData',upload.single('image'),UserController.updateUser);
router.post('/books/bookid',BookController.findbookBYbookid);
router.post('/admin/contactus',ContactUs.message);
router.get('/admin/contactus/alldata',ContactUs.allmessage);
router.get('/admin/alluserdata',admin.alluserdata);
router.post('/admin/contactus/deletemsg',admin.msgdelete);
router.post('/admin/allbook/deletebook',admin.deletebook);
router.post('/admin/allbook/updateBookdata',admin.updateBookdata);
router.get('/admin/profileOfUser',checkAuth,admin.profileOfUser);
router.post('/user/book/addtocart',cartController.addtocart);
router.get('/user/book/cartdata',JWTFun.checkAuth,cartController.cartdata);
router.post('/user/book/qtyUpdate',cartController.qtyUpdate);
router.post('/user/book/proceedToCheckout',cartController.proceedToCheckout);
router.post('/user/book/findBook',BookController.findBook);
router.get('/user/book/allOrder',cartController.allOrder);


module.exports = router;
