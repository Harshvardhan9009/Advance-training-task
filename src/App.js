import React, { useState, useEffect } from 'react';

const App = () => {
  const [city, setCity] = useState('London');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = 'YOUR_API_KEY'; // ⬅️ Replace with your OpenWeatherMap API key

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) {
        setWeatherData(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) throw new Error('City not found or API error.');

        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, apiKey]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newCity = event.target.cityInput.value.trim();
    if (newCity) {
      setCity(newCity);
      event.target.cityInput.value = '';
    }
  };

  const getWeatherEmoji = (condition) => {
    switch (condition) {
      case 'Clear': return '☀️';
      case 'Clouds': return '☁️';
      case 'Rain': return '🌧️';
      case 'Drizzle': return '🌦️';
      case 'Thunderstorm': return '⛈️';
      case 'Snow': return '❄️';
      case 'Mist':
      case 'Smoke':
      case 'Haze':
      case 'Fog': return '❄️';
      default: return '🌍';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Weather Dashboard 🌤️
        </h1>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            name="cityInput"
            placeholder="Enter city name..."
            className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Search
          </button>
        </form>

        {loading && (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600 animate-pulse">Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600">
            <p className="text-xl font-semibold">Error: {error}</p>
            <p className="text-sm text-gray-500 mt-2">Please check the city name and try again.</p>
          </div>
        )}

        {weatherData && (
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-2">
              {weatherData.name}
            </h2>
            <div className="flex items-center justify-center text-8xl my-4">
              {getWeatherEmoji(weatherData.weather[0].main)}
            </div>
            <p className="text-6xl font-extralight text-gray-700">
              {Math.round(weatherData.main.temp)}°C
            </p>
            <p className="text-xl text-gray-500 capitalize mt-2 mb-4">
              {weatherData.weather[0].description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-gray-700">
              <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold">Humidity</p>
                <p className="text-lg">{weatherData.main.humidity}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <p className="font-semibold">Wind Speed</p>
                <p className="text-lg">{weatherData.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
//new commit added