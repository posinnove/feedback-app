import type { Dispatch, SetStateAction } from 'react'
import type { Tab } from '../../types/feedback'

import { PiNoteFill } from 'react-icons/pi'
import { CiImageOn } from 'react-icons/ci'
import { FaLink } from 'react-icons/fa6'
import type { IconType } from 'react-icons'

interface TabConfig {
  label: Tab
  icon: IconType
}

const tabs: TabConfig[] = [
  { label: 'Post', icon: PiNoteFill },
  { label: 'Image & Video', icon: CiImageOn },
  { label: 'Link', icon: FaLink },
]

interface PostTabsProps {
  activeTab: Tab
  setActiveTab: Dispatch<SetStateAction<Tab>>
}

const PostTabs = ({ activeTab, setActiveTab }: PostTabsProps) => {
  return (
    <div className="border-b text-sm flex items-center justify-between">
      {tabs.map(({ label, icon: Icon }) => (
        <button
          key={label}
          aria-selected={activeTab === label}
          role="tab"
          onClick={() => setActiveTab(label)}
          className={`px-4 py-2 border-b-2 hover:text-blue-500/50 hover:border-blue-500/50 duration-300 cursor-pointer ${
            activeTab === label
              ? 'border-blue-600 text-blue-600 font-medium'
              : 'border-transparent text-gray-500'
          }`}
        >
          <div className="flex items-center">
            <Icon className="text-base mr-2" />
            {label}
          </div>
        </button>
      ))}
    </div>
  )
}

export default PostTabs
