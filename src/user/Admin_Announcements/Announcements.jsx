import React, { useState } from "react";
import AnnouncementForm from "../../components/Announcements/AnnouncementForm";
import AnnouncementList from "../../components/Announcements/AnnouncementList";
import AnnouncementModal from "../../components/Announcements/AnnouncementsModal";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selected, setSelected] = useState(null);

  const addAnnouncement = (data) => {
    setAnnouncements((prev) => [
      {
        id: Date.now(),
        ...data,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter(a => a.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="relative h-full m-1 p-6
      bg-gradient-to-br from-slate-50 to-gray-100
      flex flex-col gap-6 overflow-y-auto rounded-2xl">

      <h1 className="text-2xl font-semibold">Announcements</h1>

      <AnnouncementForm onAdd={addAnnouncement} />

      <AnnouncementList
        data={announcements}
        onSelect={setSelected}
        onDelete={deleteAnnouncement}
      />

      {selected && (
        <AnnouncementModal
          data={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default Announcements;