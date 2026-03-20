// Password strength utility 

export const STRENGTH_LABELS = ['Weak', 'Fair', 'Good', 'Strong'] as const
export const STRENGTH_COLORS = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'] as const
export const STRENGTH_TEXT = ['text-red-500', 'text-orange-400', 'text-yellow-500', 'text-green-500'] as const

export function getPasswordStrength(pw: string): 0 | 1 | 2 | 3 {
    if (pw.length < 8) return 0
    let score = 0
    if (pw.length >= 12) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return Math.min(score, 3) as 0 | 1 | 2 | 3
}
