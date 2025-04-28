const express=require('express');
const mongoose=require('mongoose')
const router=express.Router();
const Payment=require('../models/Payments')
const Cart=require('../models/Carts');
const ObjectId=mongoose.Types.ObjectId;
//token
const verifyToken=require('../middleware/verifyToken');
//post payment inform to db
router.post('/',verifyToken,async(req,res)=>{
    const payment =req.body;
    try {
        const paymentRequest=await Payment.create(payment);
       //delete cart after payment
       const cartIds=payment.cartItems.map(id=>new ObjectId(id));
       const deleteCartRequest=await Cart.deleteMany({_id:{$in:cartIds}})
        res.status(200).json(paymentRequest,deleteCartRequest)
    } catch (error) {
        res.status(404).json({message:error.message})
    }
})
router.get('/all',verifyToken, async (req, res) => {
    const payment =req.body;
    try {
        const payments = await Payment.find().sort({ createdAt: -1 }).exec();
        res.status(200).json(payments);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
router.get('/',verifyToken,async(req,res)=>{
    const email=req.query.email;
    const query={email:email}
    try {
      const decodedEmail=req.decoded.email;
      if(email!==decodedEmail)  {
        res.status(403).json({message:"Forbidden Access"})
      }
      const result=await Payment.find(query).sort({createdAt:-1}).exec();
      res.status(200).json(result)
    } catch (error) {
        res.status(404).json({message:error.message});
    }
})
router.put('/:id',verifyToken,async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports=router;