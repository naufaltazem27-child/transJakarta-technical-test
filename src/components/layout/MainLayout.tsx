import React, { useState } from "react";
import {
  LayoutDashboard,
  Map,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import classNames from "classnames";
import { SidebarItem } from "../ui/SidebarItem";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleLogoutPopup = () => setShowLogoutPopup(!showLogoutPopup);

  return (
    <div className="flex h-screen bg-[#F8F9FC] font-sans overflow-hidden">
      {/* === SIDEBAR === */}
      <aside
        className={classNames(
          "bg-white h-screen transition-all duration-300 ease-in-out flex flex-col relative z-30",
          isCollapsed ? "w-20" : "w-[260px]",
        )}
        style={{
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.03)",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {/* --- HEADER LOGO --- */}
        <div
          className={classNames(
            "flex items-center border-b border-gray-100 transition-all duration-300",
            isCollapsed
              ? "justify-center px-0 w-full h-20"
              : "justify-start px-6 w-full h-20",
          )}
        >
          <div className="relative flex items-center justify-center">
            {isCollapsed ? (
              <img
                src="/images/TransJakarta_Logo_Vertical.png"
                alt="Transjakarta Icon"
                className="w-18 h-18 object-contain transition-all duration-300"
              />
            ) : (
              <img
                src="/images/TransJakarta_Logo_Horizontal.png"
                alt="Transjakarta Logo"
                className="h-9 w-auto object-contain transition-all duration-300"
              />
            )}
          </div>
        </div>

        {/* --- TOGGLE BUTTON --- */}
        <div
          className={classNames(
            "border-b border-gray-100 transition-all duration-300",
            isCollapsed ? "px-3 py-3" : "px-4 py-3",
          )}
        >
          <button
            onClick={toggleSidebar}
            className={classNames(
              "w-full flex items-center gap-3 rounded-lg transition-all duration-200 border border-[#06367C]/40 bg-[#3e86f3]/15 hover:bg-[#3e86f3]/10 text-[#06367C] hover:border-[#06367C]/30 cursor-pointer",
              isCollapsed ? "px-0 justify-center py-3.5" : "px-3.5 py-3",
            )}
          >
            <div
              className={classNames(
                "flex items-center justify-center shrink-0 transition-all duration-200",
                isCollapsed ? "w-10 h-10" : "w-9 h-9",
              )}
            >
              {isCollapsed ? (
                <ChevronRight size={19} strokeWidth={2} />
              ) : (
                <ChevronLeft size={19} strokeWidth={2} />
              )}
            </div>
            {!isCollapsed && (
              <span className="text-[13.5px] font-medium tracking-wide">
                Collapse
              </span>
            )}
          </button>
        </div>

        {/* --- MENU LIST (CENTERED) --- */}
        <nav
          className={classNames(
            "flex-1 flex flex-col justify-center scrollbar-none transition-all duration-300",
            isCollapsed ? "px-3 py-6" : "px-4 py-6",
          )}
          style={{
            overflow: "visible",
          }}
        >
          <div>
            {/* Section Label: MAIN MENU */}
            {!isCollapsed && (
              <p className="px-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 transition-opacity duration-200">
                Main Menu
              </p>
            )}

            <div className={classNames("space-y-1.5", isCollapsed && "mt-0")}>
              <SidebarItem
                icon={LayoutDashboard}
                label="Monitoring Armada"
                isCollapsed={isCollapsed}
                to="/"
              />
              <SidebarItem
                icon={Map}
                label="Peta Langsung"
                isCollapsed={isCollapsed}
                to="/map"
              />
            </div>

            {/* Section Label: SYSTEM */}
            {!isCollapsed && (
              <p className="px-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 mt-8 transition-opacity duration-200">
                System
              </p>
            )}

            <div
              className={classNames(
                "space-y-1.5",
                isCollapsed && "mt-8 pt-6 border-t border-gray-100",
              )}
            >
              <SidebarItem
                icon={Settings}
                label="Pengaturan"
                isCollapsed={isCollapsed}
                to="/settings"
              />
            </div>
          </div>
        </nav>

        {/* --- USER PROFILE SECTION WITH LOGOUT POPUP --- */}
        <div
          className={classNames(
            "border-t border-gray-100 bg-gradient-to-b from-transparent to-gray-50/50 transition-all duration-300 relative",
            isCollapsed ? "p-3" : "p-4",
          )}
        >
          {/* Logout Popup */}
          {showLogoutPopup && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowLogoutPopup(false)}
              ></div>

              {/* Popup Menu */}
              <div
                className={classNames(
                  "absolute bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 transition-all duration-200",
                  isCollapsed
                    ? "bottom-6 left-full ml-3 w-48"
                    : "bottom-full mb-2 left-4 right-4",
                )}
              >
                {/* Arrow indicator for collapsed state */}
                {isCollapsed && (
                  <div className="absolute right-full bottom-3 mr-[-1px] w-0 h-0 border-4 border-transparent border-r-white"></div>
                )}

                <a
                  href="/login"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                >
                  <LogOut
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span className="font-medium">Logout</span>
                </a>
              </div>
            </>
          )}

          {/* User Profile Button */}
          <button
            onClick={toggleLogoutPopup}
            className={classNames(
              "w-full flex items-center gap-3 rounded-lg hover:bg-gray-100/80 transition-all duration-200 group",
              isCollapsed
                ? "justify-center flex-col p-2"
                : "justify-start flex-row p-2.5",
            )}
          >
            <div
              className="w-11 h-11 rounded-full bg-gradient-to-br from-[#06367C] to-[#0847a0] flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-all duration-200 border-2 border-white ring-2 ring-gray-100 shrink-0"
              style={{
                boxShadow: "0 4px 12px rgba(6, 54, 124, 0.15)",
              }}
            >
              <span className="text-sm">AO</span>
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  Admin Operasional
                </p>
                <p className="text-xs text-gray-500 font-medium truncate">
                  Divisi IT
                </p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* === KONTEN UTAMA === */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 bg-[#F8F9FC]">
        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
};
