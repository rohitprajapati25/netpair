const AnnouncementModal = ({ data, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl max-w-lg w-[90%]"
        onClick={(e)=>e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="float-right text-lg">✕</button>

        <h2 className="text-xl font-bold mb-3">{data.title}</h2>

        <p className="text-gray-700 whitespace-pre-wrap mb-4">
          {data.msg}
        </p>

        <div className="text-sm text-gray-400">
          {data.date} • {data.time}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;