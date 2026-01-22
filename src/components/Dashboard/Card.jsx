import React from 'react'

const Card = (props) => {
  return (
    <div className='bg-white border-2 p-5 border-gray-400 rounded-xl h-30 w-75 gap-2 flex items-center justify-around'>
      <i className={props.icon}></i>
      <div className='w-50'>
      <span className='font-bold text-4xl'>{props.num}</span><br />
      <span className='text-[15px] font-semibold text-gray-800 '>{props.tot}</span>
      </div>
    </div>
  )
}

export default Card
