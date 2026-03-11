import { STRENGTH_COLORS, STRENGTH_LABELS, STRENGTH_TEXT, getPasswordStrength } from '../../utils/passwordStrength'

interface Props {
    password: string
    errorMessage?: string
}

export default function PasswordStrengthBar({ password, errorMessage }: Props) {
    if (!password.length) return null

    const s = getPasswordStrength(password)
    const missing = [
        !/[A-Z]/.test(password) && 'uppercase',
        !/[0-9]/.test(password) && 'number',
        !/[^A-Za-z0-9]/.test(password) && 'symbol',
    ].filter(Boolean)

    return (
        <div className="mt-2.5 space-y-1.5">
            <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= s ? STRENGTH_COLORS[s] : 'bg-gray-200'
                            }`}
                    />
                ))}
            </div>
            <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${STRENGTH_TEXT[s]}`}>
                    {STRENGTH_LABELS[s]}
                </span>
                <span className="text-xs text-base-100">
                    {missing.length === 0 ? 'All requirements met' : `Add: ${missing.join(', ')}`}
                </span>
            </div>
            {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
        </div>
    )
}
