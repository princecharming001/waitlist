// Form component examples using Tailwind CSS

export default function FormExamples() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Form Examples</h2>
      
      {/* Basic Form */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Contact Form</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input 
              type="email" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Message
            </label>
            <textarea 
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Your message here..."
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Send Message
          </button>
        </form>
      </section>

      {/* Login Form */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Login Form</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Username
            </label>
            <input 
              type="text" 
              className="w-full border-2 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-purple-500"
              placeholder="Enter username"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input 
              type="password" 
              className="w-full border-2 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-purple-500"
              placeholder="Enter password"
            />
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="remember"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 text-gray-700">
              Remember me
            </label>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
          >
            Sign In
          </button>
          
          <div className="text-center">
            <a href="#" className="text-purple-500 hover:text-purple-700 text-sm">
              Forgot password?
            </a>
          </div>
        </form>
      </section>

      {/* Select and Radio Buttons */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Advanced Inputs</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Select Option
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Choose an option</option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Choose Your Preference
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="preference" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Option A</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="preference" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Option B</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="preference" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Option C</span>
              </label>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}

