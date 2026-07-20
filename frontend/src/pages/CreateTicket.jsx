import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Paperclip } from 'lucide-react';
import FileUpload from '../components/FileUpload';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    department: '',
    tags: '',
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get('/departments');
      setDepartments(data.data || []);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      toast.error('No se pudieron cargar los departamentos');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('El titulo es obligatorio');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('La descripcion es obligatoria');
      return;
    }
    if (!formData.department) {
      toast.error('El departamento es obligatorio');
      return;
    }

    setLoading(true);
    try {
      const ticketData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      };

      const response = await ticketService.createTicket(ticketData);
      setCreatedTicketId(response.data._id);
      toast.success('Solicitud creada correctamente');

      setShowFileUpload(true);
    } catch (error) {
      console.error('Failed to create ticket:', error);
      toast.error(error.response?.data?.message || 'No se pudo crear la solicitud');
      setLoading(false);
    }
  };

  const handleSkipFiles = () => {
    navigate(`/tickets/${createdTicketId}`);
  };

  const handleFilesUploaded = () => {
    navigate(`/tickets/${createdTicketId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Crear nueva solicitud</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/tickets')}
            className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            Volver a solicitudes
          </button>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
        {!showFileUpload ? (
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-2">
                Titulo <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-border rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
                placeholder="Breve descripcion del problema"
                required
              />
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-2">
                Descripcion <span className="text-destructive">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border-2 border-border rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-foreground resize-none"
                placeholder="Descripcion detallada del problema..."
                required
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-foreground mb-2">
                Prioridad <span className="text-destructive">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-border rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-foreground cursor-pointer"
                required
              >
                <option value="Low">Baja</option>
                <option value="Medium">Media</option>
                <option value="High">Alta</option>
                <option value="Critical">Critica</option>
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-semibold text-foreground mb-2">
                Departamento <span className="text-destructive">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-border rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-foreground cursor-pointer"
                required
              >
                <option value="">Selecciona un departamento</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="tags" className="block text-sm font-semibold text-foreground mb-2">
                Etiquetas (opcional)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-border rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
                placeholder="Separa etiquetas con comas (ej., bug, urgente, acceso)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separa varias etiquetas con comas
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {loading ? 'Creando...' : 'Crear solicitud'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/tickets')}
              className="px-6 py-3 bg-muted text-foreground rounded-md font-semibold hover:bg-muted/80 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center pb-6 border-b border-border">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Paperclip size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Agregar archivos adjuntos (opcional)
              </h2>
              <p className="text-muted-foreground">
                Sube capturas, registros o documentos para ayudarnos a resolver tu problema mas rapido
              </p>
            </div>

            <FileUpload
              ticketId={createdTicketId}
              onUploadComplete={handleFilesUploaded}
            />

            <div className="flex gap-4 pt-4 border-t border-border">
              <button
                onClick={handleFilesUploaded}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-all"
              >
                Continuar a la solicitud
              </button>
              <button
                onClick={handleSkipFiles}
                className="px-6 py-3 bg-muted text-foreground rounded-md font-semibold hover:bg-muted/80 transition-all"
              >
                Omitir
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default CreateTicket;

