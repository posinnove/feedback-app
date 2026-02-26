export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 min-h-screen border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-base-200">VOXELLA</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-base-100 uppercase tracking-wider mb-2">
            PAGES
          </h3>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10L5 8M5 8L10 3L15 8M5 8V16C5 16.5523 5.44772 17 6 17H8M15 8L17 10M15 8V16C15 16.5523 14.5523 17 14 17H12M8 17C8.55228 17 9 16.5523 9 16V12C9 11.4477 9.44772 11 10 11H10.01C10.5623 11 11.01 11.4477 11.01 12V16C11.01 16.5523 11.4577 17 12.01 17H8Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-base-200 hover:bg-gray-100 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 9C11.6569 9 13 7.65685 13 6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6C7 7.65685 8.34315 9 10 9Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 17C3 14.2386 5.23858 12 8 12H12C14.7614 12 17 14.2386 17 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Customers
          </a>
          <div className="mt-2">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-600 text-white"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 2H4C3.44772 2 3 2.44772 3 3V17C3 17.5523 3.44772 18 4 18H16C16.5523 18 17 17.5523 17 17V8M9 2L17 8M9 2V8H17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Feedback Posts
            </a>
            <div className="ml-8 mt-1 space-y-1">
              <a
                href="#"
                className="block px-3 py-2 rounded-lg text-sm bg-primary-600 text-white"
              >
                Post Submissions
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-lg text-sm bg-primary-600 text-white"
              >
                Create Post
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-lg text-sm bg-primary-600 text-white"
              >
                View Posts
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-1">
          <h3 className="text-xs font-semibold text-base-100 uppercase tracking-wider mb-2">
            SETTINGS
          </h3>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-base-200 hover:bg-gray-100 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.45801 10.8972C2.87399 12.3354 3.71492 13.6169 4.86751 14.5625C6.02009 15.5081 7.42826 16.0721 8.88801 16.1769C10.3478 16.2816 11.7874 15.9224 13.0333 15.1465C14.2792 14.3706 15.2734 13.2137 15.882 11.8393C16.4906 10.4648 16.6879 8.93503 16.4497 7.44568C16.2115 5.95633 15.5486 4.57449 14.5451 3.48783C13.5416 2.40117 12.2426 1.65829 10.822 1.36062C9.40144 1.06295 7.92107 1.22288 6.58801 1.81722"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Business Profile
          </a>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-base-100">
          Voxella, Inc. © 2024. All rights reserved.
        </p>
      </div>
    </aside>
  )
}

