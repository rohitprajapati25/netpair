import React from "react";
import Card from "../../components/Asset/Card";

const Asset = () => {
  const data = [
  {
    title: "Total Assets",
    tot: "100",
    bg: "from-indigo-500 to-blue-600"
  },
  {
    title: "Assigned",
    tot: "50",
    bg: "from-emerald-500 to-green-600"
  },
  {
    title: "Available",
    tot: "50",
    bg: "from-amber-400 to-orange-500"
  },
  {
    title: "Damaged",
    tot: "10",
    bg: "from-rose-500 to-red-600"
  },
];

  return (
    <div
      className="relative h-full m-1 p-6
      bg-gradient-to-br from-slate-50 to-gray-100
      flex flex-col gap-6 overflow-y-auto rounded-2xl"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold">
          Asset Management
        </h2>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <i className="ri-add-line text-lg"></i>
          Add Asset
        </button>
      </div>

      <div className="grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-4
  gap-5
  w-full
  p-3 gap-5">
        {data.map((d, i) => (
          <Card key={i} title={d.title} tot={d.tot} bg={d.bg}/>
        ))}
      </div>

      <div
        className="bg-white rounded-2xl
        border border-gray-200 shadow-sm
        overflow-x-auto"
      >
        <table className="w-full min-w-[850px]">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Asset ID</th>
              <th className="px-6 py-4 text-left font-semibold">Asset Name</th>
              <th className="px-6 py-4 text-center font-semibold">Category</th>
              <th className="px-6 py-4 text-center font-semibold">Assigned To</th>
              <th className="px-6 py-4 text-center font-semibold">Status</th>
              <th className="px-6 py-4 text-center font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {[1, 2].map((_, i) => (
              <tr
                key={i}
                className="border-t hover:bg-blue-50/40 transition"
              >
                <td className="px-6 py-4 font-medium">AST-101</td>
                <td className="px-6 py-4">Laptop</td>
                <td className="px-6 py-4 text-center">IT Asset</td>
                <td className="px-6 py-4 text-center">Rohit</td>

                <td className="px-6 py-4 text-center">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold
                    bg-green-100 text-green-700"
                  >
                    Assigned
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-4 text-lg">
                    <i className="ri-edit-2-line cursor-pointer text-blue-600 hover:scale-110 transition"></i>
                    <i className="ri-refresh-line cursor-pointer text-orange-600 hover:scale-110 transition"></i>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Asset;