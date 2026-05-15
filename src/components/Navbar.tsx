import { Link, useLocation } from "react-router-dom";
import { Leaf, Activity, Clock } from "lucide-react";
import { cn } from "../lib/utils";

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Analyze", path: "/dashboard", icon: Activity },
    { name: "Settings & History", path: "/history", icon: Clock },
  ];

  return (
    <nav className="w-full relative z-20 mt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="h-16 glass-panel flex items-center justify-between rounded-[32px] px-8">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center p-[6px] group-hover:scale-105 transition-transform">
            <Leaf className="w-full h-full text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Nutri<span className="text-emerald-400">Vision</span>
          </span>
        </Link>
        <div className="flex items-center space-x-6 text-sm font-medium text-white/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 transition-all duration-200",
                  isActive
                    ? "text-white border-b-2 border-emerald-400 pb-1"
                    : "hover:text-white transition-colors"
                )}
              >
                <Icon className="w-4 h-4 hidden sm:block" />
                <span className="hidden sm:inline">{item.name}</span>
                {/* For mobile icon only view if needed */}
                <span className="sm:hidden block"><Icon className="w-5 h-5"/></span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
