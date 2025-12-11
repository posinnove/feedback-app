import { useState } from 'react'
import PostTabs from '../components/feedback/PostTabs'
import type { Tab } from '../types/feedback'
// Upload type tabs
import PostForm from '../components/feedback/PostForm'
import ImageVideoForm from '../components/feedback/ImageVideoForm'
import LinkForm from '../components/feedback/LinkForm'

import { RiArrowDropRightLine, RiArrowDropUpLine, RiArrowDropDownLine } from 'react-icons/ri'
import { LuUserRound } from 'react-icons/lu'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { CiSettings } from 'react-icons/ci'
import { VscGraph } from 'react-icons/vsc'

// type Tab = 'Post' | 'Image & Video' | 'Link'

const SubmitFeedbackPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Post')
  const [drafts, setDrafts] = useState(0)

  return (
    <section className="flex">
      <aside className="hidden md:block w-60 h-screen p-6 space-y-6">
        <h1 className="uppercase text-xs text-gray-600 font-bold my-4">Pages</h1>

        <div>
          <div className="flex items-center bg-blue-500 rounded-lg text-white px-4 py-2 mb-2">
            <LuUserRound className="text-white mr-2" />
            <a href="#" onClick={(e) => e.preventDefault()} className="">
              Dashboard
            </a>
          </div>
          <div className="flex items-center rounded-lg px-4 py-2 mb-2">
            <MdOutlineSpaceDashboard className="text-gray-600 mr-2" />
            <a href="#" onClick={(e) => e.preventDefault()} className="text-gray-600">
              Customers
            </a>
          </div>

          <div className="bg-blue-500 rounded-lg text-white px-4 py-2 mb-2">
            <button className="flex items-center justify-between w-full whitespace-nowrap">
              <VscGraph />
              <p>Feedback Posts</p>
              <RiArrowDropUpLine className="text-xl" />
              <RiArrowDropDownLine className="text-xl hidden" />
            </button>
            <div className="flex flex-col items-start mt-2 pl-2 space-y-2">
              <a href="#" onClick={(e) => e.preventDefault()}>
                - Post Submissions
              </a>
              <a href="#" onClick={(e) => e.preventDefault()}>
                - Create Post
              </a>
              <a href="#" onClick={(e) => e.preventDefault()}>
                - View Posts
              </a>
            </div>
          </div>

          <h1 className="uppercase text-xs text-gray-600 font-bold my-4">Settings</h1>

          <div className="flex items-center rounded-lg px-4 py-2 mb-2">
            <CiSettings className="text-gray-600 mr-2 text-xl" />
            <a href="#" onClick={(e) => e.preventDefault()} className="text-gray-600">
              Business Profile
            </a>
          </div>
        </div>
      </aside>
      <section className="bg-gray-50 w-full max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center text-xs font-semibold">
          <a href="#" onClick={(e) => e.preventDefault()}>
            Home
          </a>
          <RiArrowDropRightLine className="text-2xl mt-0.5" />
          <a href="#" onClick={(e) => e.preventDefault()}>
            Feedback Posts
          </a>
          <RiArrowDropRightLine className="text-2xl mt-0.5" />
          <a href="#" onClick={(e) => e.preventDefault()}>
            New Post
          </a>
        </div>
        
        {/* Page title */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg md:text-3xl font-semibold">Create Feedback Post</h1>
          <button className="bg-blue-600 hover:bg-transparent border border-blue-600 text-white hover:text-blue-600 text-sm px-2 py-1 md:px-4 md:py-2 rounded-md cursor-pointer duration-300">
            + Feedback post
          </button>
        </div>
        <div className="flex items-center justify-end gap-2 uppercase text-xs">
          <p className="font-bold text-blue-600">Drafts</p>
          <button className="bg-gray-600 text-white px-1 py-0.5 rounded-sm">{drafts}</button>
        </div>
        {/* Post container */}
        <div className="border rounded-lg bg-white">
          <PostTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'Post' && <PostForm />}
          {activeTab === 'Image & Video' && <ImageVideoForm />}
          {activeTab === 'Link' && <LinkForm />}
        </div>
      </section>
    </section>
  )
}

export default SubmitFeedbackPage
