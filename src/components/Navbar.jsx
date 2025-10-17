import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/tasks", label: "Tasks" },
    { to: "/products", label: "Products" },
    { to: "/categories", label: "Categories" },
    { to: "/invoices", label: "Invoices" }, // ✅ Added Invoices link
  ];

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow-md relative z-50">
      {/* Logo */}
      <div
        className="text-2xl font-bold tracking-wide cursor-pointer"
        onClick={() => navigate("/")}
      >
        Sales<span className="text-yellow-400">Manager</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`${
              location.pathname === link.to ? "text-yellow-400 font-semibold" : "text-white"
            } hover:text-yellow-300 transition duration-200`}
          >
            {link.label}
          </Link>
        ))}

        {user && (
          <div className="flex items-center space-x-3 border-l border-white/30 pl-4">
            <span className="font-medium">{user.name || "User"}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-yellow-400 transition duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white focus:outline-none"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-blue-800 flex flex-col items-center space-y-4 py-4 shadow-lg md:hidden z-50">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`${
                location.pathname === link.to ? "text-yellow-400 font-semibold" : "text-white"
              } hover:text-yellow-300 transition duration-200`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-white hover:text-yellow-400 transition duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
