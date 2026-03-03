import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "View Posts", path: "/posts/view" },
    { name: "Business Profile", path: "/profile" },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-6">
      <h2 className="text-2xl font-bold mb-8 text-indigo-600">Voxella</h2>

      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              location.pathname === link.path
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;