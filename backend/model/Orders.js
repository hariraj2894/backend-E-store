const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    products :
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentResult: {
        id: String,
        status: String,
        updateTime: String,
        amount: Number,
        currency: String,
        success: Boolean,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId, 
    
    },
    artistId : {
        type: mongoose.Schema.Types.ObjectId,
    },
    orderItemsCount: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: true,
    },
    paidAt: {
        type: Date,
    },

    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;