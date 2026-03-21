import { Navigate } from 'react-router-dom'
import { useEffect, useState, type FormEvent } from 'react'
import { IconLock, IconMoon, IconSettings, IconSun } from '@tabler/icons-react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setCredentials } from '../store/slices/authSlice'
import {
  useUpdateMeUserPasswordMutation,
  useUpdateMeUserSettingsMutation,
} from '../store/api/userAuthApi'
import {
  useUpdateMeCompanyPasswordMutation,
  useUpdateMeCompanySettingsMutation,
} from '../store/api/companyAuthApi'

interface AppSettings {
  emailNotifications: boolean
  publicProfile: boolean
  weeklyDigest: boolean
  themeMode: ThemeMode
}

type ThemeMode = 'system' | 'light' | 'dark'

function applyThemeMode(mode: ThemeMode) {
  const root = document.documentElement
  const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (mode === 'system') {
    root.removeAttribute('data-theme')
    root.style.colorScheme = isSystemDark ? 'dark' : 'light'
    return
  }

  root.setAttribute('data-theme', mode)
  root.style.colorScheme = mode
}

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, entity, type, accessToken } = useAppSelector((s) => s.auth)
  const [updateMeUserSettings, { isLoading: isSavingUser }] = useUpdateMeUserSettingsMutation()
  const [updateMeUserPassword, { isLoading: isUpdatingUserPassword }] =
    useUpdateMeUserPasswordMutation()
  const [updateMeCompanySettings, { isLoading: isSavingCompany }] =
    useUpdateMeCompanySettingsMutation()
  const [updateMeCompanyPassword, { isLoading: isUpdatingCompanyPassword }] =
    useUpdateMeCompanyPasswordMutation()

  const [settings, setSettings] = useState<AppSettings>({
    emailNotifications: entity?.emailNotifications ?? true,
    weeklyDigest: entity?.weeklyDigest ?? true,
    publicProfile: entity?.publicProfile ?? true,
    themeMode: entity?.themeMode ?? 'system',
  })
  const [error, setError] = useState<string | null>(null)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => entity?.themeMode ?? 'system')
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  const isSaving = isSavingUser || isSavingCompany
  const isUpdatingPassword = isUpdatingUserPassword || isUpdatingCompanyPassword

  async function updateSettings(next: AppSettings) {
    setError(null)
    const previous = settings
    setSettings(next)

    try {
      const updatedEntity =
        currentType === 'company'
          ? await updateMeCompanySettings(next).unwrap()
          : await updateMeUserSettings(next).unwrap()

      dispatch(
        setCredentials({
          entity: updatedEntity,
          type: currentType,
          accessToken: currentAccessToken,
        })
      )
    } catch (err) {
      setSettings(previous)
      const message =
        typeof err === 'object' &&
        err !== null &&
        'data' in err &&
        typeof (err as { data?: { message?: unknown } }).data?.message === 'string'
          ? (err as { data: { message: string } }).data.message
          : 'Failed to save settings'
      setError(message)
    }
  }

  async function handleSave() {
    await updateSettings(settings)
  }

  function handleThemeChange(nextMode: ThemeMode) {
    setThemeMode(nextMode)
    setSettings((previous) => ({
      ...previous,
      themeMode: nextMode,
    }))
    applyThemeMode(nextMode)
  }

  useEffect(() => {
    if (themeMode !== 'system') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const syncTheme = () => applyThemeMode('system')

    mediaQuery.addEventListener('change', syncTheme)
    return () => mediaQuery.removeEventListener('change', syncTheme)
  }, [themeMode])

  if (!isAuthenticated || !entity || !type || !accessToken) {
    return <Navigate to="/auth/login" replace />
  }

  const currentType = type
  const currentAccessToken = accessToken
  const serverSettings: AppSettings = {
    emailNotifications: entity.emailNotifications ?? true,
    weeklyDigest: entity.weeklyDigest ?? true,
    publicProfile: entity.publicProfile ?? true,
    themeMode: entity.themeMode ?? 'system',
  }
  const hasChanges =
    settings.emailNotifications !== serverSettings.emailNotifications ||
    settings.weeklyDigest !== serverSettings.weeklyDigest ||
    settings.publicProfile !== serverSettings.publicProfile ||
    settings.themeMode !== serverSettings.themeMode

  async function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError('Please fill in all password fields')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match')
      return
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError('New password must be different from current password')
      return
    }

    try {
      const result =
        currentType === 'company'
          ? await updateMeCompanyPassword({
              currentPassword: passwordForm.currentPassword,
              newPassword: passwordForm.newPassword,
            }).unwrap()
          : await updateMeUserPassword({
              currentPassword: passwordForm.currentPassword,
              newPassword: passwordForm.newPassword,
            }).unwrap()

      setPasswordSuccess(result.message || 'Password updated successfully')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (err) {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'data' in err &&
        typeof (err as { data?: { message?: unknown } }).data?.message === 'string'
          ? (err as { data: { message: string } }).data.message
          : 'Failed to update password'
      setPasswordError(message)
    }
  }

  return (
    <div className="bg-background min-h-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-card-bg border border-border rounded-xl p-5 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
              <IconSettings size={22} stroke={1.6} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-base-200">Settings</h1>
              <p className="text-sm text-base-100 mt-1">
                Customize your account preferences and appearance.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card-bg border border-border rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-base-200">Preferences</h2>
            <p className="text-xs text-base-100 mt-0.5">
              Notifications, profile visibility, and theme are saved together.
            </p>
          </div>

          {[
            {
              key: 'emailNotifications' as const,
              title: 'Email notifications',
              hint: 'Receive updates about follows, votes, and replies',
            },
            {
              key: 'weeklyDigest' as const,
              title: 'Weekly digest',
              hint: 'Get a summary of top activity once a week',
            },
            {
              key: 'publicProfile' as const,
              title: 'Public profile visibility',
              hint: 'Allow others to see your profile details',
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between gap-4 border border-border rounded-lg p-3 cursor-pointer"
            >
              <div>
                <p className="text-sm font-medium text-base-200">{item.title}</p>
                <p className="text-xs text-base-100 mt-0.5">{item.hint}</p>
              </div>
              <input
                type="checkbox"
                checked={settings[item.key]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [item.key]: e.target.checked,
                  })
                }
                className="h-4 w-4 accent-primary-600"
              />
            </label>
          ))}

          <div className="border border-border rounded-lg p-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                {themeMode === 'dark' ? (
                  <IconMoon size={18} stroke={1.6} />
                ) : (
                  <IconSun size={18} stroke={1.6} />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-base-200">Theme preference</p>
                <p className="text-xs text-base-100 mt-0.5">
                  This theme choice is saved with your other preferences.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                  {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => {
                    const active = themeMode === mode
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handleThemeChange(mode)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                          active
                            ? 'border-primary-600 bg-primary-100 text-primary-800'
                            : 'border-border text-base-200 hover:border-primary-600'
                        }`}
                      >
                        {mode}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={!hasChanges || isSaving}
              className="px-4 py-2 hover:cursor-pointer rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Save settings
            </button>
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </div>

        <div className="bg-card-bg border border-border rounded-xl p-5 mt-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
              <IconLock size={20} stroke={1.6} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-base-200">Change password</h2>
              <p className="text-sm text-base-100 mt-1">Update your account password securely.</p>
            </div>
          </div>

          <form onSubmit={(e) => void handlePasswordSubmit(e)} className="space-y-3">
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className="input"
              placeholder="Current password"
              autoComplete="current-password"
            />
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              className="input"
              placeholder="New password"
              autoComplete="new-password"
            />
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className="input"
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUpdatingPassword ? 'Updating...' : 'Update password'}
            </button>
          </form>

          {passwordError ? <p className="text-sm text-red-500">{passwordError}</p> : null}
          {passwordSuccess ? <p className="text-sm text-green-600">{passwordSuccess}</p> : null}
        </div>
      </div>
    </div>
  )
}
