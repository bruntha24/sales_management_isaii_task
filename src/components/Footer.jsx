import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white rounded-lg p-6 mt-10 shadow-inner">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="font-semibold">&copy; 2025 Sales Management Dashboard</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <FaFacebook className="hover:text-gray-300 cursor-pointer transition" />
          <FaTwitter className="hover:text-gray-300 cursor-pointer transition" />
          <FaInstagram className="hover:text-gray-300 cursor-pointer transition" />
          <FaLinkedin className="hover:text-gray-300 cursor-pointer transition" />
        </div>
      </div>
      <p className="text-gray-200 mt-4 text-sm text-center md:text-left">
        Dashboard showing tasks, products, categories, and analytics with blue and gold theme.
      </p>
    </footer>
  );
};

export default Footer;
