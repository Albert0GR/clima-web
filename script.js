const apiKey = 'c44e5dd65db6d0bfdb326f5095f40a64'; // API Key de OpenWeatherMap
const citySelect = document.getElementById('city-select');
const cityDataContainer = document.getElementById('city-data-container');

let intervalId; // Para almacenar el intervalo y evitar múltiples timers

// Función para iniciar el timer de la hora en tiempo real
function startCityClock(timezoneOffset) {
  if (intervalId) {
    clearInterval(intervalId); // Detener cualquier timer activo
  }

  intervalId = setInterval(() => {
    const utcTimestamp = new Date().getTime() - (new Date().getTimezoneOffset() * 60000); // Hora UTC en milisegundos
    const cityTimestamp = utcTimestamp + timezoneOffset * 1000; // Ajustar timezone en milisegundos
    const localTime = new Date(cityTimestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Actualizar la hora en tiempo real en el elemento correspondiente
    const timeElement = document.getElementById('city-time');
    if (timeElement) {
      timeElement.textContent = `Hora exacta en la ciudad: ${localTime}`;
    }
  }, 1000); // Actualizar cada segundo
}

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

    // Obtener timezoneOffset en segundos
    const timezoneOffset = data.timezone;

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
      <p><strong>Zona horaria en la ciudad:</strong> UTC${timezoneOffset / 3600 > 0 ? '+' : ''}${timezoneOffset / 3600}</p>
      <p id="city-time"></p> <!-- Elemento para mostrar la hora en tiempo real -->
    `;

    // Iniciar el timer para actualizar la hora en tiempo real
    startCityClock(timezoneOffset);
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
