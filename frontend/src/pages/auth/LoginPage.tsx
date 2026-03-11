import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { IconEye, IconEyeOff, IconArrowLeft } from '@tabler/icons-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCredentials } from '../../store/slices/authSlice'
import {
    useLoginMutation,
    extractEntityFromUnifiedResponse,
} from '../../store/api/authApi'
import AuthImagePanel from '../../components/auth/AuthImagePanel'
import signupBg from '../../assets/auth - signup - 1.jpg'

interface LoginFormValues {
    email: string
    password: string
}

export default function LoginPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

    const [showPassword, setShowPassword] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({ defaultValues: { email: '', password: '' } })

    const [login, { isLoading }] = useLoginMutation()
    const isBusy = isSubmitting || isLoading

    useEffect(() => {
        if (isAuthenticated) navigate('/', { replace: true })
    }, [isAuthenticated, navigate])

    async function onSubmit(values: LoginFormValues) {
        setApiError(null)
        try {
            const response = await login(values).unwrap()
            const entity = extractEntityFromUnifiedResponse(response)
            dispatch(
                setCredentials({
                    entity,
                    type: response.type,
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
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
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
                                    to="/auth/forgot-password"
                                    className="text-xs text-primary-600 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isBusy}
                            className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm
                                       hover:bg-primary-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isBusy ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
