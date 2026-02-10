import React, { useState } from "react";

const Announcements = () => {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");

  const addAnnouncement = () => {
    if (!title || !msg) return;

    setList([
      ...list,
      {
        id: Date.now(),
        title,
        msg,
        date: new Date().toLocaleDateString(),
      },
    ]);

    setTitle("");
    setMsg("");
  };

  const deleteAnnouncement = (id) => {
    setList(list.filter((a) => a.id !== id));
  };

  return (
    <div className="relative h-[100%] m-1 pb-10 pt-5 w-auto bg-white p-6 flex flex-col items-start justify-strat gap-3 min-h-full overflow-y-auto rounded-xl">
      <h1 className="text-2xl font-semibold mb-6">Announcements</h1>

      <div className="bg-white p-4 rounded-xl shadow mb-6 border-2 border-gray-400                                                                                                                                  ">
        <input
          className="border-2 border-gray-400 p-2 w-full mb-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border-2 border-gray-400 p-2 w-full mb-2 rounded"
          placeholder="Message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />

        <button
          onClick={addAnnouncement}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

     <div className="h-[50%] flex items-start justify-center gap-5 overflow-y-auto flex-wrap">
      <div className="w-full">
      </div>
       {list.map((a) => (
        <div
          key={a.id}
          className="bg-white p-4 rounded-xl w-100 shadow mb-3 flex justify-between border-2 border-gray-400"
        >
          <div>
            <h2 className="font-semibold">{a.title}</h2>
            <p className="text-gray-600">{a.msg}</p>
            <span className="text-sm text-gray-400">{a.date}</span>
          </div>

          <i
            onClick={() => deleteAnnouncement(a.id)}
            className="ri-delete-bin-6-line text-red-600 cursor-pointer"
          ></i>
        </div>
      ))}
     </div>
    </div>
  );
};

export default Announcements;
