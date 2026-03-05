import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { IconArrowLeft, IconCheck } from '@tabler/icons-react'
import {
    useForgotPasswordUserMutation,
    useForgotPasswordCompanyMutation,
} from '../../store/api/authApi'
// import forgotBg from '../../assets/auth - forget password - 4.jpg'
import forgotBg from '../../assets/auth - signup - 4.jpg'
export default function ForgotPasswordPage() {
    const [searchParams] = useSearchParams()
    const type = searchParams.get('type') === 'company' ? 'company' : 'user'
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [forgotUser, { isLoading: userLoading }] = useForgotPasswordUserMutation()
    const [forgotCompany, { isLoading: companyLoading }] = useForgotPasswordCompanyMutation()
    const isLoading = userLoading || companyLoading

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        try {
            if (type === 'user') await forgotUser({ email }).unwrap()
            else await forgotCompany({ email }).unwrap()
            setSubmitted(true)
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
                        <h2 className="text-3xl font-bold mb-3">Forgot your password?</h2>
                        <p className="opacity-80 text-sm leading-relaxed">
                            No worries — it happens to the best of us. Enter your email and we'll send you a reset link right away.
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
                    <h1 className="text-2xl font-bold text-base-200 mb-2">Reset your password</h1>
                    <p className="text-base-100 text-sm mb-8">
                        Enter your registered email and we'll send you a link to reset your password.
                    </p>

                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">{error}</div>
                    )}

                    {submitted ? (
                        <div className="px-4 py-5 bg-green-50 border border-green-100 rounded-xl text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <IconCheck size={22} className="text-green-600" />
                            </div>
                            <p className="font-medium text-green-700">Check your inbox!</p>
                            <p className="text-green-600 text-sm mt-1">
                                If <strong>{email}</strong> is registered, you'll receive a reset link shortly.
                            </p>
                            <Link to={`/auth/login?type=${type}`} className="mt-4 inline-block text-sm text-primary-600 hover:underline font-medium">
                                Back to login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-base-200 mb-1.5">Email address</label>
                                <input
                                    type="email" required autoComplete="email"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com" className="input"
                                />
                            </div>
                            <button
                                type="submit" disabled={isLoading}
                                className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Sending…' : 'Send reset link'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
