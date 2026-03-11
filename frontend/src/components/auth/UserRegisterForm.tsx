import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IconEye, IconEyeOff, IconCheck, IconX } from '@tabler/icons-react'
import { useRegisterUserMutation } from '../../store/api/authApi'
import { getPasswordStrength } from '../../utils/passwordStrength'
import PasswordStrengthBar from './PasswordStrengthBar'

interface UserFormValues {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    phoneNumber?: string
}

interface Props {
    onSuccess: (message: string) => void
    onApiError: (message: string) => void
}

export default function UserRegisterForm({ onSuccess, onApiError }: Props) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const [registerUser, { isLoading }] = useRegisterUserMutation()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<UserFormValues>({
        defaultValues: {
            username: '', firstName: '', lastName: '',
            email: '', password: '', confirmPassword: '', phoneNumber: '',
        },
    })

    const password = watch('password', '')
    const confirmPassword = watch('confirmPassword', '')
    const busy = isSubmitting || isLoading

    async function onSubmit(values: UserFormValues) {
        onApiError('')
        try {
            const { confirmPassword: _, phoneNumber, ...rest } = values
            const payload = phoneNumber ? { ...rest, phoneNumber } : rest
            await registerUser(payload).unwrap()
            onSuccess('Account created! Please check your email to verify your account.')
        } catch (err: unknown) {
            const msg = (err as { data?: { message?: string } })?.data?.message
            onApiError(msg ?? 'Registration failed. Please try again.')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* First / Last name */}
            <div className="grid grid-cols-2 gap-3">
                {(
                    [
                        { name: 'firstName', label: 'First name', placeholder: 'John' },
                        { name: 'lastName', label: 'Last name', placeholder: 'Doe' },
                    ] as const
                ).map(({ name, label, placeholder }) => (
                    <div key={name}>
                        <label className="block text-sm font-medium text-base-200 mb-1.5">{label}</label>
                        <input
                            placeholder={placeholder}
                            className={`input ${errors[name] ? 'border-red-400 focus:ring-red-400' : ''}`}
                            {...register(name, { required: 'Required' })}
                        />
                        {errors[name] && (
                            <p className="mt-1 text-xs text-red-500">{errors[name]?.message}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Username */}
            <div>
                <label className="block text-sm font-medium text-base-200 mb-1.5">Username</label>
                <input
                    placeholder="johndoe"
                    className={`input ${errors.username ? 'border-red-400 focus:ring-red-400' : ''}`}
                    {...register('username', {
                        required: 'Username is required',
                        validate: (v) => v.trim().length > 0 || 'Username cannot be blank or whitespace',
                        pattern: { value: /^\S+$/, message: 'Username cannot contain spaces or tabs' },
                    })}
                />
                {errors.username && (
                    <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-base-200 mb-1.5">Email</label>
                <input
                    type="email"
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

            {/* Phone (optional) */}
            <div>
                <label className="block text-sm font-medium text-base-200 mb-1.5">
                    Phone <span className="text-base-100 font-normal">(optional)</span>
                </label>
                <input
                    placeholder="+1 555 000 0000"
                    className="input"
                    {...register('phoneNumber')}
                />
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-base-200 mb-1.5">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="input pr-10"
                        {...register('password', {
                            required: 'Password is required',
                            validate: (v) => getPasswordStrength(v) > 0 || 'Please choose a stronger password',
                        })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute inset-y-0 right-3 flex items-center text-base-100 hover:text-base-200"
                    >
                        {showPassword ? <IconEyeOff size={17} stroke={1.5} /> : <IconEye size={17} stroke={1.5} />}
                    </button>
                </div>
                <PasswordStrengthBar password={password} errorMessage={errors.password?.message} />
            </div>

            {/* Confirm password */}
            <div>
                <label className="block text-sm font-medium text-base-200 mb-1.5">Confirm password</label>
                <div className="relative">
                    <input
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className={`input pr-10 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (v) => v === password || "Passwords don't match",
                        })}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
                        {confirmPassword && (
                            errors.confirmPassword
                                ? <IconX size={15} className="text-red-400" />
                                : <IconCheck size={15} className="text-green-500" />
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
                {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm
                           hover:bg-primary-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
                {busy ? 'Creating account…' : 'Create Account'}
            </button>

            <p className="text-center text-xs text-base-100 pt-1">
                By signing up you agree to our{' '}
                <span className="text-primary-600 cursor-pointer hover:underline">Terms</span> and{' '}
                <span className="text-primary-600 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
        </form>
    )
}
