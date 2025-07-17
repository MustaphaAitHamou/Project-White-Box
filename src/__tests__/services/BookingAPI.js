/* ------------------------------------------------------------------
   Wrapper Booking.com (RapidAPI)
------------------------------------------------------------------- */
import axios from 'axios'
import { throttle } from './throttle'

const KEY  = import.meta.env.VITE_RAPIDAPI_KEY
const HOST = import.meta.env.VITE_RAPIDAPI_HOST_BOOKING || 'booking-com.p.rapidapi.com'

if (!KEY)  throw new Error('VITE_RAPIDAPI_KEY manquant dans .env')
if (!HOST) throw new Error('VITE_RAPIDAPI_HOST_BOOKING manquant dans .env')

const api = axios.create({
  baseURL: `https://${HOST}`,
  headers: { 'X-RapidAPI-Key': KEY, 'X-RapidAPI-Host': HOST },
})

/* ─ Destination id + type ────────────────────────────────────────── */
export async function getDestination(city, locale = 'fr') {
  await throttle()
  const { data } = await api.get('/v1/hotels/locations', {
    params: { name: city, locale },
  })
  return Array.isArray(data) && data.length ? data[0] : null
}

/* ─ Liste hôtels pour cette destination ─────────────────────────── */
export async function getHotels(dest, rows = 8, locale = 'fr') {
  if (!dest) return []
  await throttle()

  const today    = new Date()
  const tomorrow = new Date(Date.now() + 864e5)
  const fmt      = (d) => d.toISOString().split('T')[0]

  const { data } = await api.get('/v1/hotels/search', {
    params: {
      dest_id            : dest.dest_id,
      dest_type          : dest.dest_type,
      checkin_date       : fmt(today),
      checkout_date      : fmt(tomorrow),
      adults_number      : 1,
      room_number        : 1,
      rows,
      locale,
      order_by           : 'popularity',
      filter_by_currency : 'EUR',
    },
  })

  return (data?.result ?? []).map((p) => ({
    name      : p.hotel_name,
    address   : p.address,
    rating    : p.review_score ? (p.review_score / 2).toFixed(1) : '',
    price     : p.min_total_price,
    currency  : p.currencycode,
    image     : p.main_photo_url?.replace('square60', 'max500'),
    latitude  : p.latitude,
    longitude : p.longitude,
  }))
}
