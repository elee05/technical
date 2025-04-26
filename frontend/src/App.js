import './App.css';
import GeminiPrompt from './gemeniprompt';
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, } from 'react-leaflet';
import { useState, } from 'react';
import LocationMarker from './location';


function App() {

  const [dataFromChild, setDataFromChild] = useState(null);
  
  // Callback function to receive data from child
  const handleChildData = (data) => {
    console.log("Data received from child:", data);
    setDataFromChild(data);
  };




  return (
    <div className="App">
      <div className='topbar'>
        <h1 >Learn about Sunsets Around the World!</h1>
      </div>
      <div className="contents">
        <MapContainer center={[42.35, -71.09]} zoom={14} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker sendDataToParent={handleChildData}/>
        </MapContainer>
      </div>
      {/* <div className = 'box'>
        <p></p>
      </div> */}
      
    </div>
  );
}

export default App;
