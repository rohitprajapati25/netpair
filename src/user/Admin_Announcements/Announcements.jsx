// import React, { useState } from "react";
// import AnnouncementForm from "../../components/Announcements/AnnouncementForm";
// import AnnouncementList from "../../components/Announcements/AnnouncementList";
// import AnnouncementModal from "../../components/Announcements/AnnouncementsModal";

// const Announcements = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [selected, setSelected] = useState(null);

//   const addAnnouncement = (data) => {
//     setAnnouncements((prev) => [
//       {
//         id: Date.now(),
//         ...data,
//         date: new Date().toLocaleDateString(),
//         time: new Date().toLocaleTimeString(),
//       },
//       ...prev,
//     ]);
//   };

//   const deleteAnnouncement = (id) => {
//     setAnnouncements((prev) => prev.filter(a => a.id !== id));
//     if (selected?.id === id) setSelected(null);
//   };

//   return (
//     <div className="relative h-full m-1 p-6
//       bg-gradient-to-br from-slate-50 to-gray-100
//       flex flex-col gap-6 overflow-y-auto rounded-2xl">

//       <h1 className="text-2xl font-semibold">Announcements</h1>

//       <AnnouncementForm onAdd={addAnnouncement} />

//       <AnnouncementList
//         data={announcements}
//         onSelect={setSelected}
//         onDelete={deleteAnnouncement}
//       />

//       {selected && (
//         <AnnouncementModal
//           data={selected}
//           onClose={() => setSelected(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default Announcements;
import React, { useState } from "react";
import AnnouncementForm from "../../components/Announcements/AnnouncementForm";
import AnnouncementList from "../../components/Announcements/AnnouncementList";
import AnnouncementModal from "../../components/Announcements/AnnouncementsModal";
import { RiMegaphoneLine } from "react-icons/ri";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selected, setSelected] = useState(null);

  const addAnnouncement = (values) => {
    const newEntry = {
      id: Date.now(),
      ...values, // title, msg, aur targetRole yahan se aayega
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setAnnouncements((prev) => [newEntry, ...prev]);
  };

  const deleteAnnouncement = (id) => {
    if(window.confirm("Delete this announcement?")) {
      setAnnouncements((prev) => prev.filter(a => a.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
          <RiMegaphoneLine size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Broadcast Center</h1>
          <p className="text-slate-500 font-medium text-sm">Target specific roles with updates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-4 sticky top-10">
          <AnnouncementForm onAdd={addAnnouncement} />
        </div>

        <div className="xl:col-span-8">
          <AnnouncementList
            data={announcements}
            onSelect={setSelected}
            onDelete={deleteAnnouncement}
          />
        </div>
      </div>

      {selected && (
        <AnnouncementModal data={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default Announcements;