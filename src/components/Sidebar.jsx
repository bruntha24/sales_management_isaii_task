import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { path: "/", label: "Dashboard" },
    { path: "/tasks", label: "Tasks" },
    { path: "/products", label: "Products" },
    { path: "/categories", label: "Categories" },
    { path: "/upload", label: "Uploads" },
  ];

  return (
    <div className="w-60 h-[calc(100vh-64px)] bg-gray-100 shadow-md p-4">
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block p-2 rounded ${
                location.pathname === link.path
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-200"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
