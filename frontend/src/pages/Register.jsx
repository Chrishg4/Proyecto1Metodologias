import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, CheckCircle2, Eye, EyeOff, X, Check } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    let strength = 'weak';
    let color = 'bg-destructive';

    if (passedChecks >= 5) {
      strength = 'strong';
      color = 'bg-chart-1';
    } else if (passedChecks >= 3) {
      strength = 'medium';
      color = 'bg-chart-3';
    }

    return { checks, strength, color, passedChecks };
  };

  const passwordValidation = formData.password ? validatePassword(formData.password) : null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordValidation && passwordValidation.passedChecks < 4) {
      toast.error('Crea una contrasena mas segura');
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Cuenta creada correctamente');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrar la cuenta');
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
              Unete a miles de equipos que gestionan soporte de forma eficiente
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-white mt-1 shrink-0" size={24} />
                <div>
                  <h3 className="text-white font-semibold text-lg">Configuracion rapida</h3>
                  <p className="text-primary-foreground/80">Empieza en minutos con una interfaz intuitiva</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-white mt-1 shrink-0" size={24} />
                <div>
                  <h3 className="text-white font-semibold text-lg">Funciones potentes</h3>
                  <p className="text-primary-foreground/80">Todo lo que necesitas para gestionar solicitudes de forma efectiva</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-white mt-1 shrink-0" size={24} />
                <div>
                  <h3 className="text-white font-semibold text-lg">Empieza gratis</h3>
                  <p className="text-primary-foreground/80">No necesitas tarjeta, empieza a gestionar solicitudes hoy mismo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="relative z-10 text-primary-foreground/60 text-sm">
          © 2025 Mesa de Ayuda. Todos los derechos reservados.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Crea tu cuenta</h2>
            <p className="text-muted-foreground">Empieza a gestionar tus solicitudes de soporte hoy</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Juan Perez"
                  className="w-full pl-11 pr-4 py-3 border-2 border-border rounded-lg text-base bg-background text-foreground transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Correo electronico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Crea una contrasena segura"
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

              {}
              {formData.password && passwordValidation && (
                <div className="mt-3 space-y-3">
                  {}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Fortaleza de la contrasena:</span>
                      <span className={`font-semibold capitalize ${
                        passwordValidation.strength === 'strong' ? 'text-chart-1' :
                        passwordValidation.strength === 'medium' ? 'text-chart-3' :
                        'text-destructive'
                      }`}>
                        {passwordValidation.strength}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordValidation.color}`}
                        style={{ width: `${(passwordValidation.passedChecks / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  {}
                  <div className="space-y-2 text-sm">
                    <div className={`flex items-center gap-2 ${passwordValidation.checks.length ? 'text-chart-1' : 'text-muted-foreground'}`}>
                      {passwordValidation.checks.length ? (
                        <Check size={16} className="shrink-0" />
                      ) : (
                        <X size={16} className="shrink-0" />
                      )}
                      <span>Al menos 8 caracteres</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.checks.uppercase ? 'text-chart-1' : 'text-muted-foreground'}`}>
                      {passwordValidation.checks.uppercase ? (
                        <Check size={16} className="shrink-0" />
                      ) : (
                        <X size={16} className="shrink-0" />
                      )}
                      <span>Una letra mayuscula</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.checks.lowercase ? 'text-chart-1' : 'text-muted-foreground'}`}>
                      {passwordValidation.checks.lowercase ? (
                        <Check size={16} className="shrink-0" />
                      ) : (
                        <X size={16} className="shrink-0" />
                      )}
                      <span>Una letra minuscula</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.checks.number ? 'text-chart-1' : 'text-muted-foreground'}`}>
                      {passwordValidation.checks.number ? (
                        <Check size={16} className="shrink-0" />
                      ) : (
                        <X size={16} className="shrink-0" />
                      )}
                      <span>Un numero</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.checks.special ? 'text-chart-1' : 'text-muted-foreground'}`}>
                      {passwordValidation.checks.special ? (
                        <Check size={16} className="shrink-0" />
                      ) : (
                        <X size={16} className="shrink-0" />
                      )}
                      <span>Un caracter especial (!@#$%^&*)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
                Al crear una cuenta, aceptas nuestros{' '}
              <Link to="/terms" className="text-primary hover:underline">
                Terminos del servicio
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Politica de privacidad
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || (passwordValidation && passwordValidation.passedChecks < 4)}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg text-base font-semibold transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center mt-8 text-muted-foreground">
            Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Iniciar sesion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
