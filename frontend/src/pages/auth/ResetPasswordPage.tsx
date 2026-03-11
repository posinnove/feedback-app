import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { IconArrowLeft, IconCheck, IconAlertCircle, IconEye, IconEyeOff } from '@tabler/icons-react'
import { useResetPasswordMutation } from '../../store/api/authApi'
import AuthImagePanel from '../../components/auth/AuthImagePanel'
import forgotBg from '../../assets/auth - signup - 4.jpg'

interface ResetFormValues {
    password: string
    confirm: string
}

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') ?? ''

    const [showPassword, setShowPassword] = useState(false)
    const [success, setSuccess] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ResetFormValues>({ defaultValues: { password: '', confirm: '' } })

    const [resetPassword, { isLoading }] = useResetPasswordMutation()
    const isBusy = isSubmitting || isLoading
    const watchedPassword = watch('password')

    async function onSubmit(values: ResetFormValues) {
        setApiError(null)
        if (!token) {
            setApiError('No reset token found. Please request a new password reset link.')
            return
        }
        try {
            await resetPassword({ token, password: values.password }).unwrap()
            setSuccess(true)
        } catch (err: unknown) {
            const msg = (err as { data?: { message?: string } })?.data?.message
            setApiError(msg ?? 'Something went wrong. Please try again.')
        }
    }

    return (
        <div className="min-h-screen flex">
            <AuthImagePanel backgroundImage={forgotBg}>
                <div>
                    <h2 className="text-3xl font-bold mb-3">Create a new password</h2>
                    <p className="opacity-80 text-sm leading-relaxed">
                        Choose a strong password to keep your account secure.
                    </p>
                </div>
            </AuthImagePanel>

            {/* Right form */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-12 bg-white">
                <Link
                    to="/auth/login"
                    className="inline-flex items-center gap-1.5 text-sm text-base-100 hover:text-base-200 mb-8 transition-colors"
                >
                    <IconArrowLeft size={16} stroke={1.5} />
                    Back to login
                </Link>

                <div className="max-w-md w-full mx-auto">
                    <h1 className="text-2xl font-bold text-base-200 mb-2">Set new password</h1>
                    <p className="text-base-100 text-sm mb-8">Enter your new password below.</p>

                    {apiError && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-sm text-red-700">
                            <IconAlertCircle size={16} className="mt-0.5 shrink-0" />
                            {apiError}
                        </div>
                    )}

                    {!token && !success && (
                        <div className="mb-5 px-4 py-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-700">
                            No reset token found in the URL. Please use the link from your email.
                        </div>
                    )}

                    {success ? (
                        <div className="px-4 py-5 bg-green-50 border border-green-100 rounded-xl text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <IconCheck size={22} className="text-green-600" />
                            </div>
                            <p className="font-medium text-green-700">Password reset successfully!</p>
                            <p className="text-green-600 text-sm mt-1">You can now log in with your new password.</p>
                            <Link
                                to="/auth/login"
                                className="mt-4 inline-block px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors"
                            >
                                Sign in
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                            {/* New password */}
                            <div>
                                <label className="block text-sm font-medium text-base-200 mb-1.5">New password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder="Min. 8 characters"
                                        className={`input pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: { value: 8, message: 'Must be at least 8 characters' },
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base-100 hover:text-base-200 transition-colors"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label className="block text-sm font-medium text-base-200 mb-1.5">Confirm password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Repeat your password"
                                    className={`input ${errors.confirm ? 'border-red-400 focus:ring-red-400' : ''}`}
                                    {...register('confirm', {
                                        required: 'Please confirm your password',
                                        validate: (val) =>
                                            val === watchedPassword || "Passwords don't match",
                                    })}
                                />
                                {errors.confirm && (
                                    <p className="mt-1 text-xs text-red-500">{errors.confirm.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isBusy || !token}
                                className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isBusy ? 'Resetting…' : 'Reset password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
