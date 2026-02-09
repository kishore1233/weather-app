import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'

const Weather = ({ user, onLogout }) => {
  const inputRef = useRef()
  const weatherRef = useRef()
  const [weatherData, setWeatherData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": cloud_icon,
    "04n": cloud_icon,
    "09d": drizzle_icon,
    "09n": drizzle_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "11d": rain_icon,
    "11n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
    "50d": cloud_icon,
    "50n": cloud_icon
  }

  const search = async (city) => {
    if(city === ""){
      alert("Please enter a city name");
      return;
    }
    
    try {
      setIsLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if(!response.ok){
        alert(data.message);
        setIsLoading(false);
        return;
      }
      
      console.log(data);
      const icon = allIcons[data.weather[0].icon] || clear_icon;
      
      setWeatherData({
        humidity: data.main.humidity,
        wind_speed: (data.wind.speed * 3.6).toFixed(1),
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon
      })
    } catch (error) {
      setWeatherData(false);
      console.error("Error fetching weather data:", error);
      alert("Failed to fetch weather data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      search(inputRef.current.value);
    }
  }

  const handleMouseMove = (e) => {
    if (weatherRef.current) {
      const rect = weatherRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x: x * 20, y: y * -20 });
    }
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  }

  useEffect(() => {
    search("Bangalore");
  }, [])

  return (
    <div className="weather-container">
      <div className="animated-bg">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
      
      {/* User Profile Header */}
      <div className="user-profile">
        <div className="user-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-email">{user.email}</span>
        </div>
        <button className="logout-btn" onClick={onLogout} title="Logout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
      
      <div 
        className='weather'
        ref={weatherRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`
        }}
      >
        <div className='search-bar'>
          <input 
            type="text" 
            placeholder="Search for a city..." 
            ref={inputRef}
            onKeyPress={handleKeyPress}
          />
          <img 
            src={search_icon} 
            alt="search" 
            onClick={() => search(inputRef.current.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : weatherData ? (
          <>
            <div className="weather-icon-container">
              <img src={weatherData.icon} alt="Weather" className='weather_icon' />
            </div>
            <p className='temperature'>{weatherData.temperature}°<span>C</span></p>
            <p className='location'>{weatherData.location}</p>
            
            <div className='weather_data'>
              <div className='col'>
                <div className="icon-wrapper">
                  <img src={humidity_icon} alt="Humidity" />
                </div>
                <div>
                  <p>{weatherData.humidity}%</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className='col'>
                <div className="icon-wrapper">
                  <img src={wind_icon} alt="Wind" />
                </div>
                <div>
                  <p>{weatherData.wind_speed} km/h</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Weather
