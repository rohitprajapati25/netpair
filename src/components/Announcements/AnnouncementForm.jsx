import React, { useState } from "react";

const AnnouncementForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");

  const submit = () => {
    if (!title.trim() || !msg.trim()) return;

    onAdd({ title, msg });
    setTitle("");
    setMsg("");
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow border">

      <input
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        placeholder="Announcement title"
        className="w-full border p-3 rounded-lg mb-3"
      />

      <textarea
        value={msg}
        onChange={(e)=>setMsg(e.target.value)}
        placeholder="Write message..."
        rows={4}
        className="w-full border p-3 rounded-lg mb-4 resize-none"
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
        + Add Announcement
      </button>

    </div>
  );
};

export default AnnouncementForm;