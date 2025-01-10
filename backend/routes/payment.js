const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const instance = new Razorpay({
  key_id: "rzp_test_0DC1JJeT6tllnC",  
  key_secret: "2yJLtKRjOnDV5i3A8x68s76t", 
});


router.post("/create-order", async (req, res) => {
  const { amount, currency = "INR" } = req.body;

  const options = {
    amount: amount * 1, // Amount in paise (INR)
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await instance.orders.create(options);
    res.json({
      id: order.id,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).send("Error creating Razorpay order");
  }
});


router.post("/confirm-payment", (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  // Validate Razorpay signature
  const crypto = require("crypto");
  const hash = crypto
    .createHmac("sha256", "2yJLtKRjOnDV5i3A8x68s76t")
    .update(orderId + "|" + paymentId)
    .digest("hex");

  if (hash === signature) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(400).json({ status: "failed", message: "Invalid signature" });
  }
});

module.exports = router;
