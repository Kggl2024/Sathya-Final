import { Link, useLocation } from 'react-router-dom';
import { topMenus } from '../utils/menuData';

const Menubar = ({ onMobileMenuToggle }) => {
  const location = useLocation();

  return (
    <div className="flex items-center justify-between bg-[#FAF9F6] text-[#1e7a6f] px-4 sm:px-6 shadow-md h-14">
      <div className="flex items-center gap-2">
        <button
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-emerald-50"
          onClick={onMobileMenuToggle}
          aria-label="Open menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <img src="/logo_abstract.png" alt="Logo" className="w-16 p-1" />
      </div>

      <ul className="hidden md:flex items-center space-x-6">
        {topMenus
          .filter(m => m.id !== 99)
          .map((item) => {
            const ActiveIcon = item.icon;
            const active = location.pathname === item.path || location.pathname.startsWith(item.activePath) && item.activePath !== '/';
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center hover:text-blue-500 transition-colors font-medium ${active ? 'text-blue-600' : ''}`}
                >
                  <ActiveIcon className="w-5 h-5 mr-2" />
                  {item.name}
                </Link>
              </li>
            );
          })}
      </ul>

      <div className="flex items-center">
        <div className="w-9 h-9 rounded-full bg-[#1e7a6f] text-white flex items-center justify-center hover:bg-blue-400 cursor-pointer transition-colors">
          {/* Could be a dropdown later */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.761 0 5-2.686 5-6S14.761 0 12 0 7 2.686 7 6s2.239 6 5 6Zm0 2c-4.418 0-8 2.239-8 5v3h16v-3c0-2.761-3.582-5-8-5Z" fill="currentColor"/></svg>
        </div>
      </div>
    </div>
  );
};

export default Menubar;
