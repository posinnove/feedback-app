import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { IconEye, IconEyeOff, IconCheck, IconX } from '@tabler/icons-react'
import { useRegisterCompanyMutation } from '../../store/api/companyAuthApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { companyRegisterSchema, type CompanyRegisterInput } from '../../schemas/auth.schema'
import PasswordStrengthBar from './PasswordStrengthBar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

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
    control,
    formState: { errors, isSubmitting },
  } = useForm<CompanyRegisterInput>({
    resolver: zodResolver(companyRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = useWatch({ control, name: 'password', defaultValue: '' })
  const confirmPassword = useWatch({ control, name: 'confirmPassword', defaultValue: '' })
  const busy = isSubmitting || isLoading

  async function onSubmit(values: CompanyRegisterInput) {
    onApiError('')
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
      }
      await registerCompany(payload).unwrap()
      onSuccess('Company account created! Please check your email to verify your account.')
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
        <Input
          placeholder="Acme Inc."
          className={errors.name ? 'border-red-400 focus-visible:ring-red-400' : ''}
          {...register('name')}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

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
        <label className="block text-sm font-medium text-base-200 mb-1.5">Confirm password</label>
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

      <Button type="submit" disabled={busy} className="mt-2 w-full">
        {busy ? 'Creating account…' : 'Create Company Account'}
      </Button>

      {/* <p className="text-center text-xs text-base-100 pt-1">
        By signing up you agree to our{' '}
        <span className="text-primary-600 cursor-pointer hover:underline">Terms</span> and{' '}
        <span className="text-primary-600 cursor-pointer hover:underline">Privacy Policy</span>.
      </p> */}
    </form>
  )
}
