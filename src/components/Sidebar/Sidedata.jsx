import { NavLink } from "react-router-dom";

const Sidedata = ({ navpath, icon, data, coll, onNavClick }) => {
  return (
    <NavLink
      to={`/${navpath}`}
      className="group block outline-none"
      onClick={onNavClick}
    >
      {({ isActive }) => (
        <div
          className={`flex items-center rounded-xl transition-all duration-200 relative
            ${isActive
              ? "bg-blue-600 text-white shadow-md shadow-blue-100"
              : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
            }
            ${coll ? "justify-center h-11 w-11 mx-auto" : "px-3 h-11 gap-3"}`}
          title={coll ? data : ""}
        >
          <i className={`${icon} text-[18px] shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}></i>

          {!coll && (
            <span className="text-[13px] font-semibold truncate">{data}</span>
          )}

          {isActive && !coll && (
            <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" />
          )}
        </div>
      )}
    </NavLink>
  );
};

export default Sidedata;
