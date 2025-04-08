import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
      <h1 className='font-extrabold text-[50px] text-center mt-16'>
        <span className='text-[#f56551]'>Le monde</span> n'attend que vous
      <p className='text-xl text-gray-500 text-center'>Votre plannificateur de voyage boosté à l'IA</p>
      </h1>

      <Link to={'/create-trip'}>
        <Button> C'est parti c'est gratuit </Button>
      </Link>
    </div>
  )
}

export default Hero
