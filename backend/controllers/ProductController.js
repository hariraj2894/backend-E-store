const Product = require('../model/products');
const jwt = require('jsonwebtoken');
const User = require('../model/users');
const Cart = require('../model/cart'); // Ensure you have the Cart model
require('dotenv').config();
const Wish = require('../model/Wish'); // Ensure you have the Wish model
const Order = require('../model/Orders'); // Ensure you have the Order model
// Create a new product
const CreateProduct = async (req, res) => {
  try {
    const { name, description, price, image, artisanId, category } = req.body;
    const newProduct = new Product({ name, description, price, image, artisanId,category });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully!', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product', error });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('artisanId', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error, please try again later.', error: error.message });
  }
};

// Get product by ID
const getProductbyId = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id).populate('artisanId', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error, please try again later.', error: error.message });
  }
};

// Get products by artisan ID
const getProductByArtID = async (req, res) => {
  const artisanId = req.params.artisanId;
  try {
    const products = await Product.find({ artisanId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error, please try again later.', error: error.message });
  }
};

// Delete a product by ID
const deleteProducts = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Product.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  const { name, price, description, image } = req.body;
  const id = req.params.id;

  if (!name || !price || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully', data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};



const addToCart = async (req, res) => {
  try {
    const { productId, userId, quantity ,name} = req.body;
    console.log(name);
    // console.log(productId, userId, quantity);
    // 1️⃣ Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 2️⃣ Check if the user already has a cart
    let cart = await Cart.findOne({ user: userId });
    
    if (cart) {
      // 3️⃣ Check if the product is already in the cart
      const productIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex > -1) {
        // 4️⃣ If the product exists, update its quantity and total price
        cart.items[productIndex].quantity += quantity;
        cart.items[productIndex].totalPrice = cart.items[productIndex].quantity * product.price;
      } else {
        // 5️⃣ If the product is not in the cart, add it
        cart.items.push({
          product: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: quantity,
          totalPrice: product.price * quantity,
        });
      }
    } else {
      // 6️⃣ If the user has no cart, create a new one
      cart = new Cart({
        user: userId,
        items: [
          {
            product: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: quantity,
            totalPrice: product.price * quantity,
          },
        ],
      });
    }

    // 7️⃣ Save the cart
    await cart.save();
    res.status(201).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};


const wishList = async (req, res) => {
  try {
    const { productId, userId, quantity ,name} = req.body;
    console.log(name);
    // console.log(productId, userId, quantity);
    // 1️⃣ Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 2️⃣ Check if the user already has a cart
    let wish = await Wish.findOne({ user: userId });
    
    if (wish) {
      // 3️⃣ Check if the product is already in the cart
      const productIndex = wish.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex > -1) {
        // 4️⃣ If the product exists, update its quantity and total price
        wish.items[productIndex].quantity += quantity;
        wish.items[productIndex].totalPrice = wish.items[productIndex].quantity * product.price;
      } else {
        // 5️⃣ If the product is not in the cart, add it
        wish.items.push({
          product: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: quantity,
          totalPrice: product.price * quantity,
        });
      }
    } else {
      // 6️⃣ If the user has no cart, create a new one
      wish = new Wish({
        user: userId,
        items: [
          {
            product: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: quantity,
            totalPrice: product.price * quantity,
          },
        ],
      });
    }

    // 7️⃣ Save the cart
    await wish.save();
    res.status(201).json({ message: 'Product added to cart', wish });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
}



// remove product from cart

const removeFromCart = async (req, res) => {
  const { productId, userId } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.items.splice(productIndex, 1);
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};



const productView = async (req, res) => {
  try {
    const productId = req.params.id; // Get productId from the URL (use :id not :productId)
    const { userId } = req.body; // Get userId from request body
    console.log('Product ID:', productId, 'User ID:', userId);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user has already viewed the product
    if (!product.viewers.includes(userId)) {
      product.views += 1;
      product.viewers.push(userId);
      await product.save(); // Save only if the view is incremented
    }

    res.status(200).json({ message: 'View tracked successfully', views: product.views });
  } catch (error) {
    console.error("Error tracking product view", error);
    res.status(500).json({ message: 'Server error', error });
  }
};




const addOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      orderItemsCount,
      userId,
      artistId,
    } = req.body;
    console.log(orderItems[0]['productId']);
    const products = await Product.findById(orderItems[0]['productId']);
    console.log(products);

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items found.' });
    }

    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      customer: userId,
      orderItemsCount,
      totalPrice,
      products,
      artistId,
    });

    const createdOrder = await order.save();

    res.status(201).json({
      message: 'Order created successfully.',
      order: createdOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





const getShipmentHistory = async (req, res) => {
  try {
    const userId = req.params.id; 
    console.log('User ID:', userId);

    const orders = await Order.find({ customer: userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json({
      message: 'Shipment history retrieved successfully.',
      orders,
    });
  } catch (error) {
    console.error('Error retrieving shipment history:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getorders = async (req, res) => {
  try {
    const { artistId } = req.params; 
    console.log('Artist ID:', artistId);
    const orders = await Order.find({ artistId: artistId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this artist.' });
      }
      
    res.status(200).json({
      message: 'Orders retrieved successfully.',
      orders,
    });
    } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    }

}



module.exports = { 
  CreateProduct, 
  getProducts, 
  deleteProducts, 
  updateProduct, 
  getProductbyId, 
  getProductByArtID, 
  addToCart, 
  removeFromCart,  
  productView,
  wishList,
  addOrder,
  getShipmentHistory,
  getorders,
 
};
