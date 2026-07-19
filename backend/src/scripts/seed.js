import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Usuario from '../models/User.js';
import Department from '../models/Department.js';
import Status from '../models/Status.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Usuario.deleteMany({});
    await Department.deleteMany({});
    await Status.deleteMany({});
    console.log('Cleared existing data');

    const admin = await Usuario.create({
      nombre: 'Admin User',
      email: 'admin@example.com',
      contrasena: 'admin123', // se hashea automáticamente
      rol: 'admin',
      proveedorAutenticacion: 'local',
    });

    const agent = await Usuario.create({
      nombre: 'Support Agent',
      email: 'agent@example.com',
      contrasena: 'agent123',
      rol: 'agent',
      proveedorAutenticacion: 'local',
    });

    const user = await Usuario.create({
      nombre: 'Test User',
      email: 'user@example.com',
      contrasena: 'user123',
      rol: 'user',
      proveedorAutenticacion: 'local',
    });

    console.log('Created users');

    const departments = await Department.insertMany([
      {
        name: 'Soporte Técnico',
        description: 'Problemas técnicos y troubleshooting',
        email: 'tech@example.com',
        assignedAdmins: [admin._id, agent._id],
        isHidden: false,
      },
      {
        name: 'Facturación',
        description: 'Consultas de pagos y facturación',
        email: 'billing@example.com',
        assignedAdmins: [admin._id],
        isHidden: false,
      },
      {
        name: 'Ventas',
        description: 'Consultas de productos y ventas',
        email: 'sales@example.com',
        assignedAdmins: [admin._id],
        isHidden: false,
      },
      {
        name: 'Interno',
        description: 'Departamento interno para escalaciones',
        email: 'internal@example.com',
        assignedAdmins: [admin._id],
        isHidden: true,
      },
    ]);
    console.log('Created departments');

    const statuses = await Status.insertMany([
      {
        title: 'Abierto',
        color: '#3B82F6',
        includeInActive: true,
        autoClose: false,
        order: 1,
        isSystem: true,
      },
      {
        title: 'En Progreso',
        color: '#F59E0B',
        includeInActive: true,
        autoClose: false,
        order: 2,
        isSystem: false,
      },
      {
        title: 'Esperando al Cliente',
        color: '#8B5CF6',
        includeInActive: true,
        autoClose: true,
        autoCloseAfterDays: 7,
        order: 3,
        isSystem: false,
      },
      {
        title: 'Escalado',
        color: '#EF4444',
        includeInActive: true,
        autoClose: false,
        order: 4,
        isSystem: false,
      },
      {
        title: 'Resuelto',
        color: '#10B981',
        includeInActive: true,
        autoClose: true,
        autoCloseAfterDays: 3,
        order: 5,
        isSystem: false,
      },
      {
        title: 'Cerrado',
        color: '#6B7280',
        includeInActive: false,
        autoClose: false,
        order: 6,
        isSystem: true,
      },
    ]);
    console.log('Created statuses');

    console.log('\n=== Seed Data Summary ===');
    console.log('\nUsuarios:');
    console.log(`Admin: admin@example.com / admin123`);
    console.log(`Agent: agent@example.com / agent123`);
    console.log(`User: user@example.com / user123`);
    console.log(`\nDepartments: ${departments.length}`);
    console.log(`Statuses: ${statuses.length}`);
    console.log('\n=========================\n');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
