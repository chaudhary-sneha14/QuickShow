import { assets } from '../../assets/assets'
import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const AdminSideBar = () => {

    const user={
        firstName:'Admin',
        lastName:'User',
        imageUrl: assets.profile,
    }

    const adminNavlinks = [
        {name:'DashBoard',path:'/admin', icon:LayoutDashboardIcon},
        {name:'Add-shows',path:'/admin/add-shows', icon:PlusSquareIcon},
        {name:'List shows',path:'/admin/list-shows', icon:ListIcon},
        {name:'List Booking',path:'/admin/list-bookings', icon:ListCollapseIcon},
    ]
  return (
    <div className='h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm'>
        <img className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto' src={user.imageUrl} alt="" />
        <p className='mt-2 text-base max-md:hidden'>{user.firstName} {user.lastName}</p>
        <div className='w-full'>{adminNavlinks.map((link,index)=>(
            <NavLink key={index} to={link.path} end className={({isActive})=>` relative flex items-center max-md:justify-center gap-2 w-full
            py-2.5 px-6 min-md:pl-10 first:mt-6 text-gray-400 ${isActive &&  'bg-primary/15 text-primary group'}`}>

                {({isActive})=>(
                    <>
                    <link.icon className='w-5 h-5'/>
                    <p className='max-md:hidden'>{link.name}</p>
                    <span className={`w-1.5 h-10 rounded-l right-0 absolute transition-all duration-300
                         ${isActive &&'bg-primary'}`}></span>
            
                    </>
                )}
            </NavLink>
            
        ))}</div>
    </div>
  )
}

export default AdminSideBar
