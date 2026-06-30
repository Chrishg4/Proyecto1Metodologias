import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    isHidden: false,
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/departments?includeHidden=true');
      setDepartments(data.data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      toast.error('No se pudieron cargar los departamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await api.put(`/departments/${editingDept._id}`, formData);
        toast.success('Departamento actualizado correctamente');
      } else {
        await api.post('/departments', formData);
        toast.success('Departamento creado correctamente');
      }
      setShowModal(false);
      resetForm();
      fetchDepartments();
    } catch (error) {
      console.error('Failed to save department:', error);
      toast.error(error.response?.data?.message || 'No se pudo guardar el departamento');
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description || '',
      email: dept.email,
      isHidden: dept.isHidden,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Estas seguro de que quieres eliminar este departamento?')) return;

    try {
      await api.delete(`/departments/${id}`);
      toast.success('Departamento eliminado correctamente');
      fetchDepartments();
    } catch (error) {
      console.error('Failed to delete department:', error);
      toast.error('No se pudo eliminar el departamento');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      email: '',
      isHidden: false,
    });
    setEditingDept(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Departamentos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sm"
        >
          <Plus size={20} />
          Agregar departamento
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px] text-lg text-muted-foreground">
          Cargando departamentos...
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b-2 border-border">
                  <th className="px-4 py-4 text-left font-semibold text-foreground">Nombre</th>
                  <th className="px-4 py-4 text-left font-semibold text-foreground">Correo</th>
                  <th className="px-4 py-4 text-left font-semibold text-foreground">Descripcion</th>
                  <th className="px-4 py-4 text-left font-semibold text-foreground">Visibilidad</th>
                  <th className="px-4 py-4 text-left font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept._id} className="border-b border-border hover:bg-accent transition-colors">
                    <td className="px-4 py-4 font-medium text-foreground">{dept.name}</td>
                    <td className="px-4 py-4 text-muted-foreground">{dept.email}</td>
                    <td className="px-4 py-4 text-muted-foreground">{dept.description || '-'}</td>
                    <td className="px-4 py-4">
                      <span className={`flex items-center gap-1 w-fit px-2 py-1 rounded-sm text-xs font-semibold ${
                        dept.isHidden
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-chart-1/20 text-chart-1'
                      }`}>
                        {dept.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                        {dept.isHidden ? 'Oculto' : 'Visible'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(dept)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(dept._id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">
                {editingDept ? 'Editar departamento' : 'Agregar departamento'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-border rounded-md bg-background text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Correo *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-border rounded-md bg-background text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descripcion
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-border rounded-md bg-background text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  rows="3"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isHidden"
                  checked={formData.isHidden}
                  onChange={(e) => setFormData({ ...formData, isHidden: e.target.checked })}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary/20"
                />
                <label htmlFor="isHidden" className="text-sm text-foreground">
                  Ocultar de usuarios (solo admin)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-all"
                >
                  {editingDept ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-muted text-foreground rounded-md font-semibold hover:bg-muted/80 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
