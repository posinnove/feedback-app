import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { IconEye, IconEyeOff, IconArrowLeft, IconBuilding, IconUser } from '@tabler/icons-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCredentials } from '../../store/slices/authSlice'
import {
    useLoginUserMutation,
    useLoginCompanyMutation,
    extractEntityFromResponse,
} from '../../store/api/authApi'
import AuthImagePanel from '../../components/auth/AuthImagePanel'
import signupBg from '../../assets/auth - signup - 1.jpg'

type Tab = 'user' | 'company'

interface LoginFormValues {
    email: string
    password: string
}

export default function LoginPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

    const defaultTab = (searchParams.get('type') as Tab) ?? 'user'
    const [tab, setTab] = useState<Tab>(defaultTab)
    const [showPassword, setShowPassword] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({ defaultValues: { email: '', password: '' } })

    const [loginUser, { isLoading: userLoading }] = useLoginUserMutation()
    const [loginCompany, { isLoading: companyLoading }] = useLoginCompanyMutation()
    const isLoading = isSubmitting || userLoading || companyLoading

    useEffect(() => {
        if (isAuthenticated) navigate('/', { replace: true })
    }, [isAuthenticated, navigate])

    function handleTabChange(next: Tab) {
        setTab(next)
        setApiError(null)
        reset()
    }

    async function onSubmit(values: LoginFormValues) {
        setApiError(null)
        try {
            const response =
                tab === 'user'
                    ? await loginUser(values).unwrap()
                    : await loginCompany(values).unwrap()

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
            setApiError(msg ?? 'Login failed. Please try again.')
        }
    }

    const panelContent = (
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
    )

    return (
        <div className="min-h-screen flex">
            <AuthImagePanel backgroundImage={signupBg} overlayClassName="bg-gradient-to-br from-primary-800/80 to-primary-600/60">
                {panelContent}
            </AuthImagePanel>

            {/* Right: Form Panel */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-12 bg-white">
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
                        {(['user', 'company'] as Tab[]).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => handleTabChange(t)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-base-100 hover:text-base-200'
                                    }`}
                            >
                                {t === 'user' ? <IconUser size={16} stroke={1.5} /> : <IconBuilding size={16} stroke={1.5} />}
                                {t === 'user' ? 'User' : 'Business'}
                            </button>
                        ))}
                    </div>

                    {/* API Error */}
                    {apiError && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-base-200 mb-1.5">
                                {tab === 'company' ? 'Business email' : 'Email'}
                            </label>
                            <input
                                type="email"
                                autoComplete="email"
                                placeholder={tab === 'company' ? 'contact@yourcompany.com' : 'you@example.com'}
                                className={`input ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                                })}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-base-200 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className={`input pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                                    {...register('password', { required: 'Password is required' })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute inset-y-0 right-3 flex items-center text-base-100 hover:text-base-200"
                                >
                                    {showPassword ? <IconEyeOff size={17} stroke={1.5} /> : <IconEye size={17} stroke={1.5} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                            )}
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
