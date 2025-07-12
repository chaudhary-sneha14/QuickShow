import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets'
import Loading from '../Component/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../Component/BlurCircle'
import toast from 'react-hot-toast'

const SeatLayout = () => {

  const groupRows=[["A","B"],["C","D"],["E","F"],["G","H"],["I","J"]];

  const {id,date}=useParams()
  const[selectedSeat,setSelectedSeats]=useState([])
  const[selectedTime,setSelectedTime]=useState(null)
  const [show,setShow]=useState(null)

  const navigate=useNavigate()

  const getShow = async()=>{
    const show=dummyShowsData.find(show=>show._id===id)
    if(show){
      setShow({
        movie:show,
        dateTime:dummyDateTimeData
      })
    }
  }


const handleSeatClick = (seatId)=>{
  if(!selectedTime){
    return toast("Please select Time first")
  }

  if(!selectedSeat.includes(seatId)&& selectedSeat.length>4){
    return toast("You can select 5 seats")
  }

  setSelectedSeats(prev=>prev.includes(seatId) ? prev.filter(seat=> seat!== seatId):[...prev,seatId])  //if seat already select unselect it otherwise add it in the array
}


  const renderSeats=(row,count=8)=>{
    return(
    <div key={row} className='flex gap-2 mt-2'>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {Array.from({length:count},(_,i)=>{
          const seatId=`${row}${i+1}`;  //seatid=A1
          return(
            <button key={seatId} onClick={()=>handleSeatClick(seatId)}
            className={`h-8 w-8 rounded border border-rimary/60 cursor-pointer ${selectedSeat.includes(seatId) &&
              "bg-primary text-white"
            }`}>{seatId}</button>
          )
        })}
      </div>
    </div>
    )
  }

  useEffect(()=>{getShow()},[])

  return show? (
    <div className='flex flex-co md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      {/* Availabel Timing */}

      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
      <p className='text-lg font-semibold px-6'>Available Timings</p>

      <div  className='mt-5 space-y-1'>{show.dateTime[date].map((item)=>(
        <div key={item.time} onClick={()=> setSelectedTime(item)}
         className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition 
        ${selectedTime?.time === item.time ? "bg-primary text-white": "hover:bg-primary/20"}`}>
          <ClockIcon className='w-4 h-4'/>
          <p className='text-sm'>{isoTimeFormat(item.time)}</p>
        </div>
      ))}
      </div>
      </div>


      {/* Seat Layout  */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top='-100px' left='100px'/>
        <BlurCircle top='0' right='0'/>
        <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
        <img src={assets.screenImage} alt="" />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>


        <div className='flex flex-col items-center mt-10 text-xs text-gray-300 '>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6 '>
            {groupRows[0].map(row=> renderSeats(row))}
          </div>

        <div className='grid grid-cols-2 gap-11 '>
          {groupRows.slice(1).map((group,idx)=>(
            <div key={idx}>
              { group.map(row=>renderSeats(row))}
            </div>
          ))}
          </div>
        </div>


        <button onClick={()=>navigate('/my-booking')} className='flex items-center  mt-10 gap-2 px-7 py-3 text-sm bg-primary 
            hover:bg-primary-dull transition rounded-xl font-medium cursor-pointer active:scale-95'>
              Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className='w-4 h-4'/>
        </button>
      </div>
      
    </div>
  ):(
    <Loading/>
  )
}

export default SeatLayout
