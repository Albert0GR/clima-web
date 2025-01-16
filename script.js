// script.js
const apiKey = 'c44e5dd65db6d0bfdb326f5095f40a64'; // API Key de OpenWeatherMap
const citySelect = document.getElementById('city-select');
const cityDataContainer = document.getElementById('city-data-container');

// Función para obtener datos del clima
async function fetchCityData(city) {
  try {
    // Petición a la API de OpenWeatherMap
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();

    // Verificar si la respuesta es exitosa
    if (data.cod !== 200) {
      throw new Error(data.message || 'Error desconocido');
    }

    // Calcular la hora local de la ciudad seleccionada
    // Tiempo actual en milisegundos desde Unix Epoch (UTC)
    const utcTimestamp = new Date().getTime() - (new Date().getTimezoneOffset() * 60000); // Hora UTC en milisegundos
    console.log('utcTimestamp (milisegundos UTC):', utcTimestamp);

    // Ajustar el timestamp para la ciudad seleccionada
    const cityTimestamp = utcTimestamp + data.timezone * 1000; // Ajustar timezone en milisegundos
    console.log('cityTimestamp (milisegundos ajustados):', cityTimestamp);

    // Convertir el timestamp ajustado en un objeto Date
    const localTime = new Date(cityTimestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Obtener sea_level si está disponible
    const seaLevel = data.main.sea_level || 'No disponible';

    // Crear el contenido de la tarjeta
    cityDataContainer.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
      <p><strong>Clima:</strong> ${data.weather[0].description}</p>
      <p><strong>Temperatura:</strong> ${data.main.temp}°C</p>
      <p><strong>Sensación térmica:</strong> ${data.main.feels_like}°C</p>
      <p><strong>Humedad:</strong> ${data.main.humidity}%</p>
      <p><strong>Presión:</strong> ${data.main.pressure} hPa</p>
      <p><strong>Nivel del mar:</strong> ${seaLevel} hPa</p>
      <p><strong>Velocidad del viento:</strong> ${data.wind.speed} m/s</p>
      <p><strong>Zona horaria en la ciudad:</strong> UTC${data.timezone / 3600 > 0 ? '+' : ''}${data.timezone / 3600}</p>
      <p><strong>Hora exacta en la ciudad:</strong> ${localTime}</p>
    `;
  } catch (error) {
    console.error('Error al obtener los datos:', error);

    // Mostrar un mensaje de error
    cityDataContainer.innerHTML = `
      <p>No se pudieron obtener los datos del clima para ${city}.</p>
    `;
  }
}

// Manejar el evento de selección de la ciudad
citySelect.addEventListener('change', (event) => {
  const selectedCity = event.target.value;
  if (selectedCity) {
    // Mostrar mensaje de carga
    cityDataContainer.innerHTML = '<p>Cargando datos...</p>';
    fetchCityData(selectedCity);
  }
});
