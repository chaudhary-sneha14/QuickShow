import { StarIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../Context/AppContext'

const MovieCard = ({movie}) => {

  const{image_base_url}=useAppContext()
    
    const navigate=useNavigate()
  return (
    <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl 
    hover:-translate-y-1 transition duration-300 w-66'>
      <img onClick={()=>{navigate(`/movies/${movie._id}`);scrollTo(0,0)}}
      src={image_base_url + movie.backdrop_path} alt=""  className="w-full h-44 rounded-lg cursor-pointer object-cover object-center"/>

      <p className='font-semibold mt-2 truncate'>{movie.title}</p>

      <p className='text-sm text-gray-400 mt-2'>{new Date(movie.release_date).getFullYear()} • 
        {movie.genres.slice(0,2).map(genre=>genre.name).join(" | ")}•{timeFormat(movie.runtime)}
      </p>

      <div className='flex items-center justify-between mt-4 pb-3'>
        <button onClick={()=>{navigate(`/movies/${movie._id}`),scrollTo(0,0)}}
        className="bg-primary hover:bg-primary-dull text-white text-sm px-4 py-2 font-medium cursor-pointer transition rounded-full">
            Buy Tickets
          </button>
        <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
            <StarIcon className='w-4 h-4 text-primary fill-primary'/> {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </div>

  
  )
}

export default MovieCard
