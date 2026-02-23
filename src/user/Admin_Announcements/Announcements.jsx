import React, { useState } from "react";

const Announcements = () => {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [selected, setSelected] = useState(null);

  const addAnnouncement = () => {
    if (!title.trim() || !msg.trim()) return;

    setList([
      ...list,
      {
        id: Date.now(),
        title,
        msg,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      },
    ]);

    setTitle("");
    setMsg("");
  };

  const deleteAnnouncement = (id) => {
    setList(list.filter((a) => a.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="relative h-full m-1 pb-10 pt-5 w-auto bg-white p-6 flex flex-col gap-3 overflow-y-auto rounded-xl">
      <h1 className="text-2xl font-semibold mb-6">Announcements</h1>

      <div className="bg-white p-4 rounded-xl shadow mb-6 border-2 border-gray-400">
        <input
          className="border-2 border-gray-400 p-2 w-full mb-2 rounded"
          placeholder="Announcement title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border-2 border-gray-400 p-2 w-full mb-2 rounded resize-none"
          placeholder="Write your announcement message here..."
          rows={4}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />

        <button
          onClick={addAnnouncement}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          Add
        </button>
      </div>

      <div className="h-[50%] w-full p-5 flex items-start justify-center gap-5 overflow-y-auto flex-wrap border-2 border-gray-400 rounded-2xl">
        {list.length === 0 && (
          <p className="text-gray-400 text-center w-full font-2xl">
            No announcements yet.
          </p>
        )}

        {list.map((a) => (
          <div
            key={a.id}
            onClick={() => setSelected(a)}
            className="bg-white p-4 rounded-xl w-80 shadow mb-3 flex items-start justify-between border-2 border-gray-400 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition"
          >
            <div className="flex-1 overflow-hidden">
              <h2 className="font-semibold line-clamp-1 break-words">
                {a.title}
              </h2>

              <p className="text-gray-600 line-clamp-2 break-words">
                {a.msg}
              </p>

              <span className="text-xs text-blue-600 block mt-1">
                Click to read full message
              </span>

              <div className="text-sm text-gray-500 mt-1">
                <span>{a.date}</span> · <span>{a.time}</span>
              </div>
            </div>

            <i
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Delete this announcement?")) {
                  deleteAnnouncement(a.id);
                }
              }}
              className="ri-delete-bin-6-line text-red-600 cursor-pointer text-lg"
            ></i>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white w-[90%] max-w-lg rounded-xl p-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-3 text-xl text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-2 break-words">
              {selected.title}
            </h2>

            <p className="text-gray-700 whitespace-pre-wrap break-words max-h-[60vh] overflow-y-auto mb-4">
              {selected.msg}
            </p>

            <div className="text-sm text-gray-500 flex gap-3">
              <span>{selected.date}</span>
              <span>{selected.time}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
