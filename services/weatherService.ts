
export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const data = await response.json();
    
    if (data.current_weather) {
      const temp = Math.round(data.current_weather.temperature);
      const code = data.current_weather.weathercode;
      
      // Map WMO Weather interpretation codes (WW)
      // https://open-meteo.com/en/docs
      let condition = 'Clear';
      let icon = 'sun';
      
      if (code === 0) { condition = 'Clear sky'; icon = 'sun'; }
      else if (code >= 1 && code <= 3) { condition = 'Partly cloudy'; icon = 'cloud-sun'; }
      else if (code >= 45 && code <= 48) { condition = 'Foggy'; icon = 'cloud'; }
      else if (code >= 51 && code <= 67) { condition = 'Rainy'; icon = 'droplet'; }
      else if (code >= 71 && code <= 77) { condition = 'Snowy'; icon = 'cloud-snow'; }
      else if (code >= 80 && code <= 82) { condition = 'Showers'; icon = 'droplet'; }
      else if (code >= 95 && code <= 99) { condition = 'Thunderstorm'; icon = 'zap'; }
      
      return {
        temperature: temp,
        condition,
        icon
      };
    }
    throw new Error('Invalid weather data');
  } catch (error) {
    console.error('Error fetching weather:', error);
    return {
      temperature: 68,
      condition: 'Clear',
      icon: 'sun'
    };
  }
}

export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
}
