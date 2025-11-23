import { Home, Folder, BookOpen, Target, User, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HoverMenu } from "./HoverMenu";

const navItems = [
  { icon: Home, path: "/accueil", label: "Home" },
  { 
    icon: Folder, 
    path: "/domaines", 
    label: "Domaines",
    submenu: [
      { label: "Vue Domaine", path: "/domaines" },
      { label: "Vue Catégories", path: "/categories/business" },
    ]
  },
  { 
    icon: BookOpen, 
    path: "/journal", 
    label: "Journal",
    submenu: [
      { label: "Journal général", path: "/journal" },
      { label: "Journal par domaine", path: "/journal/business" },
    ]
  },
  { 
    icon: Target, 
    path: "/prime-targets", 
    label: "Prime Targets",
    submenu: [
      { label: "Objectifs actifs", path: "/prime-targets" },
      { label: "Prime History", path: "/prime-history" },
    ]
  },
  { icon: User, path: "/profil", label: "Profil" },
  { icon: Settings, path: "/settings", label: "Paramètres" },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleMouseEnter = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (navItems[index].submenu) {
      const rect = event.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.top,
        left: rect.right + 8,
      });
      setHoveredItem(index);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-20 z-40 backdrop-blur-xl bg-white/5 border-r border-white/10 flex flex-col items-center py-8 gap-6">
        {/* Logo */}
        <div className="w-12 h-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center">
          <span className="text-white font-bold text-xl">P</span>
        </div>

        {/* Separator */}
        <div className="w-10 h-px bg-white/10" />

        {/* Navigation */}
        <div className="flex flex-col gap-4">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={index}
                onClick={() => !item.submenu && navigate(item.path)}
                onMouseEnter={(e) => handleMouseEnter(index, e)}
                onMouseLeave={handleMouseLeave}
                className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${
                  active
                    ? "bg-white/20 backdrop-blur-md"
                    : "hover:bg-white/10"
                }`}
                title={item.label}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    active ? "text-white" : "text-white/60"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Hover menus */}
      {hoveredItem !== null && navItems[hoveredItem].submenu && (
        <div onMouseEnter={() => setHoveredItem(hoveredItem)} onMouseLeave={handleMouseLeave}>
          <HoverMenu
            items={navItems[hoveredItem].submenu || []}
            visible={true}
            position={menuPosition}
          />
        </div>
      )}
    </>
  );
};
