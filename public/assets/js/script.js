
const updateWeatherData = (element, content) => {
    element.style.opacity = 0; 
    setTimeout(() => {
        element.innerHTML = content;
        element.style.opacity = 1; 
    }, 300); 
};

// Function to fetch and display the weather information
const displayWeather = async () => {
    const city = document.getElementById('city').value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {

        const currentWeatherResponse = await fetch(`/weather?city=${city}`);
        const currentWeatherData = await currentWeatherResponse.json();


        const forecastResponse = await fetch(`/forecast?city=${city}`);
        const forecastData = await forecastResponse.json();


        if (currentWeatherData.cod === 200) {
            const currentWeatherContent = `
                <h2>${currentWeatherData.name}</h2>
                <p>Temperature: ${currentWeatherData.main.temp} °C</p>
                <p>Weather: ${currentWeatherData.weather[0].description}</p>
                <p>Humidity: ${currentWeatherData.main.humidity}%</p>
            `;
            updateWeatherData(document.getElementById('current-weather-box'), currentWeatherContent);
        } else {
            updateWeatherData(document.getElementById('current-weather-box'), `<p>${currentWeatherData.message}</p>`);
        }


        if (forecastData.cod === "200") {
            for (let i = 0; i < 5; i++) {
                const dayForecast = forecastData.list[i * 8]; 
                const forecastBox = document.getElementById(`day${i + 1}`);
                const forecastContent = `
                    <h4>${new Date(dayForecast.dt_txt).toLocaleDateString()}</h4>
                    <p>Temp: ${dayForecast.main.temp} °C</p>
                    <p>Weather: ${dayForecast.weather[0].description}</p>
                    <p>Humidity: ${dayForecast.main.humidity}%</p>
                `;
                updateWeatherData(forecastBox, forecastContent);
            }
        } else {
            for (let i = 0; i < 5; i++) {
                updateWeatherData(document.getElementById(`day${i + 1}`), `<p>Error fetching forecast</p>`);
            }
        }

    } catch (error) {
        alert('Error fetching weather data. Please try again later.');
        console.error('Error:', error);
    }
};


const sendWeatherUpdate = async () => {
    const city = document.getElementById('city').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!city || !email) {
        alert('Please enter a city name and your email address.');
        return;
    }

    const weatherData = await fetch(`/weather?city=${city}`);
    const weatherJson = await weatherData.json();

    if (weatherJson.cod !== 200) {
        alert('Error fetching weather data. Please try again later.');
        return;
    }

    const emailResponse = await fetch('/send-weather-update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            city: city,
            weatherData: {
                temp: weatherJson.main.temp,
                description: weatherJson.weather[0].description,
                humidity: weatherJson.main.humidity,
            },
        }),
    });

    if (emailResponse.ok) {
        alert('Weather update email sent successfully!');
    } else {
        alert('Error sending weather update email.');
    }
};


document.getElementById('search').addEventListener('click', displayWeather);
document.getElementById('send-email').addEventListener('click', sendWeatherUpdate);
