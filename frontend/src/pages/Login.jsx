import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Inicio de sesion exitoso');
      navigate('/');
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Los datos o credenciales son inválidos');
      } else {
        toast.error(error.response?.data?.message || 'Error al iniciar sesion');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary via-primary/90 to-chart-2 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">Support Desk</h1>
          <p className="text-primary-foreground/80 text-lg">Optimiza tu atencion al cliente</p>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Todo lo que necesitas para gestionar solicitudes de soporte
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-white mt-1 shrink-0" size={24} />
                <div>
                  <h3 className="text-white font-semibold text-lg">Notificaciones en tiempo real</h3>
                  <p className="text-primary-foreground/80">Mantente al dia con alertas instantaneas de los cambios</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-white mt-1 shrink-0" size={24} />
                <div>
                  <h3 className="text-white font-semibold text-lg">Escalamiento inteligente</h3>
                  <p className="text-primary-foreground/80">Distribucion automatica de solicitudes segun prioridad y SLA</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-white mt-1 shrink-0" size={24} />
                <div>
                  <h3 className="text-white font-semibold text-lg">Colaboracion de equipo</h3>
                  <p className="text-primary-foreground/80">Trabaja en conjunto de forma fluida con tu equipo de soporte</p>
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="relative z-10 text-primary-foreground/60 text-sm">
           Metodologías Agiles de Desarrollo de Software
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Bienvenido de nuevo</h2>
            <p className="text-muted-foreground">Inicia sesion en tu cuenta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Correo electronico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@ejemplo.com"
                  className="w-full pl-11 pr-4 py-3 border-2 border-border rounded-lg text-base bg-background text-foreground transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Ingresa tu contrasena"
                  className="w-full pl-11 pr-12 py-3 border-2 border-border rounded-lg text-base bg-background text-foreground transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm text-primary font-medium hover:underline">
                Olvidaste tu contrasena?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg text-base font-semibold transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesion'}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center mt-8 text-muted-foreground">
            No tienes una cuenta?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
