const FileUpload = () => {
  return (
    <div className="border rounded-lg bg-white p-4 space-y-3">
      <h3 className="text-sm font-medium">File Details</h3>

      {/* Uploaded file mock */}
      <div className="border rounded-md p-3 text-xs">
        <p className="font-medium">New branding.png</p>
        <div className="h-1 bg-gray-200 rounded mt-2">
          <div className="h-1 bg-blue-600 w-1/2 rounded" />
        </div>
      </div>

      {/* Upload box */}
      <div className="border-dashed border rounded-md p-6 text-center text-xs text-gray-500">
        Click to Upload or drag and drop
        <br />
        PNG, JPG, PDF (MAX 5MB)
      </div>
    </div>
  )
}

export default FileUpload
