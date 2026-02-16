import { Link } from 'react-router-dom'
import Avatar from './ui/Avatar'

export default function Header() {
  return (
    <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between">
      {/* Brand */}
      <Link to="/" className="text-xl font-bold text-primary-600 tracking-tight mr-6">
        VOXELLA
      </Link>

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-base-100"
            >
              <path
                d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 19L14.65 14.65"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="input pl-10"
          />
        </div>
      </div>

      {/* Right Side - Icons and User */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative p-2 text-base-100 hover:text-base-200 transition-colors" aria-label="Notifications">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 6.667A5 5 0 005 6.667C5 12.5 2.5 14.167 2.5 14.167H17.5S15 12.5 15 6.667zM11.442 17.5a1.667 1.667 0 01-2.884 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-rejected rounded-full"></span>
        </button>

        {/* Info / Help */}
        <button className="relative p-2 text-base-100 hover:text-base-200 transition-colors" aria-label="Help">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.575 7.5A2.5 2.5 0 0110.5 5.625C11.881 5.625 13 6.494 13 7.575C13 8.656 11.881 9.525 10.5 9.525V10.625"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10.5" cy="13" r="0.5" fill="currentColor" />
          </svg>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <Avatar name="Mellow Junior" size="lg" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-base-200">Mellow Junior</span>
          </div>
          <button className="text-base-100 hover:text-base-200" aria-label="User menu">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
