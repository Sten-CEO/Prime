import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface MenuItem {
  label: string;
  path: string;
}

interface HoverMenuProps {
  items: MenuItem[];
  visible: boolean;
  position: { top: number; left: number };
}

export const HoverMenu = ({ items, visible, position }: HoverMenuProps) => {
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <div
      className="fixed z-50 animate-in fade-in duration-200"
      style={{ top: position.top, left: position.left }}
    >
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-2 min-w-[200px]">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/90 hover:text-white text-sm"
          >
            <span>{item.label}</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
        ))}
      </div>
    </div>
  );
};
