import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-contrasena');

    if (user) {
      req.user = user.toObject ? user.toObject() : { ...user };
      req.user.id = req.user.id || req.user._id?.toString();
      req.user.name = req.user.name || req.user.nombre;
      req.user.role = req.user.role || req.user.rol;
      req.user.authProvider = req.user.authProvider || req.user.proveedorAutenticacion;
    }

    if (!req.user || !req.user.activo) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        message: `User role '${req.user.rol}' is not authorized to access this route`,
      });
    }
    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-contrasena');
    }

    next();
  } catch (error) {
    next();
  }
};
