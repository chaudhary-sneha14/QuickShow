import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import backgroundImage from '../assets/backgroundImage.png'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate=useNavigate();

  return (
    <div  className="flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover
     bg-center h-screen" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <img src={assets.marvelLogo} className='max-h-11 lg:h-11 mt-20' alt="" />
        <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold
        max-w-110'>Guardians <br /> of the Galaxy</h1>

        <div className='flex items-center gap-4 text-gray-300'>
            <span>Action | Adventure | Sci-Fi</span>

            <div className='flex items-center gap-1'>
                <CalendarIcon className='w-4.5 h-4.5'/>2018
            </div>
            <div className='flex items-center gap-1'>
                <ClockIcon className='w-4.5 h-4.5'/>2h8m
            </div>
        </div>
        <p className='max-w-md text-gray-300'> In a post-apocalyptic world where cities ride on wheels and consume each
             other to survive, two people meet in London and try to stop a conspiracy</p>

             <button onClick={()=>navigate('/movies')}
              className='flex w-fit rounded-full px-5 py-2 gap-2 hover:bg-primary-dull bg-primary'>
                Explore Movies <ArrowRight className='w-5 h-5'/></button>
      
    </div>
  )
}

export default Hero
