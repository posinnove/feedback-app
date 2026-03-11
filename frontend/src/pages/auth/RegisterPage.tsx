import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { IconArrowLeft, IconBuilding, IconUser, IconCheck } from '@tabler/icons-react'
import { useAppSelector } from '../../store/hooks'
import AuthImagePanel from '../../components/auth/AuthImagePanel'
import UserRegisterForm from '../../components/auth/UserRegisterForm'
import CompanyRegisterForm from '../../components/auth/CompanyRegisterForm'
import signupBg from '../../assets/auth - signup - 1.jpg'

type Tab = 'user' | 'company'

const PANEL_CONTENT = (
    <>
        <h2 className="text-3xl font-bold mb-4">Start turning feedback<br />into action today.</h2>
        <div className="space-y-3">
            {[
                'Track every piece of feedback in one place',
                'Engage your community meaningfully',
                'Make data-driven decisions faster',
            ].map((text) => (
                <div key={text} className="flex items-start gap-2.5 text-sm opacity-90">
                    <IconCheck size={16} className="mt-0.5 shrink-0" />
                    {text}
                </div>
            ))}
        </div>
    </>
)

export default function RegisterPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

    const defaultTab = (searchParams.get('type') as Tab) ?? 'user'
    const [tab, setTab] = useState<Tab>(defaultTab)
    const [apiError, setApiError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        if (isAuthenticated) navigate('/', { replace: true })
    }, [isAuthenticated, navigate])

    function handleTabChange(next: Tab) {
        setTab(next)
        setApiError(null)
        setSuccess(null)
    }

    function handleApiError(msg: string) {
        setApiError(msg || null)
    }

    return (
        <div className="min-h-screen flex">
            <AuthImagePanel
                backgroundImage={signupBg}
                overlayClassName="bg-gradient-to-br from-primary-800/75 to-primary-600/55"
            >
                {PANEL_CONTENT}
            </AuthImagePanel>

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

                    {/* Success banner */}
                    {success && (
                        <div className="mb-5 px-4 py-3 bg-green-50 border border-green-100 text-green-700 rounded-lg text-sm flex items-start gap-2">
                            <IconCheck size={16} className="mt-0.5 shrink-0" />
                            {success}
                        </div>
                    )}

                    {/* Forms */}
                    {!success && tab === 'user' && (
                        <UserRegisterForm onSuccess={setSuccess} onApiError={handleApiError} />
                    )}
                    {!success && tab === 'company' && (
                        <CompanyRegisterForm onSuccess={setSuccess} onApiError={handleApiError} />
                    )}

                    {/* Post-success CTA */}
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
