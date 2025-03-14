import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between">
      {/* Logo and Navigation Links */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/vercel.svg" 
            alt="Brand Logo" 
            width={40} 
            height={40} 
            className="mr-2"
          />
          <span className="text-xl font-bold">Home</span>
        </Link>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-600 transition-colors">
            Home
          </Link>
          <Link href="/shop" className="hover:text-gray-600 transition-colors">
            Shop
          </Link>
          <Link href="/featured" className="hover:text-gray-600 transition-colors">
            Featured
          </Link>
        </nav>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Cart and Auth Buttons */}
      <div className="flex items-center space-x-4">
        {/* Shopping Cart */}
        <button className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </button>
        
        {/* Auth Buttons */}
        <Link 
          href="/signup" 
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
        >
          Sign up
        </Link>
        <Link 
          href="/signin" 
          className="border border-black py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
};

export default Navbar;