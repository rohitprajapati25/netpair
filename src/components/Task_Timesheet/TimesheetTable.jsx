const TimesheetTable = ({ data }) => (
  <div className="bg-white rounded-xl shadow p-4 overflow-x-auto w-full border-2 border-gray-400">
    <table className="w-full h-auto rounded-xl">
      <thead className="bg-gray-100 border-b ">
        <tr className="text-left">
          <th className="p-3">Employee</th><th>Task</th><th>Date</th><th>Hours</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map(t=>(
          <tr key={t.id} className="border-b text-center text-left hover:bg-gray-50">
            <td className="p-3 font-semibold">{t.employee}</td>
            <td>{t.task}</td>
            <td>{t.date}</td>
            <td>{t.hours}</td>
            <td className={t.status==="Completed"?"text-green-600":"text-blue-600"}>
              {t.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TimesheetTable;
