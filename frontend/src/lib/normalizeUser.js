const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    id: user.id || user._id,
    name: user.name || user.nombre,
    role: user.role || user.rol,
    authProvider: user.authProvider || user.proveedorAutenticacion,
  };
};

export default normalizeUser;