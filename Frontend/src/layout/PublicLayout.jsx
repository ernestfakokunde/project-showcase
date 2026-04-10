 import React from 'react'
 import { Outlet } from 'react-router-dom'
 
 const PublicLayout = () => {
   return (
     <div className='bg-[#09090e] min-h-screen'> 
          <Outlet/>
     </div>
   )
 }
 
 export default PublicLayout