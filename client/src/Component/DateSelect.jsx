import React, { useState } from 'react'
import BlurCircle from './BlurCircle'
import { ChevronLastIcon, ChevronRightIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const DateSelect = ({id,dateTime}) => {

    const navigate=useNavigate();

    const [selected,setSelected]=useState(null)

    const onBookHandler =()=>{
        if(!selected){
            return toast ('Please select a Date')
        }
        navigate(`/movies/${id}/${selected}`)
        scrollTo(0,0);

    }
  return (  
    <div id='dateSelect' className='pt-30'> 
    <div className='flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 
    bg-primary/10 border border-primary/20 rounded-lg'>
        <BlurCircle top='100px' left='100px'/>
        <BlurCircle top='100px' left='0px'/>
        <div>
            <p className='text-lg font-semibold'>Choose Data</p>
            <div className='flex items-center gap-6 text-sm mt-5'>
                <ChevronLastIcon width={28}/>
                <span className='grid grid-cols3 md:flex flex-wrap md:max-w-lg gap-4'>
                    {Object.keys(dateTime).map((date)=>(

                        <button onClick={()=>setSelected(date)} className={`flex items-center flex-col justify-center h-14 w-14 aspect-square rounded
                        cursor-pointer ${selected===date? "bg-primary text-white":"border border-primary/70"}`}>
                            <span>{new Date(date).getDate()}</span>
                            <span>{new Date(date).toLocaleDateString("en-US",{month:"short"})}</span>
                        </button>
                        
                    ))}
                </span>
                <ChevronRightIcon width={28}/>
            </div>
        </div>
        <button onClick={onBookHandler} className='flex items-center gap-2 px-7 py-3 text-sm bg-primary 
            hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95'>Book Now</button>
    </div>
      
    </div>
  )
}

export default DateSelect
