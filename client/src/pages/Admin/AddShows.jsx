import React, { useEffect, useState } from 'react'
import Title from './Title'
import Loading from '../../Component/Loading'
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react'
import { kConverter } from '../../lib/kConvertor'
import { useAppContext } from '../../Context/AppContext'
import toast from 'react-hot-toast'

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY

  const {axios,getToken,user,image_base_url}=useAppContext()

  const [loading, setLoading] = useState(true)
  const [nowPlayingMovies, setNowPlayingMovies] = useState([])
  const [selectedMovies, setSelectedMovies] = useState(null)
  const [dateTimeSelection, setDateTimeSelection] = useState({})
  const [dateTimeInput, setDateTimeInput] = useState("")
  const [showPrice, setShowPrice] = useState("")
  const[addingShow,setAddingShow]=useState(false)

  
  const fetchNowPlayingMovies = async () => {
   try {
    const{data}=await axios.get('/api/show/now-playing',{
      headers:{Authorization:`Bearer ${await getToken()}`}
    })
     if(data.success){
        setNowPlayingMovies(data.movies)
      }
   } catch (error) {
    console.log(error);
    
   }
    setLoading(false)
  }

  const handleDateTimeAdd =()=>{
    if(!dateTimeInput) return;
    const  [date,time]= dateTimeInput.split("T");
    if(!date || !time) return;

    setDateTimeSelection((prev)=>{
        const times= prev[date]||[];
        if(!times.includes(time)){
            return {...prev,[date]:[...times,time]};
        }
        return prev;
    })
  }

  const handleRemoveTime=(date,time)=>{
    setDateTimeSelection((prev)=>{
        const filteredTimes =prev[date].filter((t)=> t!==time);
        if(filteredTimes.length===0){
            const {[date]: _, ...rest}=prev;
            return rest;
        }
        return {
            ...prev,
            [date]:filteredTimes,
        }

        })
  }

  const handleSubmit=async()=>{
   
    try {
      setAddingShow(true)

      if(!selectedMovies || Object.keys(dateTimeSelection).length===0||!showPrice){
       return toast("Missing required field")
      }

    const showInput = Object.entries(dateTimeSelection).map(([date,times]) => (
  { date, time:times }
))


      const payload={
        movieId:selectedMovies,
        showInput,
        showPrice:Number(showPrice)
      }

      const {data}=await axios.post('/api/show/add',payload,{headers:{Authorization:`Bearer ${await getToken()}`}})

      if(data.success){
        toast.success(data.message)
        setSelectedMovies(null)
        setDateTimeSelection({})
        setShowPrice("")
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error("Please Try Again")
      
    }
    setAddingShow(false)
  }

  useEffect(() => {
    if(user){
    fetchNowPlayingMovies()
    }
  }, [user])

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />
      <p className="mt-10 text-lg font-medium text-white">Now Playing Movies</p>

      <div className="mt-4 flex flex-wrap gap-4">
        {nowPlayingMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => setSelectedMovies(movie.id)}
            className="flex flex-col justify-between bg-primary/10 rounded-2xl hover:-translate-y-1 transition duration-300 w-56 cursor-pointer"
          >
            {/* Image with Check Icon */}
           <div className="aspect-[3/4] w-full rounded-t-2xl overflow-hidden">
  <img
    src={image_base_url + movie.poster_path}
    alt={movie.title}
    className="w-full h-full object-cover object-center"
  />
</div>

            {/* Title & Release Date */}
            <div className="p-2">
              <p className="font-medium truncate text-white">{movie.title}</p>
              <p className="text-gray-400 text-sm">{movie.release_date}</p>
            </div>

            {/* Rating and Votes */}
            <div className="flex justify-between items-center px-2 pb-3 text-xs">
              <div className="flex items-center gap-1 text-gray-400">
                <StarIcon className="w-4 h-4 text-primary fill-primary" />
                <span>{movie.vote_average?.toFixed(1)}</span>
              </div>
              <span className="text-gray-400">{kConverter(movie.vote_count)} votes</span>
            </div>
         
                      {selectedMovies === movie.id && (
                <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                  <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              )}
               </div>
        ))}
      </div>

      {/* show price input */}

      <div className='mt-8'>
        <label className='block text-sm font-medium mb-2'>Show Price</label>
        <div className='inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md'>

            <p className='text-gray-400 text-sm'>{currency}</p>
            <input type="number" min={0} value={showPrice} onChange={(e)=>setShowPrice(e.target.value)}
            placeholder='"Enter Show price' className='outline-none' />
        </div>
      </div>

      {/* Date and time  */}

       <div className='mt-6'>
        <label className='block text-sm font-medium mb-2'>Select Date and Time</label>
        <div className='inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md'>

            <input type="datetime-local" value={dateTimeInput} onChange={(e)=>setDateTimeInput(e.target.value)}
           className='outline-none rounded-md' />

           <button className='px-10 py-3 text-sm bg-primary/80 hover:bg-primary-dull transition
            rounded-md font-medium cursor-pointer active:scale-95' onClick={handleDateTimeAdd}> Add Time</button>
        </div>
      </div>

      {/* display selected time  */}
      {
        Object.keys(dateTimeSelection).length>0 && (
            <div className='mt-6'>
                <h2 className='mb-2'>Selected Date-Time</h2>
                <ul className='space-y-3'>
                    {Object.entries(dateTimeSelection).map(([date,times])=>(
                        <li key={date}>
                            <div className='font-medium'>{date}</div>
                            <div className='flex flex-wrap gap-2 mt-1 text-sm'>{times.map((time)=>(
                                <div key={time} className='border border-primary px-2 py-1 flex items-center rounded'>
                                    <span>{time}</span>
                                    <DeleteIcon onClick={()=>handleRemoveTime(date,time)} width={15} 
                                    className='ml-2 text-red-500 hover:text-red-700'/>
                                </div>  
                            ))}</div>

                        </li>
                    ))}
                </ul>
            </div>
        )
      }

       <button onClick={handleSubmit} disabled={addingShow} className='px-10 py-3 text-sm mt-10 bg-primary hover:bg-primary-dull transition
            rounded-md font-medium cursor-pointer active:scale-95'>Add Show</button>
    </>
  ) : (
    <Loading />
  )
}

export default AddShows
