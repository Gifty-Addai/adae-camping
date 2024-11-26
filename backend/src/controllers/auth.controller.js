import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';

// Signup function for registering a new user
const signup = async (req, res, next) => {
    console.log('Request Body:', req.body);
  const { name, email, password, phone } = req.body;

  // Input validation (simple example)
  if (!email || !password || !name || !phone) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Save the user to the database
    await newUser.save();

    // Optionally, send a verification email here

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required!' });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = generateToken(user._id, res);

    // Return the token to the client
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const logout = (req, res, next) => {
  try {
    // Here we simply send a response, as JWT logout is client-side (by deleting the token)
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export { signin, signup, logout };
