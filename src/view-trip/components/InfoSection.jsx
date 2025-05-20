import React from 'react'
import { Button } from '~/components/ui/button'
import {IoIosSend} from "react-icons/io"

function InfoSection({trip}) {
    return (
    <div>
        <img src='/placeholder.png' className='h-[480px] w-full object-cover rounded'/>

        <div className='flex justify-between items-center'>
            <div className='my-5 flex flex-col gap-2'>
                <h2 className='font-bold text2xl'>{trip?.userSelection?.location?.label}</h2>
                <div className='flex gap-5'>
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>📆{trip.userSelection?.noOfDays} Jour</h2>
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>💰Budget {trip.userSelection?.budget}</h2>
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🤜🏻🤛🏻Nombre de voyageurs : {trip.userSelection?.traveler}</h2>
                </div>
            </div>   
            <Button><IoIosSend/></Button> 
        </div>   
    </div>
    )
}

export default InfoSection