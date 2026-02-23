import React from 'react'

const AnnouncementsModal = ({onClose}) => {
  return (
    <div>
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <div
            className="bg-white w-[90%] max-w-lg rounded-xl p-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
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
      
    </div>
  )
}

export default AnnouncementsModal
