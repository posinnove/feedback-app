import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { IconEye, IconEyeOff, IconArrowLeft, IconBuilding, IconUser, IconCheck, IconX } from '@tabler/icons-react'

// Password strength 
const STRENGTH_LABELS = ['Weak', 'Fair', 'Good', 'Strong'] as const
const STRENGTH_COLORS = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'] as const
const STRENGTH_TEXT = ['text-red-500', 'text-orange-400', 'text-yellow-500', 'text-green-500'] as const

function getPasswordStrength(pw: string): 0 | 1 | 2 | 3 {
    if (pw.length < 8) return 0
    let score = 0
    if (pw.length >= 12) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return Math.min(score, 3) as 0 | 1 | 2 | 3
}
import { useAppSelector } from '../../store/hooks'
import {
    useRegisterUserMutation,
    useRegisterCompanyMutation,
} from '../../store/api/authApi'
import signupBg4 from '../../assets/auth - signup - 1.jpg'

type Tab = 'user' | 'company'

interface UserForm {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber: string
}

interface CompanyForm {
    name: string
    email: string
    password: string
    location: string
    website: string
    description: string
}

export default function RegisterPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

    const defaultTab = (searchParams.get('type') as Tab) ?? 'user'
    const [tab, setTab] = useState<Tab>(defaultTab)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const [userForm, setUserForm] = useState<UserForm>({
        username: '', firstName: '', lastName: '', email: '', password: '', phoneNumber: '',
    })
    const [companyForm, setCompanyForm] = useState<CompanyForm>({
        name: '', email: '', password: '', location: '', website: '', description: '',
    })

    const [registerUser, { isLoading: userLoading }] = useRegisterUserMutation()
    const [registerCompany, { isLoading: companyLoading }] = useRegisterCompanyMutation()
    const isLoading = userLoading || companyLoading

    useEffect(() => {
        if (isAuthenticated) navigate('/', { replace: true })
    }, [isAuthenticated, navigate])

    // Derived strength from whichever form is active
    const currentPassword = tab === 'user' ? userForm.password : companyForm.password
    const strength = useMemo(() => getPasswordStrength(currentPassword), [currentPassword])
    const passwordsMatch = confirmPassword === '' || confirmPassword === currentPassword

    function handleUserChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setUserForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        setError(null)
    }

    function handleCompanyChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setCompanyForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        setError(null)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (confirmPassword !== currentPassword) {
            setError('Passwords do not match.')
            return
        }
        if (strength === 0) {
            setError('Please choose a stronger password.')
            return
        }

        try {
            if (tab === 'user') {
                const payload = { ...userForm }
                if (!payload.phoneNumber) delete (payload as Partial<UserForm>).phoneNumber
                await registerUser(payload).unwrap()
                setSuccess('Account created! Please check your email to verify your account.')
            } else {
                const payload = { ...companyForm }
                if (!payload.location) delete (payload as Partial<CompanyForm>).location
                if (!payload.website) delete (payload as Partial<CompanyForm>).website
                if (!payload.description) delete (payload as Partial<CompanyForm>).description
                await registerCompany(payload).unwrap()
                setSuccess('Business account created! Please check your email to verify your account.')
            }
        } catch (err: unknown) {
            const msg = (err as { data?: { message?: string } })?.data?.message
            setError(msg ?? 'Registration failed. Please try again.')
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left: Image Panel */}
            <div
                className="hidden lg:flex lg:w-1/2 xl:w-[45%] relative overflow-hidden"
                style={{
                    backgroundImage: `url(${signupBg4})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-800/75 to-primary-600/55" />
                <div className="relative z-10 flex flex-col justify-between p-12 text-white">
                    <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg font-black">V</span>
                        VOXELLA
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Start turning feedback<br />into action today.</h2>
                        <div className="space-y-3">
                            {['Track every piece of feedback in one place', 'Engage your community meaningfully', 'Make data-driven decisions faster'].map((text) => (
                                <div key={text} className="flex items-start gap-2.5 text-sm opacity-90">
                                    <IconCheck size={16} className="mt-0.5 shrink-0" />
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Form Panel */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:px-16 py-10 bg-white overflow-y-auto">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm text-base-100 hover:text-base-200 mb-6 transition-colors"
                >
                    <IconArrowLeft size={16} stroke={1.5} />
                    Back to Voxella
                </Link>

                <div className="max-w-md w-full mx-auto">
                    <h1 className="text-2xl font-bold text-base-200 mb-1">Create your account</h1>
                    <p className="text-base-100 text-sm mb-6">
                        Already have an account?{' '}
                        <Link to="/auth/login" className="text-primary-600 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>

                    {/* Tab Toggle */}
                    <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
                        <button
                            onClick={() => { setTab('user'); setError(null); setSuccess(null); setConfirmPassword('') }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'user' ? 'bg-white text-primary-600 shadow-sm' : 'text-base-100 hover:text-base-200'
                                }`}
                        >
                            <IconUser size={16} stroke={1.5} />
                            User
                        </button>
                        <button
                            onClick={() => { setTab('company'); setError(null); setSuccess(null); setConfirmPassword('') }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'company' ? 'bg-white text-primary-600 shadow-sm' : 'text-base-100 hover:text-base-200'
                                }`}
                        >
                            <IconBuilding size={16} stroke={1.5} />
                            Business
                        </button>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-5 px-4 py-3 bg-green-50 border border-green-100 text-green-700 rounded-lg text-sm flex items-start gap-2">
                            <IconCheck size={16} className="mt-0.5 shrink-0" />
                            {success}
                        </div>
                    )}

                    {!success && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {tab === 'user' ? (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-base-200 mb-1.5">First name</label>
                                            <input name="firstName" required value={userForm.firstName} onChange={handleUserChange} className="input" placeholder="John" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-base-200 mb-1.5">Last name</label>
                                            <input name="lastName" required value={userForm.lastName} onChange={handleUserChange} className="input" placeholder="Doe" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-base-200 mb-1.5">Username</label>
                                        <input name="username" required value={userForm.username} onChange={handleUserChange} className="input" placeholder="johndoe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-base-200 mb-1.5">Email</label>
                                        <input name="email" type="email" required value={userForm.email} onChange={handleUserChange} className="input" placeholder="you@example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-base-200 mb-1.5">Phone <span className="text-base-100 font-normal">(optional)</span></label>
                                        <input name="phoneNumber" value={userForm.phoneNumber} onChange={handleUserChange} className="input" placeholder="+1 555 000 0000" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-base-200 mb-1.5">Company name</label>
                                        <input name="name" required value={companyForm.name} onChange={handleCompanyChange} className="input" placeholder="Acme Inc." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-base-200 mb-1.5">Business email</label>
                                        <input name="email" type="email" required value={companyForm.email} onChange={handleCompanyChange} className="input" placeholder="contact@acme.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-base-200 mb-1.5">Location <span className="text-base-100 font-normal">(optional)</span></label>
                                        <input name="location" value={companyForm.location} onChange={handleCompanyChange} className="input" placeholder="Kigali, Rwanda" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-base-200 mb-1.5">Website <span className="text-base-100 font-normal">(optional)</span></label>
                                        <input name="website" type="url" value={companyForm.website} onChange={handleCompanyChange} className="input" placeholder="https://acme.com" />
                                    </div>
                                </>
                            )}

                            {/* Password + confirm + strength */}
                            <div>
                                <label className="block text-sm font-medium text-base-200 mb-1.5">Password</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="new-password"
                                        value={currentPassword}
                                        onChange={tab === 'user' ? handleUserChange : handleCompanyChange}
                                        className="input pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        className="absolute inset-y-0 right-3 flex items-center text-base-100 hover:text-base-200"
                                    >
                                        {showPassword ? <IconEyeOff size={17} stroke={1.5} /> : <IconEye size={17} stroke={1.5} />}
                                    </button>
                                </div>

                                {/* Strength bar — only shown once user starts typing */}
                                {currentPassword.length > 0 && (
                                    <div className="mt-2.5 space-y-1.5">
                                        <div className="flex gap-1">
                                            {[0, 1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength
                                                            ? STRENGTH_COLORS[strength]
                                                            : 'bg-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs font-medium ${STRENGTH_TEXT[strength]}`}>
                                                {STRENGTH_LABELS[strength]}
                                            </span>
                                            <span className="text-xs text-base-100">
                                                {[/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/]
                                                    .filter((r) => !r.test(currentPassword))
                                                    .length === 0
                                                    ? 'All requirements met'
                                                    : 'Add: ' +
                                                    [
                                                        !/[A-Z]/.test(currentPassword) && 'uppercase',
                                                        !/[0-9]/.test(currentPassword) && 'number',
                                                        !/[^A-Za-z0-9]/.test(currentPassword) && 'symbol',
                                                    ]
                                                        .filter(Boolean)
                                                        .join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label className="block text-sm font-medium text-base-200 mb-1.5">Confirm password</label>
                                <div className="relative">
                                    <input
                                        name="confirmPassword"
                                        type={showConfirm ? 'text' : 'password'}
                                        required
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`input pr-10 ${confirmPassword.length > 0 && !passwordsMatch
                                                ? 'border-red-400 focus:ring-red-400'
                                                : confirmPassword.length > 0 && passwordsMatch
                                                    ? 'border-green-400 focus:ring-green-400'
                                                    : ''
                                            }`}
                                        placeholder="••••••••"
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
                                        {confirmPassword.length > 0 && (
                                            passwordsMatch
                                                ? <IconCheck size={15} className="text-green-500" />
                                                : <IconX size={15} className="text-red-400" />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm((p) => !p)}
                                            className="text-base-100 hover:text-base-200"
                                        >
                                            {showConfirm ? <IconEyeOff size={17} stroke={1.5} /> : <IconEye size={17} stroke={1.5} />}
                                        </button>
                                    </div>
                                </div>
                                {confirmPassword.length > 0 && !passwordsMatch && (
                                    <p className="mt-1 text-xs text-red-500">Passwords don't match</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm
                                           hover:bg-primary-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                            >
                                {isLoading ? 'Creating account…' : `Create ${tab === 'company' ? 'Business' : ''} Account`}
                            </button>

                            <p className="text-center text-xs text-base-100 pt-1">
                                By signing up you agree to our{' '}
                                <span className="text-primary-600 cursor-pointer hover:underline">Terms</span> and{' '}
                                <span className="text-primary-600 cursor-pointer hover:underline">Privacy Policy</span>.
                            </p>
                        </form>
                    )}

                    {success && (
                        <div className="text-center pt-4">
                            <Link
                                to="/auth/login"
                                className="inline-block px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors"
                            >
                                Go to login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
