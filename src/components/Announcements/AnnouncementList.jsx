const AnnouncementList = ({ data, onSelect, onDelete }) => {
  if (!data.length)
    return <p className="text-gray-400">No announcements yet.</p>;

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

      {data.map((a) => (
        <div
          key={a.id}
          onClick={() => onSelect(a)}
          className="bg-white p-5 rounded-2xl border shadow-sm
          hover:shadow-xl cursor-pointer transition">

          <div className="flex justify-between">
            <h3 className="font-semibold line-clamp-1">{a.title}</h3>

            <i
              onClick={(e)=>{
                e.stopPropagation();
                onDelete(a.id);
              }}
              className="ri-delete-bin-line text-red-500"
            ></i>
          </div>

          <p className="text-gray-600 mt-2 line-clamp-3">
            {a.msg}
          </p>

          <div className="text-xs text-gray-400 mt-4 flex justify-between">
            <span>{a.date}</span>
            <span>{a.time}</span>
          </div>

        </div>
      ))}

    </div>
  );
};

export default AnnouncementList;