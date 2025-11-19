// src/pages/HomePage.jsx - Landing/Home page

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Send Money to the Caribbean
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Fast, affordable, and secure remittance service for the Caribbean diaspora.
            Transfer money in minutes, not days.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose CaribRemit?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Fast Transfers</h3>
            <p className="text-gray-600">
              Get money to your loved ones within 1-3 business days, or same-day on selected routes.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Best Rates</h3>
            <p className="text-gray-600">
              Competitive exchange rates and low fees. No hidden charges - transparent pricing always.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
            <p className="text-gray-600">
              Bank-level encryption and full compliance with international financial regulations.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Countries Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Supported Countries</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {['Jamaica', 'Trinidad & Tobago', 'Bahamas', 'Barbados', 'Guyana', 'Belize', 'St. Lucia', 'Dominica'].map(country => (
            <div key={country} className="text-center p-4 bg-white rounded-lg">
              <p className="text-gray-700">{country}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Send Money?</h2>
        <p className="text-lg text-gray-600 mb-8">Join thousands of satisfied customers sending money home.</p>
        <a
          href="/signup"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
        >
          Create Your Account Now
        </a>
      </section>
    </div>
  );
}

export default HomePage;
