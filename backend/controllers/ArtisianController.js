const Artisian = require("../model/Artisians");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Admin = require("../model/Admin");
const User = require("../model/users");
const multer = require('multer');
const path = require('path');


const CreateUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { name }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or name already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const username =
      name.toLowerCase().replace(/\s+/g, "_") +
      Math.floor(Math.random() * 1000); // Generate unique username
    const user = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({
      message: "Server error, please try again later.",
      error: error.message,
    });
  }
};

const CreateArtisian = async function (req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingArtisian = await Artisian.findOne({ email });
    if (existingArtisian) {
      return res.status(400).json({ message: "Artisian already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const artisian = new Artisian({ name, email, password: hashedPassword, role: 'artisan' });
    const token = jsonwebtoken.sign(
      { name: artisian.name, id: artisian._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log(token);
    
    await artisian.save();
    res
      .status(201)
      .json({
        message: "Artisian created successfully",
        admin: true,
        token,
        artisian,
        success: true,
        role: artisian.role,
        artid: artisian._id,
      });
  } catch (error) {
    console.error("Error creating artisian:", error);
    res.status(500).json({
      message: "Server error, please try again later.",
      error: error.message,
    });
  }
};

const LoginArtisian = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const artisian = await Artisian.findOne({ email });
    if (!artisian) {
      return res.status(404).json({ message: "Artisian not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, artisian.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jsonwebtoken.sign(
      { name: artisian.name, id: artisian._id },
      "test",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      success: true,
      token,
      admin: true,
      role: artisian.role,
      artid: artisian._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error, please try again later.",
      error: error.message,
    });
  }
};


const getArtisan = async (req, res) =>
{
  try {
    const artisian = await Artisian.findById(req.params.id);
    if (!artisian) {
      return res.status(404).json({ message: "Artisian not found" });
    }
    res.json(artisian);
  } catch (error) {
    res.status(500).json({
      message: "Server error, please try again later.",
      error: error.message,
    });
  }
};






const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Path where files are stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage 
});

const updateArtisan = async (req, res) => {
  try {
    if (req.file) {
      // Attach the image URL to req.body
      req.body.img = `uploads/${req.file.filename}`; // Store relative path
    }

    const artisan = await Artisian.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, 
      { new: true, runValidators: true }
    );

    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    res.json({ message: "Artisan updated successfully", data: artisan });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error, please try again later.",
      error: error.message,
    });
  }
};





const UserLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 1️⃣ Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Compare passwords using bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Generate a JWT token (only include user ID to avoid exposing sensitive info)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 4️⃣ Send token in HTTP-Only cookie (this is more secure than localStorage)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });

    res
      .status(200)
      .json({
        message: "Login successful",
        codCount: user.codCount,
        token,
        userid: user._id,
      });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("�� Server Error:", error);
    res
     .status(500)
     .json({ message: "Server error, please try again later." });
  }
};


const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("❌ Server Error:", error);
    res
      .status(500)
      .json({
        message: "Server error, please try again later.",
        error: error.message,
      });
  }
};


const adduserCart = async (req, res) => {
  const { userId, productIds } = req.body; // productIds as [{ productId: 'id1', quantity: 2 }, ...]
  
  if (!userId || !Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ message: "UserId and product details are required" });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Loop through each product in the request using for...of to handle async operations
    for (const { productId, quantity,name } of productIds) {
      if (!productId || quantity == null || name == null) {
        return res.status(400).json({ message: "ProductId and quantity are required for each product" });
      }

      // Check if the user has already added the product to their cart
      const existingProductIndex = user.cart.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingProductIndex !== -1) {
        // If the product already exists, update the quantity and name
        user.cart[existingProductIndex].quantity += quantity;
        user.cart[existingProductIndex].name = name || user.cart[existingProductIndex].name;
      } else {
        // If the product is not in the cart, add it with the name, productId, and quantity
        user.cart.push({ productId, quantity, name });
      }
    }

    await user.save();
    res.status(201).json({ message: "Products added/updated in cart successfully", cart: user.cart });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};



const updateEarnedAmountForArtisian = async (req, res) => {
  const { artisianId, amount } = req.body;

  // Check if artisanId and amount are provided
  if (!artisianId || amount === undefined) {
    return res
      .status(400)
      .json({ message: "Artisan ID and amount are required" });
  }

  // Check if the amount is a positive number
  if (typeof amount !== "number" || amount <= 0) {
    console.log("Amount must be a positive number")
    return res
      .status(400)
      .json({ message: "Amount must be a positive number" });
  }

  try {
    // Find the artisan by ID
    const artisian = await Artisian.findById(artisianId);

    if (!artisian) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    // Update the earned amount by adding the new amount
    artisian.earnedAmount += amount;
    console.log(artisian.earnedAmount);
    // Save the updated artisan document
    await artisian.save();

    res.status(200).json({
      message: "Earned amount updated successfully",
      earnedAmount: artisian.earnedAmount,
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

const getEarnedAmount = async (req, res) => {
  console.log("Request params:", req.params); // Log entire params object

  const artisanId = req.params.id;
  console.log(artisanId);
  try {
    const artisan = await Artisian.findOne({
      _id: new mongoose.Types.ObjectId(artisanId),
    });
    res.json({ earnedAmount: artisan.earnedAmount });
    console.log(artisan.earnedAmount);
  } catch (error) {
    console.log("❌ Server Error:", error);
    res
      .status(500)
      .json({
        message: "Server error, please try again later.",
        error: error.message,
      });
  }
};

const leader = async (req, res) => {
  try {
    const artisans = await Artisian.find().sort({ earnedAmount: -1 }).limit(5);
    res.json(artisans);
  } catch (error) {
    console.error("�� Server Error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

const CheckcodPayment = async (req, res) => {
  try {
    const { id } = req.params; // Use id from URL params
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ codCount: user.codCount });
  } catch (error) {
    console.error("Error in Check COD Limit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const codPayment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.codCount >= 5) {
      return res
        .json({
          message: "COD limit reached. You cannot make more COD payments.",
        });
    }

    user.codCount += 1; // Only increment on payment
    await user.save();

    res.status(200).json({
      message: "COD payment successful!",
      codCount: user.codCount,
    });
  } catch (error) {
    console.error("Error in COD Payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const AdminLogin = async (req, res) => {
  const { username, password } = req.body;

  // Step 1: Validate input fields
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Step 2: Find the admin by username
    const admin = await Admin.findOne({ username: username });
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Step 3: Compare provided password with the stored password in the database
    if (admin.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Step 4: Generate a JWT token (e.g., using JWT library)
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Step 4: If successful, you can generate a JWT token or set a session, etc.
    return res.status(200).json({ message: "Login successful", adminId: admin._id,token });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



const awardArtisan = async (req, res) => {
  try {
    // Retrieve the artisan ID from the request body
    const artisanId = req.body.artisanId;

    // Find the artisan by ID and update their earned amount (or any other field)
    const artisan = await Artisian.findById(artisanId);

    if (!artisan) {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    // Award the artisan by increasing their earnedAmount (you can modify this as per your logic)
    artisan.badge = 'Artisan Of The Month...';  // Example of awarding 1000 to the artisan

    // Save the updated artisan document
    await artisan.save();

    // Send success response
    res.status(200).json({ message: 'Artisan awarded successfully', artisan });
  } catch (error) {
    console.error('Error awarding artisan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getArtisans = async (req, res) => {
  try {
    const artisans = await Artisian.find();
    console.log(artisans);
    res.json(artisans);
  } catch (error) {
    console.error('Error fetching artisans:', error);
    res.status(500).json({ message: 'Server error' });
  }
}





module.exports = {
  CreateArtisian,
  LoginArtisian,
  UserLogin,
  CreateUser,
  getUserById,
  updateEarnedAmountForArtisian,
  getEarnedAmount,
  leader,
  CheckcodPayment,
  codPayment,
  adduserCart,
  AdminLogin,
  awardArtisan,
  getArtisan,
  updateArtisan,
  upload,
  getArtisans,
  getUsers
};
