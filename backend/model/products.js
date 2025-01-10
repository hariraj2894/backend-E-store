const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artisan', required: true }, // Associate with artisan
  views: { type: Number, default: 0 }, // Total view count
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Users who viewed the product
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
