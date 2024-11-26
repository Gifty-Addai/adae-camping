import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  const token = jwt.sign(
    { userId: userId },
    process.env.JWT_SECRET,  
    { expiresIn: '7d' }
  );

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  // Ensures cookies are sent over HTTPS in production
    sameSite: 'strict',  // Prevents the cookie from being sent in cross-site requests
    maxAge: 7 * 24 * 60 * 60 * 1000,  // Cookie expiration (7 days in ms)
  });

  return token;
};
