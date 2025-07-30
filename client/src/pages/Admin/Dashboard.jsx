import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UserIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import Loading from '../../Component/Loading'
import Title from './Title'
import BlurCircle from '../../Component/BlurCircle'
import timeFormat from '../../lib/timeFormat'
import { useAppContext } from '../../Context/AppContext'
import toast from 'react-hot-toast'



const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY

  const{axios,getToken,user,image_base_url}=useAppContext()

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0
  })

  const [loading, setLoading] = useState(true)

  const dashboardCards = [
    {
      title: 'Total Bookings',
      value: dashboardData.totalBookings || '0',
      icon: ChartLineIcon
    },
    {
      title: 'Total Revenue',
      value: `${currency}${dashboardData.totalRevenue || '0'}`,
      icon: CircleDollarSignIcon
    },
    {
      title: 'Active Shows',
      value: dashboardData.activeShows?.length || '0',
      icon: PlayCircleIcon
    },
    {
      title: 'Total Users',
      value: dashboardData.totalUser || '0',
      icon: UserIcon
    }
  ]

  const fetchDashboardData =async()=>{
    try {
      const {data}= await axios.get("/api/admin/dashboard",{headers:{Authorization:`Bearer ${await getToken()}`}})
      if(data.success){
        setDashboardData(data.dashboardData)
        setLoading(false)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error("error in fetching dashboarddata",error)
      
    }
  };

  useEffect(()=>{
    if(user){
    fetchDashboardData()}
  },[user])

  return !loading ?(
<>
    <Title text1="Admin" text2="Dashboard"/>

    <div className='relative flex flex-wrap gap-4 mt-6'>
      <BlurCircle top='-100px' left='0px'/>
      <div className='flex flex-wrap gap-4 w-full'>
        {dashboardCards.map((card,index)=>(
          <div key={index} className='flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20
           rounded-md max-w-50 w-full'>
            <div>
              <h1 className='text-sm'>{card.title}</h1>
              <p className=' text-xl font-medium mt-1'>{card.value}</p>
            </div>
            <card.icon className='w-6 h-6'/>
           </div>
        ))}
      </div>
    </div>

    {/* Active Shows Section */}
<p className="mt-10 text-lg font-medium text-white">Active Shows</p>

<div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
  <BlurCircle top="100px" left="-10%" />

  {dashboardData.activeShows.map((show) => (
   <div
  key={show._id}
  className="flex flex-col justify-between p-3 bg-primary/10 rounded-2xl hover:-translate-y-1 transition duration-300 w-60"
>
  {/* Poster Image */}
  <div className="aspect-[2/3] w-full rounded-lg overflow-hidden cursor-pointer">
  <img
    src={image_base_url + show.movie.poster_path}
    alt={show.movie.title}
    className="w-full h-full object-cover object-center"
  />
</div>

  {/* Movie Title */}
  <p className="font-semibold mt-2 text-white truncate">
    {show.movie.title}
  </p>

  {/* Release year • Genres • Runtime */}
  <p className="text-sm text-gray-400 mt-2">
    {new Date(show.movie.release_date).getFullYear()} •{" "}
    {show.movie.genres?.slice(0, 2).map((genre) => genre.name).join(" | ")} •{" "}
    {timeFormat(show.movie.runtime)}
  </p>

  {/* Price + Rating Row */}
  <div className="flex items-center justify-between mt-4 pb-3">
    <p className="text-sm text-white font-medium">
      ₹{show.showPrice}
    </p>

    <p className="flex items-center gap-1 text-sm text-gray-400">
      <StarIcon className="w-4 h-4 text-primary fill-primary" />
      {show.vote_average?.toFixed(1)}
    </p>
  </div>
</div>

  ))}
</div>



    </>
  ):(
    <Loading/>
  )
}

export default Dashboard
