const express=require('express');
const mailRouter=express.Router();
const {sendMail}=require('../controllers/sendMailController');  

mailRouter.post('/send', sendMail);

module.exports=mailRouter;
