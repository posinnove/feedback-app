import { Link } from 'react-router-dom'

interface Props {
    backgroundImage: string
    overlayClassName?: string
    children: React.ReactNode
}

/**
 * The left-side branded image panel shared across all auth pages.
 * Pass the overlay gradient via `overlayClassName` and the bottom
 * content (quote, title, bullet list, etc.) via `children`.
 */
export default function AuthImagePanel({
    backgroundImage,
    overlayClassName = 'bg-gradient-to-br from-primary-800/80 to-primary-600/60',
    children,
}: Props) {
    return (
        <div
            className="hidden lg:flex lg:w-1/2 xl:w-[45%] relative overflow-hidden"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className={`absolute inset-0 ${overlayClassName}`} />
            <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                <Link to="/" className="text-2xl font-bold tracking-tight">
                    VOXELLA
                </Link>
                <div>{children}</div>
            </div>
        </div>
    )
}
