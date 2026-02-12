import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  to: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  isCollapsed,
  to, 
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0 });

  useEffect(() => {
    if (isCollapsed && linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      setTooltipPosition({ top: rect.top + rect.height / 2 });
    }
  }, [isCollapsed]);

  return (
    <Link
      ref={linkRef}
      to={to}
      className={classNames(
        "flex items-center gap-3 rounded-lg transition-all duration-200 group relative",
        isCollapsed ? "px-0 justify-center w-full py-3.5" : "px-3.5 py-3",
        isActive
          ? "text-[#06367C]"
          : "text-gray-400 hover:bg-gray-50 hover:text-[#06367C]",
      )}
    >
      {/* Icon Container */}
      <div
        className={classNames(
          "flex items-center justify-center shrink-0 transition-all duration-200",
          isCollapsed ? "w-10 h-10" : "w-9 h-9",
          !isActive && "group-hover:scale-110",
        )}
      >
        <Icon
          size={isCollapsed ? 20 : 19}
          strokeWidth={isActive ? 2.5 : 2}
          className={classNames(
            "transition-all duration-200",
            isActive && "text-[#06367C]",
          )}
        />
      </div>

      {/* Label */}
      <span
        className={classNames(
          "whitespace-nowrap transition-all duration-300 text-[13.5px] tracking-wide",
          isCollapsed
            ? "opacity-0 w-0 scale-0 absolute"
            : "opacity-100 w-auto scale-100 relative",
          isActive ? "font-semibold" : "font-medium",
        )}
      >
        {label}
      </span>

      {/* Tooltip saat Collapsed */}
      {isCollapsed && (
        <div
          className="fixed left-[92px] z-[100] bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap scale-95 group-hover:scale-100 -translate-y-1/2"
          style={{ top: `${tooltipPosition.top}px` }}
        >
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-px w-0 h-0 border-4 border-transparent border-r-gray-900"></div>
        </div>
      )}
    </Link>
  );
};
