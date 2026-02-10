import React from 'react'

const Card = (props) => {
  return (
    <div className=''>
      <div className='w-auto border-2 text-center border-gray-400 rounded-xl p-4'>
      <span className='font-bold text-xl'>{props.title}</span><br />
      <span className='text-[15px] font-semibold text-black'>{props.tot}</span>
      </div>
    </div>
  )
}

export default Card
