import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { routesStatic } from '../../routes';
import EssG from '../../assets/files/images/logo/EssG.png';
import { useTitle } from '@/hooks/useTitle';
import useScrollToTop from '@/hooks/useScrollToTop';

export default function Login() {
  useScrollToTop();
  useTitle('Authentification');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { from?: Location } | null;
  const fromPath =
    state?.from?.pathname && state.from.pathname !== routesStatic.login
      ? state.from.pathname + state.from.search
      : routesStatic.dashboard;

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Format d'email invalide";
    }

    if (!password) {
      errors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await login(email, password);
      navigate(fromPath, { replace: true });
    } catch (err) {
      setError('Email ou mot de passe incorrect');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>

      <div
        className="h-[100dvh] overflow-hidden flex items-center justify-center px-4 sm:px-6"
        style={{
          backgroundImage:
            "linear-gradient(rgba(3, 7, 18, 0.82), rgba(3, 7, 18, 0.92)), url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="w-full max-w-sm sm:max-w-md">
          <div
            className="bg-white/90 backdrop-blur-lg border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300"
            style={{ animation: 'fadeUp 0.55s ease-out' }}
          >
            <div className="text-center mb-5 sm:mb-6">
              <div className="flex justify-center mb-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 shadow-md">
                  <img src={EssG} alt="Logo ESSG" className="h-12 w-auto object-contain sm:h-14" />
                </div>
              </div>
              <p className="text-sage-300 text-sm sm:text-base font-medium mb-2">
                Bienvenue dans votre espace d’administration
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              {error && (
                <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ink-300 mb-2">
                    Email
                  </label>

                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-ink-400 pointer-events-none">
                      <Mail className="size-4" />
                    </span>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (validationErrors.email) {
                          setValidationErrors({
                            ...validationErrors,
                            email: undefined,
                          });
                        }
                      }}
                      required
                      placeholder="admin@essg.sn"
                      className="w-full h-11 sm:h-12 pl-11 pr-4 bg-ink-800/90 border border-ink-700 rounded-xl text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="min-h-[18px] mt-1">
                    {validationErrors.email && (
                      <p className="text-sm text-red-400">{validationErrors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-ink-300 mb-2">
                    Mot de passe
                  </label>

                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-ink-400 pointer-events-none">
                      <Lock className="size-4" />
                    </span>

                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (validationErrors.password) {
                          setValidationErrors({
                            ...validationErrors,
                            password: undefined,
                          });
                        }
                      }}
                      required
                      placeholder="••••••••"
                      className="w-full h-11 sm:h-12 pl-11 pr-12 bg-ink-800/90 border border-ink-700 rounded-xl text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-ink-400 hover:text-white transition"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>

                  <div className="min-h-[18px] mt-1">
                    {validationErrors.password && (
                      <p className="text-sm text-red-400">{validationErrors.password}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sage-500 hover:bg-sage-600 disabled:bg-sage-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center shadow-lg shadow-sage-800/20"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-ink-800 text-center">
              <p className="text-xs text-ink-500 mt-1">
                © {new Date().getFullYear()} ESSG — Tous droits réservés
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
