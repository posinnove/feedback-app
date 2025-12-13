function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Voxela Feedback
        </h1>

        <p className="text-center text-gray-500 mb-6">
          We would love to hear your thoughts for service delivery improvement!
        </p>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Your email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            rows={4}
            placeholder="Your feedback"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Submit Feedback
          </button>
        </form>

      </div>
    </div>
  );
}

export default App;
