// import { NavLink } from "react-router-dom";

// const Sidedata = ({ navpath, icon, data, coll }) => {
//   return (
//     <NavLink to={`/${navpath}`} className="block">
//       {({ isActive }) => (
//         <div
//           className={`h-12 flex items-center p-2 rounded transition
//           ${
//             isActive
//               ? "bg-gray-200 border-l-4 border-blue-600"
//               : "hover:bg-gray-100"
//           }
//           ${coll ? "justify-center" : "gap-3"}`}
//         >
//           <div className="text-2xl">
//             <i className={icon}></i>
//           </div>

//           {!coll && <p className="text-lg">{data}</p>}
//         </div>
//       )}
//     </NavLink>
//   );
// };

// export default Sidedata;


import { NavLink } from "react-router-dom";

const Sidedata = ({ navpath, icon, data, coll }) => {
  return (
    <NavLink to={`/${navpath}`} className="group block outline-none">
      {({ isActive }) => (
        <div
          className={`h-12 flex items-center rounded-2xl transition-all duration-300 relative
          ${
            isActive
              ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
              : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
          }
          ${coll ? "justify-center" : "px-4 gap-4"}`}
          title={coll ? data : ""}
        >
          <div className={`text-xl transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
            <i className={icon}></i>
          </div>

          {!coll && (
            <p className={`text-sm font-bold tracking-tight transition-opacity duration-300`}>
              {data}
            </p>
          )}

          {/* Active Indicator (Dot) */}
          {isActive && !coll && (
            <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
          )}
        </div>
      )}
    </NavLink>
  );
};

export default Sidedata;