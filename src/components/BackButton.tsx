
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const BackButton = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide back button on home page
  if (location.pathname === "/") return null;

  return (
    <button
      onClick={() => navigate(-1)}
      aria-label="Back"
      className={`flex items-center gap-1 px-2 py-1 rounded-full bg-white/80 shadow hover:bg-white transition-all border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring active:scale-95 md:text-base ${className ?? ""}`}
      style={{ zIndex: 10 }}
    >
      <ChevronLeft className="w-5 h-5" />
      <span className="hidden sm:inline">Back</span>
    </button>
  );
};

export default BackButton;
