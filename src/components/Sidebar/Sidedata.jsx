import { NavLink } from "react-router-dom";

const Sidedata = ({ navpath, icon, data, coll }) => {
  return (
    <NavLink to={`/${navpath}`} className="block">
      {({ isActive }) => (
        <div
          className={`h-12 flex items-center p-2 rounded transition
          ${
            isActive
              ? "bg-gray-200 border-l-4 border-blue-600"
              : "hover:bg-gray-100"
          }
          ${coll ? "justify-center" : "gap-3"}`}
        >
          <div className="text-2xl">
            <i className={icon}></i>
          </div>

          {!coll && <p className="text-lg">{data}</p>}
        </div>
      )}
    </NavLink>
  );
};

export default Sidedata;