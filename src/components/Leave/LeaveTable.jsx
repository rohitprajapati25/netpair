const LeaveTable = () => {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-400 soverflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Employee</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">From</th>
            <th className="px-4 py-3">To</th>
            <th className="px-4 py-3">Days</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-t  border-gray-400 hover:bg-gray-50">
            <td className="px-4 py-3">Rohit Prajapati</td>
            <td className="px-4 py-3">Casual</td>
            <td className="px-4 py-3">12‑02‑2026</td>
            <td className="px-4 py-3">14‑02‑2026</td>
            <td className="px-4 py-3">3</td>
            <td className="px-4 py-3 text-yellow-600 font-semibold">
              Pending
            </td>
            <td className="px-4 py-3 flex gap-2 justify-center">
              <button className="px-3 py-1 bg-green-600 text-white rounded">
                Approve
              </button>
              <button className="px-3 py-1 bg-red-600 text-white rounded">
                Reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;
