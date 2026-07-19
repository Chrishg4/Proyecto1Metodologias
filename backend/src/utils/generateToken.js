import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const userData = user.toObject ? user.toObject() : { ...user };

  userData.id = userData.id || userData._id?.toString();
  userData.name = userData.name || userData.nombre;
  userData.role = userData.role || userData.rol;
  userData.authProvider = userData.authProvider || userData.proveedorAutenticacion;

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: userData,
  });
};
