import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { IconEye, IconEyeOff, IconCheck, IconX } from '@tabler/icons-react'
import { useRegisterCompanyMutation } from '../../store/api/companyAuthApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { companyRegisterSchema, type CompanyRegisterInput } from '../../schemas/auth.schema'
import PasswordStrengthBar from './PasswordStrengthBar'
import LocationAutocompleteInput from './LocationAutocompleteInput'

// Types moved to schemas/auth.schema.ts

interface Props {
    onSuccess: (message: string) => void
    onApiError: (message: string) => void
}

export default function CompanyRegisterForm({ onSuccess, onApiError }: Props) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const [registerCompany, { isLoading }] = useRegisterCompanyMutation()

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CompanyRegisterInput>({
        resolver: zodResolver(companyRegisterSchema),
        defaultValues: {
            name: '', email: '', password: '', confirmPassword: '',
            location: '', website: '', description: '',
        },
    })

    const password = watch('password', '')
    const confirmPassword = watch('confirmPassword', '')
    const busy = isSubmitting || isLoading

    async function onSubmit(values: CompanyRegisterInput) {
        onApiError('')
        try {
            const { confirmPassword: _, ...rest } = values
            // filter out empty strings for optional fields
            const payload = Object.fromEntries(
                Object.entries(rest).filter(([, v]) => v !== '' && v !== undefined)
            ) as Omit<CompanyRegisterInput, 'confirmPassword'>
            await registerCompany(payload).unwrap()
            onSuccess('Business account created! Please check your email to verify your account.')
        } catch (err: unknown) {
            const msg = (err as { data?: { message?: string } })?.data?.message
            onApiError(msg ?? 'Registration failed. Please try again.')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Company name */}
            <div>
                <label className="block text-sm font-medium text-base-200 mb-1.5">Company name</label>
                <input
                    placeholder="Acme Inc."
                    className={`input ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                    {...register('name')}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Business email */}
            <div>
                <label className="block text-sm font-medium text-base-200 mb-1.5">Business email</label>
                <input
                    type="email"
                    placeholder="contact@acme.com"
                    className={`input ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                    {...register('email')}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Location — Google Places autocomplete */}
            <div>
                <label className="block text-sm font-medium text-base-200 mb-1.5">
                    Location <span className="text-base-100 font-normal">(optional)</span>
                </label>
                <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                        <LocationAutocompleteInput
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder="Kigali, Rwanda"
                            className="input"
                        />
                    )}
                />
            </div>

            {/* Website */}
            <div>
                <label className="block text-sm font-medium text-base-200 mb-1.5">
                    Website <span className="text-base-100 font-normal">(optional)</span>
                </label>
                <input
                    type="url"
                    placeholder="https://acme.com"
                    className={`input ${errors.website ? 'border-red-400 focus:ring-red-400' : ''}`}
                    {...register('website')}
                />
                {errors.website && <p className="mt-1 text-xs text-red-500">{errors.website.message}</p>}
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
                        {...register('password')}
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
                        {...register('confirmPassword')}
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
                {busy ? 'Creating account…' : 'Create Business Account'}
            </button>

            <p className="text-center text-xs text-base-100 pt-1">
                By signing up you agree to our{' '}
                <span className="text-primary-600 cursor-pointer hover:underline">Terms</span> and{' '}
                <span className="text-primary-600 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
        </form>
    )
}
