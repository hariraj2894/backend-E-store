const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Ensure the user field is always provided
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity can’t be less than 1'],
          default: 1,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Wish = mongoose.model('Wish', wishSchema);
module.exports = Wish;
