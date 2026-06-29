import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  contrasena: {
    type: String,
    select: false,
  },
  rol: {
    type: String,
    enum: ['admin', 'agent', 'user'],
    default: 'user',
  },
  proveedorAutenticacion: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  googleId: {
    type: String,
    sparse: true,
  },
  avatar: {
    type: String,
  },
  emailVerificado: {
    type: Boolean,
    default: false,
  },
  departamentos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  }],
  activo: {
    type: Boolean,
    default: true,
  },
  ultimoInicioSesion: Date,
}, {
  timestamps: true,
});

usuarioSchema.pre('save', async function() {
  if (!this.isModified('contrasena') || !this.contrasena) {
    return;
  }
  this.contrasena = await bcrypt.hash(this.contrasena, 12);
});

usuarioSchema.methods.compararContrasena = async function(candidatePassword) {
  if (!this.contrasena) return false;
  return await bcrypt.compare(candidatePassword, this.contrasena);
};

usuarioSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.contrasena;
  return obj;
};

export default mongoose.model('Usuario', usuarioSchema);
