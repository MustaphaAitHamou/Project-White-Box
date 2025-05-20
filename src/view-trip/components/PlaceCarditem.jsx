// PlaceCarditem.jsx
import React from 'react';
import { Button } from '~/components/ui/button';
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

export default function PlaceCarditem({ placeName, details, timeToTravel }) {
  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+placeName} target='_blank'>
    <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
      <img
        src='/placeholder.png'
        alt={placeName}
        className='w-[130px] h-[130px] rounded-xl'
      />
      <div>
        <h2 className="font-bold text-lg">{placeName}</h2>
        <h2 className="text-sm text-gray-400">{details}</h2>
        <h2 className="mt-2">🕙{timeToTravel}</h2>
        <Button size='sm'><FaMapLocationDot/></Button>
      </div>
    </div>
    </Link>
  );
}
