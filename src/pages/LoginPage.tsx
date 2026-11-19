import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Landmark, AlertCircle, Loader2, Brain, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { ROUTES } from '@/config/app.config'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signInWithGoogle, isConfigured, configMessage } = useAuth()
  const { t, fontClass, isTelugu, isHindi } = useLanguage()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const redirectPath = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.DASHBOARD

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email.trim()) {
      setErrorMessage(
        isTelugu
          ? 'దయచేసి మీ ఈమెయిల్ చిరునామాను నమోదు చేయండి.'
          : isHindi
          ? 'कृपया अपना ईमेल पता दर्ज करें।'
          : 'Please enter your email address.'
      )
      return
    }

    if (!password) {
      setErrorMessage(
        isTelugu
          ? 'దయచేసి మీ పాస్‌వర్డ్‌ను నమోదు చేయండి.'
          : isHindi
          ? 'कृपया अपना पासवर्ड दर्ज करें।'
          : 'Please enter your password.'
      )
      return
    }

    setLoading(true)

    const result = await signIn({ email, password })

    setLoading(false)

    if (result.success) {
      setSuccessMessage(t('authSuccessSignIn'))
      setTimeout(() => {
        navigate(redirectPath, { replace: true })
      }, 500)
    } else {
      setErrorMessage(
        result.error ||
          (isTelugu
            ? 'ధ్రువీకరణ విఫలమైంది. దయచేసి మీ వివరాలను సరిచూసుకోండి.'
            : isHindi
            ? 'प्रमाणीकरण विफल। कृपया अपने विवरण की जाँच करें।'
            : 'Authentication failed. Please check your credentials.')
      )
    }
  }

  return (
    <div className={`animate-fade-in max-w-md mx-auto ${fontClass}`}>
      {/* Brand mark */}
      <div className="text-center mb-6">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-[var(--color-primary)] items-center justify-center mb-4 shadow-md">
          <Landmark className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">{t('authWelcomeBack')}</h1>
        <p className="text-[var(--color-muted-foreground)] text-sm mt-1">
          {t('authSignInSubtitle')}
        </p>
      </div>

      {/* Supabase Configuration Banner (if unconfigured) */}
      {!isConfigured && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{isTelugu ? 'డేటాబేస్ అనుసంధానం పెండింగ్‌లో ఉంది' : isHindi ? 'डेटाबेस क्रेडेंशियल लंबित' : 'Supabase Credentials Pending'}</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            {configMessage}
          </p>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Banner */}
      {successMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="card p-6 sm:p-8 shadow-sm rounded-2xl border border-[var(--color-border)] bg-white">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1.5">
              {t('authEmailLabel')}
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)] pointer-events-none shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.gov.in"
                required
                disabled={loading}
                className="input-base input-with-icon-left w-full bg-white text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[var(--color-foreground)]">{t('authPasswordLabel')}</label>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)] pointer-events-none shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="input-base input-with-icon-left input-with-icon-right w-full bg-white text-xs sm:text-sm"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded-lg hover:bg-black/5 transition-colors focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full h-11 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 mt-5 shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('authLoggingIn')}</span>
              </>
            ) : (
              <span>{t('authSignInBtn')}</span>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--color-border)]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2 text-[var(--color-muted-foreground)] font-bold">{t('authOrDivider')}</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={async () => {
              setLoading(true)
              setErrorMessage(null)
              const res = await signInWithGoogle()
              if (!res.success) {
                setLoading(false)
                setErrorMessage(res.error || 'Failed to initiate Google authentication.')
              }
            }}
            disabled={loading}
            className="w-full h-11 border border-[var(--color-border)] hover:bg-[var(--color-muted)] text-[var(--color-foreground)] rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{t('authGoogleSignIn')}</span>
          </button>
        </form>

        {/* Development / Demo Quick Access */}
        {!isConfigured && (
          <div className="mt-5 pt-4 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="btn btn-outline w-full h-9 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Brain className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              <span>{isTelugu ? 'డెమో డ్యాష్‌బోర్డ్ చూడండి' : isHindi ? 'डेमो डैशबोर्ड देखें' : 'Explore Demo Dashboard (Offline Preview)'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Register link */}
      <p className="text-center text-xs text-[var(--color-muted-foreground)] mt-6">
        {t('authNoAccount')}{' '}
        <Link to={ROUTES.REGISTER} className="text-[var(--color-secondary)] font-bold hover:underline">
          {t('authSignUpBtn')}
        </Link>
      </p>
    </div>
  )
}
