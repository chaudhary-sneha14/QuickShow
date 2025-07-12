import React from 'react'
import AdminNavbar from '../../Component/Admin/AdminNavbar'
import AdminSideBar from '../../Component/Admin/AdminSideBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
    <AdminNavbar/>

    <div className='flex'>
        <AdminSideBar/>
        <div className='flex-1 py-10 px-4 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
            <Outlet/>
        </div>
    </div>
    </>
  )
}

export default Layout
