import React from 'react'
import Card from '../../components/Asset/Card'

const Asset = () => {
  const data = [{
    title: 'Total Assets',
    tot: '100'
  }, {
    title: 'Assigned',
    tot: '50'
  },{
    title: 'Available',
    tot: '50'
  },{
    title: 'Damaged',
    tot: '10'
  }]
  return (
    <div className='relative h-[100%] m-1 pb-10 p-5 w-auto bg-white flex flex-col items-start justify-strat gap-3 min-h-full overflow-y-auto rounded-xl'>
    <h2 className="text-2xl font-semibold mb-6">Asset Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((d,i)=>(
        <Card key={i} title={d.title} tot={d.tot}/>
      ))}
    </div>
<div className="bg-white rounded-xl shadow p-5 w-full mt-5 border-2 border-gray-400">
    <div className="flex justify-between mb-4">
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
      + Add Asset
    </button>
  </div>

  <div className="overflow-x-auto rounded-lg">
    <table className="w-full text-left">
      <thead className="bg-gray-100 border-b">
        <tr>
          <th className="p-3 ">Asset ID</th>
          <th className="p-3 ">Asset Name</th>
          <th className="p-3 ">Category</th>
          <th className="p-3 ">Assigned To</th>
          <th className="p-3 ">Status</th>
          <th className="p-3 ">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr className="hover:bg-gray-50 border-b">
          <td className="p-3 ">AST-101</td>
          <td className="p-3 ">Laptop</td>
          <td className="p-3 ">IT Asset</td>
          <td className="p-3 ">Rohit</td>
          <td className="p-3  text-green-600 font-semibold">Assigned</td>
          <td className="p-3  flex gap-4">
            <i className="ri-edit-2-line cursor-pointer text-blue-600"></i>
            <i className="ri-refresh-line cursor-pointer text-orange-600"></i>
          </td>
        </tr>
        <tr className="hover:bg-gray-50 border-b">
          <td className="p-3 ">AST-101</td>
          <td className="p-3 ">Laptop</td>
          <td className="p-3 ">IT Asset</td>
          <td className="p-3 ">Rohit</td>
          <td className="p-3  text-green-600 font-semibold">Assigned</td>
          <td className="p-3  flex gap-4">
            <i className="ri-edit-2-line cursor-pointer text-blue-600"></i>
            <i className="ri-refresh-line cursor-pointer text-orange-600"></i>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

    </div>
  )
}

export default Asset
