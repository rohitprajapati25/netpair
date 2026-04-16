

// import React from "react";

// const AuthLayout = ({ children }) => {
//   console.log(children);
  
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
      
//         <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-10 py-16 ">
          
     
//           <img
//             src="/src/assets/imgs/logo.png"
//             alt="Company Logo"
//             className="h-16 mb-8"
//           />

         
//           <div className="w-full overflow-y-auto max-h-[448px] pr-2">
//             {children}
//           </div>
//         </div>

//         <div className="hidden md:block md:w-1/2">
//           <img
//             src="/src/assets/imgs/img1.jpg"
//             alt="Auth Illustration"
//             className="h-full w-full object-fill"
//           />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AuthLayout;



import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-8 font-sans">
      <div className="flex w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden min-h-[700px]">
        
        {/* Form Side */}
        <div className="w-full md:w-1/2 flex flex-col px-8 md:px-16 py-12 justify-center">
          <div className="mb-10">
            <img src="https://res.cloudinary.com/dzaoze4gr/image/upload/v1776312639/logo_wnnnq6.png" alt="Logo" className="h-12 w-auto object-contain" />
          </div>

          <div className="w-full overflow-y-auto pr-1 custom-scrollbar">
            {children}
          </div>
        </div>

        {/* Image Side */}
        <div className="hidden md:block md:w-1/2 relative p-6">
          <div className="h-full w-full rounded-[2rem] overflow-hidden relative group">
            <img src="https://res.cloudinary.com/dzaoze4gr/image/upload/q_auto/f_auto/v1776312064/img1_plksxc.jpg" alt="Auth" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent flex flex-col justify-end p-12">
              <h3 className="text-3xl font-bold text-white mb-2 text-shadow">Internal Management System</h3>
              <p className="text-blue-50/90 font-medium">Efficiently manage your workspace and employees with precision.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;