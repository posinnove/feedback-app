const FeedbackMedia = () => {
  return (
    <div className="flex justify-center">
      <div className="rounded-lg overflow-hidden bg-black max-w-md">
        <video
          controls
          className="w-full h-auto"
          src="https://www.w3schools.com/html/mov_bbb.mp4"
        />
        {/* For image:
        <img src="IMAGE_URL" className="w-full h-auto" />
        */}
      </div>
    </div>
  )
}

export default FeedbackMedia
