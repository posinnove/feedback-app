import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { IconArrowLeft, IconCheck, IconAlertCircle, IconEye, IconEyeOff } from '@tabler/icons-react'
import {
    useResetPasswordUserMutation,
    useResetPasswordCompanyMutation,
} from '../../store/api/authApi'
import forgotBg from '../../assets/auth - signup - 4.jpg'

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') ?? ''
    const type = searchParams.get('type') === 'company' ? 'company' : 'user'

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [resetUser, { isLoading: userLoading }] = useResetPasswordUserMutation()
    const [resetCompany, { isLoading: companyLoading }] = useResetPasswordCompanyMutation()
    const isLoading = userLoading || companyLoading

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (!token) {
            setError('No reset token found. Please request a new password reset link.')
            return
        }
        if (password !== confirm) {
            setError('Passwords do not match.')
            return
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.')
            return
        }

        try {
            if (type === 'user') await resetUser({ token, password }).unwrap()
            else await resetCompany({ token, password }).unwrap()
            setSuccess(true)
        } catch (err: unknown) {
            const msg = (err as { data?: { message?: string } })?.data?.message
            setError(msg ?? 'Something went wrong. Please try again.')
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left image */}
            <div
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
                style={{ backgroundImage: `url(${forgotBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-800/80 to-primary-600/60" />
                <div className="relative z-10 flex flex-col justify-between p-12 text-white">
                    <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg font-black">V</span>
                        VOXELLA
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold mb-3">Create a new password</h2>
                        <p className="opacity-80 text-sm leading-relaxed">
                            Choose a strong password to keep your account secure.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right form */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-12 bg-white">
                <Link to={`/auth/login?type=${type}`} className="inline-flex items-center gap-1.5 text-sm text-base-100 hover:text-base-200 mb-8 transition-colors">
                    <IconArrowLeft size={16} stroke={1.5} />
                    Back to login
                </Link>

                <div className="max-w-md w-full mx-auto">
                    <h1 className="text-2xl font-bold text-base-200 mb-2">Set new password</h1>
                    <p className="text-base-100 text-sm mb-8">
                        Enter your new password below.
                    </p>

                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-sm text-red-700">
                            <IconAlertCircle size={16} className="mt-0.5 shrink-0" />
                            {error}
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
                                to={`/auth/login?type=${type}`}
                                className="mt-4 inline-block px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors"
                            >
                                Sign in
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* New password */}
                            <div>
                                <label className="block text-sm font-medium text-base-200 mb-1.5">New password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 8 characters"
                                        className="input pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base-100 hover:text-base-200 transition-colors"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label className="block text-sm font-medium text-base-200 mb-1.5">Confirm password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="new-password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    placeholder="Repeat your password"
                                    className="input"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !token}
                                className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Resetting…' : 'Reset password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
