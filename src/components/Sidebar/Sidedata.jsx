
import { NavLink } from 'react-router-dom'
import React, { useState } from 'react';

const Sidedata = (props) => {
    const [collapsed, setCollapsed] = useState(false);
  
  return (
    
      <NavLink to={props.navpath} >
                 <div
            className={`h-12 flex items-center p-2 rounded
            hover:bg-gray-100 
            ${props.coll ? "justify-center" : "gap-3"}`}
          >
            <div className='text-2xl'>
              <i className={props.icon}></i>

            </div>
            {!props.coll && <p className="text-lg">{props.data}</p>}
          </div>
      </NavLink>
    
  )
}

export default Sidedata
