import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Open } from "../store/slicer/navButton";
import { navBar } from "../constants";

const Navbar = () => {
  const Dispatch = useDispatch()

  const Navbutton = useSelector((state)=> state.navButton?.component)
  
  const handleclick = (e) => {
    const Component = e.currentTarget?.id
    Dispatch(Open(Component))
  }
  
  return (
    <>
    <nav className="flex flex-col text-white min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] w-20 sm:w-24 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 rounded-2xl shadow-2xl border border-slate-600/30 backdrop-blur-sm">
      {navBar.map((navButton) => {
        const buttonId = navButton.slice(0, -4);
        const isActive = Navbutton === buttonId;
        return (
          <button
            key={navButton}
            id={buttonId}
            onClick={handleclick}
            className={`group relative flex flex-col items-center justify-center p-3 sm:p-4 mb-3 sm:mb-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${
              isActive 
                ? 'bg-gradient-to-r from-blue-500 to-slate-600 shadow-lg shadow-blue-500/25' 
                : 'hover:bg-gradient-to-r hover:from-slate-600/50 hover:to-slate-500/50'
            }`}
          >
            {/* Active indicator */}
            {isActive && (
              <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full animate-pulse"></div>
            )}
            
            <div className={`relative p-2 rounded-lg transition-all duration-300 ${
              isActive 
                ? 'bg-white/20 backdrop-blur-sm' 
                : 'bg-slate-600/40 group-hover:bg-slate-500/60'
            }`}>
              <img
                className={`w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300 ${
                  isActive ? 'filter brightness-0 invert' : 'group-hover:scale-110'
                }`}
                src={`/icon/${navButton}`}
                alt={buttonId}
              />
            </div>
            
            <span className={`hidden md:block text-xs font-medium mt-2 transition-all duration-300 ${
              isActive 
                ? 'text-white font-semibold' 
                : 'text-slate-300 group-hover:text-white'
            }`}>
              {buttonId}
            </span>
            
            {/* Hover glow effect */}
            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20' 
                : 'group-hover:bg-gradient-to-r group-hover:from-slate-400/10 group-hover:to-slate-300/10'
            }`}></div>
          </button>
        );
      })}
    </nav>
    <div>
    </div>
    </>
  );
};

export default Navbar;
