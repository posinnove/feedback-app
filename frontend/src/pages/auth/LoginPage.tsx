import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { IconEye, IconEyeOff, IconArrowLeft, IconBuilding, IconUser } from '@tabler/icons-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCredentials } from '../../store/slices/authSlice'
import {
    useLoginUserMutation,
    useLoginCompanyMutation,
    extractEntityFromResponse,
} from '../../store/api/authApi'
import signupBg from '../../assets/auth - signup - 1.jpg'

type Tab = 'user' | 'company'

export default function LoginPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

    const defaultTab = (searchParams.get('type') as Tab) ?? 'user'
    const [tab, setTab] = useState<Tab>(defaultTab)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState({ email: '', password: '' })

    const [loginUser, { isLoading: userLoading }] = useLoginUserMutation()
    const [loginCompany, { isLoading: companyLoading }] = useLoginCompanyMutation()
    const isLoading = userLoading || companyLoading

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) navigate('/', { replace: true })
    }, [isAuthenticated, navigate])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        setError(null)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        try {
            let response
            if (tab === 'user') {
                response = await loginUser(form).unwrap()
            } else {
                response = await loginCompany(form).unwrap()
            }

            const entity = extractEntityFromResponse(response, tab)
            dispatch(
                setCredentials({
                    entity,
                    type: tab,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                }),
            )
            navigate('/', { replace: true })
        } catch (err: unknown) {
            const msg = (err as { data?: { message?: string } })?.data?.message
            setError(msg ?? 'Login failed. Please try again.')
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left: Image Panel */}
            <div
                className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden"
                style={{
                    backgroundImage: `url(${signupBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-800/80 to-primary-600/60" />
                <div className="relative z-10 flex flex-col justify-between p-12 text-white">
                    <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg font-black">V</span>
                        VOXELLA
                    </Link>
                    <div>
                        <blockquote className="text-xl font-light leading-relaxed mb-6 opacity-90">
                            "The best feedback is the kind that helps you grow — and Voxella makes sure it reaches the right ears."
                        </blockquote>
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className={`h-1 rounded-full ${i === 0 ? 'w-8 bg-white' : 'w-3 bg-white/40'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Form Panel */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-12 bg-white">
                {/* Back to home */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm text-base-100 hover:text-base-200 mb-8 transition-colors"
                >
                    <IconArrowLeft size={16} stroke={1.5} />
                    Back to Voxella
                </Link>

                <div className="max-w-md w-full mx-auto">
                    <h1 className="text-2xl font-bold text-base-200 mb-1">Welcome back</h1>
                    <p className="text-base-100 text-sm mb-8">
                        Don't have an account?{' '}
                        <Link to="/auth/register" className="text-primary-600 font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>

                    {/* Tab Toggle */}
                    <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8">
                        <button
                            onClick={() => setTab('user')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'user'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-base-100 hover:text-base-200'
                                }`}
                        >
                            <IconUser size={16} stroke={1.5} />
                            User
                        </button>
                        <button
                            onClick={() => setTab('company')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'company'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-base-100 hover:text-base-200'
                                }`}
                        >
                            <IconBuilding size={16} stroke={1.5} />
                            Business
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-base-200 mb-1.5">
                                {tab === 'company' ? 'Business email' : 'Email'}
                            </label>
                            <input
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder={tab === 'company' ? 'contact@yourcompany.com' : 'you@example.com'}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-base-200 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="input pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute inset-y-0 right-3 flex items-center text-base-100 hover:text-base-200"
                                >
                                    {showPassword ? <IconEyeOff size={17} stroke={1.5} /> : <IconEye size={17} stroke={1.5} />}
                                </button>
                            </div>
                            <div className="mt-2 text-right">
                                <Link
                                    to={`/auth/forgot-password?type=${tab}`}
                                    className="text-xs text-primary-600 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm
                                       hover:bg-primary-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in…' : `Sign in as ${tab === 'company' ? 'Business' : 'User'}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
