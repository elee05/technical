
import './App.css';
import "leaflet/dist/leaflet.css"
import {  Marker, Popup,  useMapEvents } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import { getSunrise, getSunset } from 'sunrise-sunset-js';





function LocationMarker( {sendDataToParent} ) {
  const [position, setPosition] = useState(null)
  const [placeName, setPlaceName] = useState('Boston, United States')
  const [sunsetTime, setSunsetTime] = useState('')
  const [ssTimeUTC, setSSTimeUTC] = useState('')
  const [sunriseTime, setSunriseTime]= useState('')
  const [srTimeUTC, setSRTimeUTC] = useState('')

  

  const markerRef = useRef(null)


 

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const sunset = getSunset(lat, lng);
      const sunrise = getSunrise(lat, lng)
      
      setPosition(e.latlng);
      setSunsetTime(sunset.toLocaleTimeString())
      setSunriseTime(sunrise.toLocaleTimeString())
      setSSTimeUTC(sunrise.toUTCString())
      setSRTimeUTC(sunset.toUTCString())
      console.log('Map clicked at', lat, lng);
      console.log('sunset is at ',sunset.toUTCString())
      // console.log(`Sunset is at ${hours}:${minutes.toString().padStart(2, '0')}`)

      // Reverse geocoding request to OpenStreetMap Nominatim API
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          const address = data.address;
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.hamlet || 
            address.county ||
            'Unknown place';
          const country = address.country;

          setPlaceName(`${city}, ${country}`)
          console.log(address)
        })
        .catch(error => {
          console.error('Geocoding error:', error);
          setPlaceName('Could not determine location');
        });
    },
  });

  // Automatically open popup when marker is set
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup()
    }
  }, [position])

 
  const [prompt, setPrompt] = useState("Boston");
  const [response, setResponse] = useState("");

  const sendPrompt = async () => {

      
    const res = await fetch('http://localhost:4000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userInput: placeName })
    });


    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    setResponse(data.response || data.message || JSON.stringify(data));
  };


  return position === null ? null : (
    <Marker position={position} ref={markerRef}>
      <Popup style = {{height: 400, width: 4000}}>
        <div>
          <p><b>{placeName}</b></p>
          <p><b>Your Time Zone</b> <br></br>Sunrise: {sunriseTime}<br></br> Sunset: {sunsetTime}</p>
          <p><b>Universal</b> <br></br>Sunrise: {srTimeUTC}<br></br>Sunset: {ssTimeUTC}</p>
         

          {/* <img
            src="https://raw.githubusercontent.com/elee05/technical-assessment-25-26/main/images/sunset.jpeg"
            alt="Popup"
            style={{ width: '100%', borderRadius: '8px' }}
          /> */}
        </div>
          <div className="p-4 space-y-4">
          <p></p>
          <textarea
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            rows={2}
            className="w-full border rounded p-2"
            placeholder="Enter Location"
          />
          <button
            onClick={sendPrompt}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Get More Info!
          </button>
          <div className="mt-4 whitespace-pre-wrap">{response}</div>
        </div>
         
      </Popup>
    </Marker>
  )
}

export default LocationMarker; 