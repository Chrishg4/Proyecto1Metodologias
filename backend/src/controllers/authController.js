import User from '../models/User.js';
import { sendTokenResponse } from '../utils/generateToken.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      nombre: name,
      email,
      contrasena: password,
      proveedorAutenticacion: 'local',
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+contrasena');

    if (!user || !(await user.compararContrasena(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.activo) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    user.ultimoInicioSesion = new Date();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).populate('departments');

  const userData = user.toObject ? user.toObject() : { ...user };
  userData.id = userData.id || userData._id?.toString();
  userData.name = userData.name || userData.nombre;
  userData.role = userData.role || userData.rol;
  userData.authProvider = userData.authProvider || userData.proveedorAutenticacion;

  res.status(200).json({
    success: true,
    data: userData,
  });
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ activo: true })
      .select('nombre email rol')
      .sort({ nombre: 1 });

    const normalizedUsers = users.map((user) => {
      const userData = user.toObject ? user.toObject() : { ...user };
      userData.id = userData.id || userData._id?.toString();
      userData.name = userData.name || userData.nombre;
      userData.role = userData.role || userData.rol;
      userData.authProvider = userData.authProvider || userData.proveedorAutenticacion || 'local';
      return userData;
    });

    res.status(200).json({
      success: true,
      data: normalizedUsers,
    });
  } catch (error) {
    next(error);
  }
};
