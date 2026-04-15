import React, { useState } from "react";
import { FiEye, FiEdit3, FiTrash2, FiCheckCircle, FiMinusCircle } from "react-icons/fi";

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const ROLE_BADGE = {
  superadmin: "bg-red-100    text-red-700",
  admin:      "bg-indigo-100 text-indigo-700",
  hr:         "bg-emerald-100 text-emerald-700",
  employee:   "bg-slate-100  text-slate-600",
};

const EmployeeTable = ({ employees = [], onView, onEdit, onDelete, onStatusToggle }) => {
  const [confirmId, setConfirmId] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {["Employee", "Department", "Designation", "Role", "Status", "Joined", "Actions"].map((h, i) => (
                <th key={i} className={`px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider ${i === 6 ? "text-right" : "text-left"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-14 text-slate-400 text-sm font-medium">
                  No records found
                </td>
              </tr>
            ) : employees.map((emp) => (
              <tr key={emp._id} className="group hover:bg-blue-50/20 transition-colors">

                {/* Employee */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        className="w-9 h-9 rounded-xl object-cover ring-2 ring-white shadow-sm"
                        src={emp.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name || "U")}&size=128&background=eff6ff&color=3b82f6&bold=true`}
                        alt={emp.name}
                      />
                      {(emp.status === "Active" || emp.status === "active") && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">{emp.name}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[160px]">{emp.email}</p>
                    </div>
                  </div>
                </td>

                {/* Department */}
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-600 uppercase tracking-tight">
                    {emp.department || "—"}
                  </span>
                </td>

                {/* Designation */}
                <td className="px-4 py-3 text-sm font-medium text-slate-600">{emp.designation || "—"}</td>

                {/* Role */}
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg uppercase tracking-tight ${ROLE_BADGE[emp.role?.toLowerCase()] || ROLE_BADGE.employee}`}>
                    {emp.role || "Staff"}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                    (emp.status === "Active" || emp.status === "active")
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-rose-50 text-rose-600 border-rose-100"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${(emp.status === "Active" || emp.status === "active") ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {emp.status || "—"}
                  </span>
                </td>

                {/* Joined */}
                <td className="px-4 py-3 text-sm font-medium text-slate-500">{fmtDate(emp.joiningDate)}</td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  {confirmId === emp._id ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-rose-600 font-semibold">Delete?</span>
                      <button onClick={() => { onDelete(emp._id); setConfirmId(null); }}
                        className="px-3 py-1 text-xs font-bold bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all">
                        Yes
                      </button>
                      <button onClick={() => setConfirmId(null)}
                        className="px-3 py-1 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all">
                        No
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-1">
                      <TblBtn onClick={() => onView(emp._id)}  color="blue"    title="View"><FiEye size={15} /></TblBtn>
                      <TblBtn onClick={() => onEdit(emp._id)}  color="amber"   title="Edit"><FiEdit3 size={15} /></TblBtn>
                      <TblBtn
                        onClick={() => onStatusToggle(emp._id, (emp.status === "Active" || emp.status === "active") ? "inactive" : "active")}
                        color="emerald"
                        title={(emp.status === "Active" || emp.status === "active") ? "Deactivate" : "Activate"}
                      >
                        {(emp.status === "Active" || emp.status === "active")
                          ? <FiCheckCircle size={16} className="text-emerald-500" />
                          : <FiMinusCircle size={16} className="text-amber-500" />}
                      </TblBtn>
                      <TblBtn onClick={() => setConfirmId(emp._id)} color="rose" title="Delete">
                        <FiTrash2 size={15} />
                      </TblBtn>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      {employees.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="font-black text-slate-800">{employees.length}</span> records
          </p>
        </div>
      )}
    </div>
  );
};

const TblBtn = ({ onClick, color, title, children }) => {
  const s = {
    blue:    "hover:bg-blue-50    hover:text-blue-600",
    amber:   "hover:bg-amber-50   hover:text-amber-600",
    emerald: "hover:bg-emerald-50 hover:text-emerald-600",
    rose:    "hover:bg-rose-50    hover:text-rose-600",
  };
  return (
    <button onClick={onClick} title={title}
      className={`p-2 rounded-xl text-slate-400 transition-all duration-150 ${s[color]}`}>
      {children}
    </button>
  );
};

export default EmployeeTable;
