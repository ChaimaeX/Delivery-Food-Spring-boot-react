import React from 'react'

export const CarouselItem = ({ image, title }) => {
  return (
    <div className='flex flex-col justify-center items-center'>
        <img
          className='w-[8rem] h-[8rem] sm:w-[10rem] sm:h-[10rem] lg:w-[14rem] lg:h-[14rem] rounded-full object-cover object-center'
          src={image}
          alt={title}
        />
        <span className='py-3 text-lg sm:text-xl lg:text-2xl font-semibold text-gray-300'>
          {title}
        </span>
    </div>
  )
}
