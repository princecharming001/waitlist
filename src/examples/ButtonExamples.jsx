// Button component examples using Tailwind CSS

export default function ButtonExamples() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Button Examples</h2>
      
      {/* Primary Buttons */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Primary Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Primary
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Success
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Danger
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
            Warning
          </button>
        </div>
      </section>

      {/* Outline Buttons */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Outline Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <button className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded transition-colors">
            Primary
          </button>
          <button className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold py-2 px-4 rounded transition-colors">
            Success
          </button>
          <button className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-4 rounded transition-colors">
            Danger
          </button>
        </div>
      </section>

      {/* Rounded Buttons */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Rounded Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full">
            Rounded
          </button>
          <button className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-full">
            Pill Button
          </button>
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full">
            Click Me
          </button>
        </div>
      </section>

      {/* Button Sizes */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Button Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs rounded">
            Small
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Medium
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 text-lg rounded">
            Large
          </button>
        </div>
      </section>

      {/* Disabled Buttons */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Disabled State</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-not-allowed" disabled>
            Disabled
          </button>
          <button className="bg-blue-300 text-white font-bold py-2 px-4 rounded cursor-not-allowed opacity-50" disabled>
            Can't Click
          </button>
        </div>
      </section>

      {/* Gradient Buttons */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Gradient Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            Gradient
          </button>
          <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            Ocean
          </button>
          <button className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            Sunset
          </button>
        </div>
      </section>
    </div>
  )
}

