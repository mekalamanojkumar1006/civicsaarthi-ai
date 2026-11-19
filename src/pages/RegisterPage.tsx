import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, Landmark, AlertCircle, Loader2, CheckCircle2, MapPin, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { ROUTES, APP_CONFIG } from '@/config/app.config'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Kerala',
  'Gujarat',
  'Rajasthan',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Bihar',
  'West Bengal',
  'Odisha',
  'Punjab',
  'Haryana',
  'Delhi',
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle, isConfigured, configMessage } = useAuth()
  const { t, fontClass, isTelugu, isHindi } = useLanguage()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [password, setPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successInfo, setSuccessInfo] = useState<{ message: string; requiresEmailConfirmation: boolean } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessInfo(null)

    if (!fullName.trim()) {
      setErrorMessage(
        isTelugu
          ? 'దయచేసి మీ పూర్తి పేరును నమోదు చేయండి.'
          : isHindi
          ? 'कृपया अपना पूरा नाम दर्ज करें।'
          : 'Please enter your full name.'
      )
      return
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(
        isTelugu
          ? 'దయచేసి సరైన ఈమెయిల్ చిరునామాను నమోదు చేయండి.'
          : isHindi
          ? 'कृपया वैध ईमेल पता दर्ज करें।'
          : 'Please enter a valid email address.'
      )
      return
    }

    if (password.length < 6) {
      setErrorMessage(
        isTelugu
          ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.'
          : isHindi
          ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।'
          : 'Password must be at least 6 characters long.'
      )
      return
    }

    if (!agreeTerms) {
      setErrorMessage(
        isTelugu
          ? 'దయచేసి సేవా నిబంధనలను అంగీకరించండి.'
          : isHindi
          ? 'पंजीकरण के लिए कृपया सेवा की शर्तों को स्वीकार करें।'
          : 'Please accept the Terms of Service to register.'
      )
      return
    }

    setLoading(true)

    const result = await signUp({
      email,
      password,
      fullName,
      phone,
      state,
      district,
      dateOfBirth: dateOfBirth || undefined,
    })

    setLoading(false)

    if (result.success) {
      if (result.requiresEmailConfirmation) {
        setSuccessInfo({
          message: isTelugu
            ? 'ఖాతా సృష్టించబడింది! దయచేసి సైన్ ఇన్ చేయడానికి ముందు మీ ఈమెయిల్ ఇన్‌బాక్స్‌ను తనిఖీ చేసి నిర్ధారించండి.'
            : isHindi
            ? 'खाता बनाया गया! कृपया साइन इन करने से पहले अपने ईमेल इनबॉक्स में पुष्टि करें।'
            : 'Account created! Please check your email inbox to confirm your registration before signing in.',
          requiresEmailConfirmation: true,
        })
      } else {
        setSuccessInfo({
          message: t('authSuccessSignUp'),
          requiresEmailConfirmation: false,
        })
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD, { replace: true })
        }, 800)
      }
    } else {
      setErrorMessage(
        result.error ||
          (isTelugu
            ? 'రిజిస్ట్రేషన్ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.'
            : isHindi
            ? 'पंजीकरण विफल रहा। कृपया पुन: प्रयास करें।'
            : 'Registration failed. Please try again.')
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
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">{t('authSignUpBtn')}</h1>
        <p className="text-[var(--color-muted-foreground)] text-sm mt-1">
          {t('tagline')}
        </p>
      </div>

      {/* Supabase Configuration Alert */}
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

      {/* Success Notification */}
      {successInfo && (
        <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{isTelugu ? 'నమోదు విజయవంతమైంది' : isHindi ? 'पंजीकरण सफल' : 'Registration Successful'}</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            {successInfo.message}
          </p>
          {successInfo.requiresEmailConfirmation && (
            <Link
              to={ROUTES.LOGIN}
              className="btn btn-sm btn-outline mt-2 inline-flex items-center gap-1 text-xs"
            >
              {t('navSignIn')}
            </Link>
          )}
        </div>
      )}

      {/* Form Card */}
      <div className="card p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1.5">
              {t('authFullNameLabel')}
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)] pointer-events-none shrink-0" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isTelugu ? 'రమేష్ కుమార్' : isHindi ? 'रमेश कुमार' : 'Ramesh Kumar'}
                required
                disabled={loading}
                className="input-base input-with-icon-left w-full bg-white text-xs sm:text-sm"
              />
            </div>
          </div>

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

          {/* Mobile */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1.5">
              {t('authPhoneLabel')} ({isTelugu ? 'ఐచ్ఛికం' : isHindi ? 'वैकल्पिक' : 'Optional'})
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)] pointer-events-none shrink-0" />
              <div className="absolute left-10 top-1/2 -translate-y-1/2 flex items-center text-xs font-semibold text-[var(--color-muted-foreground)] pr-2 border-r border-[var(--color-border)] h-5 pointer-events-none">
                +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                disabled={loading}
                className="input-base input-with-phone-prefix w-full bg-white text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* State and District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1.5">
                {t('authStateLabel')}
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)] pointer-events-none shrink-0" />
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={loading}
                  className="input-base input-with-icon-left w-full bg-white text-xs sm:text-sm cursor-pointer"
                >
                  <option value="">{isTelugu ? 'రాష్ట్రాన్ని ఎంచుకోండి' : isHindi ? 'अपना राज्य चुनें' : 'Select your state'}</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1.5">
                {t('authDistrictLabel')} ({isTelugu ? 'ఐచ్ఛికం' : isHindi ? 'वैकल्पिक' : 'Optional'})
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder={isTelugu ? 'ఉదాహరణ: వరంగల్' : isHindi ? 'उदा: वाराणसी / जयपुर' : 'e.g. Warangal'}
                disabled={loading}
                className="input-base px-3.5 w-full bg-white text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1.5">
              {t('authDobLabel')} ({isTelugu ? 'ఐచ్ఛికం' : isHindi ? 'वैकल्पिक' : 'Optional'})
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              disabled={loading}
              className="input-base px-3.5 w-full bg-white text-xs sm:text-sm text-[var(--color-foreground)]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-foreground)] mb-1.5">
              {t('authPasswordLabel')}
            </label>
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

          {/* Terms */}
          <div className="flex items-start gap-2.5 pt-1.5">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={loading}
              className="mt-0.5 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-[var(--color-muted-foreground)] leading-relaxed select-none cursor-pointer">
              {t('authAgreeTerms')}
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full h-11 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 mt-5 shadow-xs cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('authCreatingAccount')}</span>
              </>
            ) : (
              <span>{t('authSignUpBtn')}</span>
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
      </div>

      <p className="text-center text-xs text-[var(--color-muted-foreground)] mt-6">
        {t('authHaveAccount')}{' '}
        <Link to={ROUTES.LOGIN} className="text-[var(--color-secondary)] font-bold hover:underline">
          {t('authSignInBtn')}
        </Link>
      </p>
    </div>
  )
}
