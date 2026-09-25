import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "./Header";

export default function MainLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#F4F6F6] overflow-hidden relative">
      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Cột trái: Thanh điều hướng (Responsive Drawer trên Mobile, Cột cố định trên Desktop) */}
      <Sidebar
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Cột phải: Header + Nội dung chính */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header luôn cố định ở trên cùng với nút mở menu trên mobile */}
        <Header onToggleMobileMenu={() => setIsMobileNavOpen((prev) => !prev)} />

        {/* Vùng render component động (Dashboard, Products, Profile...) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
