import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { IconEye, IconEyeOff, IconCheck, IconX } from '@tabler/icons-react'
import {
  useRegisterCompanyMutation,
  useUpdateMeCompanyProfileMutation,
} from '../../store/api/companyAuthApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { companyRegisterSchema } from '../../schemas/auth.schema'
import PasswordStrengthBar from './PasswordStrengthBar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface Props {
  onSuccess: (message: string) => void
  onApiError: (message: string) => void
  isGoogleAuth?: boolean
}

type CompanyRegisterFormValues = {
  name: string
  description: string
  email?: string
  password?: string
  confirmPassword?: string
}

const companyGoogleCompleteSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters'),
  email: z.string().optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
})

export default function CompanyRegisterForm({ onSuccess, onApiError, isGoogleAuth }: Props) {
  const [step, setStep] = useState<1 | 2>(isGoogleAuth ? 2 : 1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [registerCompany, { isLoading }] = useRegisterCompanyMutation()
  const [updateProfile, { isLoading: isUpdateLoading }] = useUpdateMeCompanyProfileMutation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<CompanyRegisterFormValues>({
    resolver: zodResolver(isGoogleAuth ? companyGoogleCompleteSchema : companyRegisterSchema),
    defaultValues: {
      name: '',
      description: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = useWatch({ control, name: 'password', defaultValue: '' }) ?? ''
  const confirmPassword = useWatch({ control, name: 'confirmPassword', defaultValue: '' })
  const busy = isSubmitting || isLoading || isUpdateLoading

  async function handleNext() {
    const isValid = await trigger(['email', 'password', 'confirmPassword'])
    if (isValid) {
      setStep(2)
      onApiError('')
    }
  }

  async function onSubmit(values: CompanyRegisterFormValues) {
    onApiError('')
    try {
      if (isGoogleAuth) {
        // For Google auth, just update the profile
        await updateProfile({
          name: values.name,
          description: values.description,
        }).unwrap()
        onSuccess('Company profile completed successfully!')
      } else {
        // For email/password auth, register the company
        if (!values.email || !values.password) {
          onApiError('Please enter email and password')
          return
        }
        const payload = {
          name: values.name,
          description: values.description,
          email: values.email,
          password: values.password,
        }
        await registerCompany(payload).unwrap()
        onSuccess('Company account created! Please check your email to verify your account.')
      }
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      onApiError(msg ?? 'Registration failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Step 1: Email & Password */}
      {!isGoogleAuth && step === 1 && (
        <>
          {/* Business email */}
          <div>
            <label className="block text-sm font-medium text-base-200 mb-1.5">Business email</label>
            <Input
              type="email"
              placeholder="contact@acme.com"
              className={errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-base-200 mb-1.5">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                className="pr-10"
                {...register('password')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute inset-y-0 right-3 h-auto w-auto px-0 py-0 text-base-100 hover:bg-transparent hover:text-base-200"
              >
                {showPassword ? (
                  <IconEyeOff size={17} stroke={1.5} />
                ) : (
                  <IconEye size={17} stroke={1.5} />
                )}
              </Button>
            </div>
            <PasswordStrengthBar password={password} errorMessage={errors.password?.message} />
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-base-200 mb-1.5">
              Confirm password
            </label>
            <div className="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                className={`pr-10 ${errors.confirmPassword ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                {...register('confirmPassword')}
              />
              <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
                {confirmPassword &&
                  (errors.confirmPassword ? (
                    <IconX size={15} className="text-red-400" />
                  ) : (
                    <IconCheck size={15} className="text-green-500" />
                  ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="h-auto w-auto px-0 py-0 text-base-100 hover:bg-transparent hover:text-base-200"
                >
                  {showConfirm ? (
                    <IconEyeOff size={17} stroke={1.5} />
                  ) : (
                    <IconEye size={17} stroke={1.5} />
                  )}
                </Button>
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="button" onClick={handleNext} disabled={busy} className="mt-2 w-full">
            Next
          </Button>
        </>
      )}

      {/* Step 2: Company Details */}
      {step === 2 && (
        <>
          {/* Company name */}
          <div>
            <label className="block text-sm font-medium text-base-200 mb-1.5">Company name</label>
            <Input
              placeholder="Acme Inc."
              className={errors.name ? 'border-red-400 focus-visible:ring-red-400' : ''}
              {...register('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Company description */}
          <div>
            <label className="block text-sm font-medium text-base-200 mb-1.5">
              Company description
            </label>
            <textarea
              placeholder="Tell us about your company..."
              rows={4}
              className={`w-full rounded-lg border border-border bg-sidebar-bg px-3 py-2 text-sm text-base-300 placeholder:text-base-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40 focus-visible:ring-offset-0 ${errors.description ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            {!isGoogleAuth && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(1)}
                disabled={busy}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button type="submit" disabled={busy} className={isGoogleAuth ? 'w-full' : 'flex-1'}>
              {busy
                ? isGoogleAuth
                  ? 'Completing profile…'
                  : 'Creating account…'
                : isGoogleAuth
                  ? 'Complete Profile'
                  : 'Create Company Account'}
            </Button>
          </div>
        </>
      )}
    </form>
  )
}
