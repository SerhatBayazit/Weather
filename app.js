const body = document.querySelector("body")
const informationarea = document.querySelector(".search-area")
const form = document.querySelector("form");
const input = document.querySelector("#input");
const search = document.querySelector(".search");
const clear = document.querySelector(".clear");
const cityname = document.querySelector(".city-name h3");
const inf1 = document.querySelectorAll(".inf-1");
const list = Array.from(inf1);
const hava = list[0].children[1];
const nem = list[1].children[1];
const sıcaklık = list[2].children[1];
const hissıcaklık = list[3].children[1];
const rakım = list[4].children[1];
const rüzgar = list[5].children[1];
const bulut = list[6].children[1];
const sunrise = document.querySelector(".icon-1 span")
const sunset = document.querySelector(".icon-2 span")
const tarih = document.querySelector(".date-time p")
import { apiKey1, apiKey2 } from './apikey.js';


let currentIndex = 0;
const icons = document.querySelector(".icons");
const iconarr = [
  '<i class="fa-regular fa-sun"></i>',
  '<i class="fa-solid fa-cloud-rain"></i>',
  '<i class="fa-regular fa-snowflake"></i>'

];

runEventListener()
function runEventListener() {
  icons.addEventListener("click", changeİcon)
  form.addEventListener("submit", search1)
  clear.addEventListener("click", clear1)
}


function changeİcon() {
  currentIndex = (currentIndex + 1) % iconarr.length;
  icons.innerHTML = iconarr[currentIndex]
}
function search1(e) {
  const value = input.value.trim();
  const city = value;


  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey2}`)
    .then(response => response.json())
    .then(data => {
      dataSet(data);
    })
    .catch(error1);

  e.preventDefault();
}
function dataSet(data) {
  cityname.textContent = `${data.name}, ${data.sys.country}`;
  hava.textContent = getWeatherDescription(data.weather[0].id);
  nem.textContent = `% ${data.main.humidity}`
  sıcaklık.textContent = `${kelvinToCelsius(data.main.temp)} °C`
  hissıcaklık.textContent = `${kelvinToCelsius(data.main.feels_like)} °C`
  rakım.textContent = `*${pressureToAltitude(data.main.sea_level, data.main.grnd_level)}`;
  rüzgar.textContent = `${data.wind.speed} km/h`;
  bulut.textContent = `% ${data.clouds.all}`
  getSunriseSunsetTimes(data.sys.sunrise, data.sys.sunset, data.timezone).then(times => {
    sunrise.textContent = times.sunrise;
    sunset.textContent = times.sunset;
  });
  getLocalDate(data.coord.lon, data.coord.lat)
    .then(sonuc => {
      tarih.textContent = sonuc.saat;

    });
    
  setWeatherBackgroundById(data.weather[0].id);

  console.log(data)
}
function clear1(e) {
  input.value = "";
  cityname.textContent = "--"
  hava.textContent = "--"
  nem.textContent = "--"
  sıcaklık.textContent = "--"
  hissıcaklık.textContent = "--"
  rakım.textContent = "--"
  rüzgar.textContent = "--"
  bulut.textContent = "--"
  sunrise.textContent = "--"
  sunset.textContent = "--"
  tarih.textContent = "--"


  e.preventDefault();
}
function error1() {
  if (input.value == "") {

  } else {
    console.log("hata oluştu")
    //   <div class="alert alert-warning" role="alert">
    //   This is a warning alert—check it out!
    // </div>
    const divcont = document.createElement("div");
    divcont.className = "alert-cont"
    const div = document.createElement("div")
    div.textContent = "Girdiğiniz text'e göre bir yer bulunamadı.";
    div.className = "alert";
    div.role = "alert";
    divcont.appendChild(div);
    informationarea.appendChild(divcont)

    setTimeout(() => {
      divcont.remove()
    }, 2500);
  }
}
function getWeatherDescription(weatherId) {
  switch (true) {

    case (weatherId >= 200 && weatherId < 300):
      return "Gök gürültülü fırtına";


    case (weatherId >= 300 && weatherId < 400):
      return "İnce yağmur (çiseleme)";


    case (weatherId >= 500 && weatherId < 600):
      return "Yağmur";


    case (weatherId >= 600 && weatherId < 700):
      return "Kar";

    case (weatherId >= 700 && weatherId < 800):
      return "Sisli veya puslu hava";


    case weatherId === 800:
      return "Açık hava (Güneşli)";

    case (weatherId > 800 && weatherId < 900):
      switch (weatherId) {
        case 801:
          return "Az bulutlu";
        case 802:
          return "Parçalı bulutlu";
        case 803:
          return "Çok bulutlu";
        case 804:
          return "Kapalı hava";
        default:
          return "Bulutlu hava";
      }

    // Diğer durumlar
    default:
      return "Bilinmeyen hava durumu";
  }
}
function kelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(1);
}
function pressureToAltitude(seaLevelPressure, groundPressure) {
  return Math.round(44330 * (1 - Math.pow(groundPressure / seaLevelPressure, 1 / 5.255)));
}
async function getSunriseSunsetTimes(sunriseUnix, sunsetUnix, timeZoneOffsetInSeconds) {
  const formatTime = (unixTime, offsetSeconds) => {
    // UNIX zamanına offset'i ekle
    const localUnixTime = unixTime + offsetSeconds;
    const date = new Date(localUnixTime * 1000); // Offset eklenmiş zaman
    return date.toISOString().substr(11, 5); // "HH:MM" formatı
  };

  const sunriseTime = formatTime(sunriseUnix, timeZoneOffsetInSeconds);
  const sunsetTime = formatTime(sunsetUnix, timeZoneOffsetInSeconds);

  return {
    sunrise: sunriseTime,
    sunset: sunsetTime,
    zone: `UTC${timeZoneOffsetInSeconds / 3600 >= 0 ? '+' : ''}${timeZoneOffsetInSeconds / 3600}`
  };
}
async function getLocalDate(lon, lat) {


  const timestamp = Math.floor(Date.now() / 1000); // UTC timestamp (saniye)

  const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=${timestamp}&key=${apiKey1}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`API hatası: ${data.status}`);
    }

    // 1. Offset'leri topla (saniye cinsinden)
    const totalOffsetSeconds = data.rawOffset + data.dstOffset;

    // 2. Yerel zamanı oluştur (UTC + offset)
    const localTime = new Date((timestamp + totalOffsetSeconds) * 1000);

    // 3. Türkçe formatla
    const options = {
      timeZone: 'UTC', // ! ÖNEMLİ: Zaten offset ekledik, UTC kullan
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };

    return {
      tarih: localTime.toLocaleDateString('tr-TR', options),
      saat: localTime.toLocaleTimeString('tr-TR', options),
      gun: localTime.toLocaleDateString('tr-TR', { weekday: 'long' }),
      offset: `UTC+${totalOffsetSeconds / 3600}` // Saat cinsinden offset
    };

  } catch (error) {
    console.error('Hata:', error);
    throw error;
  }
}
function setWeatherBackgroundById(weatherId) {
  const body = document.body;
  let backgroundUrl = '';

  if (weatherId === 800) {
    // Açık hava
    backgroundUrl = "url(image/sunny.jpg)";
  } else if (weatherId >= 801 && weatherId <= 804) {
    // Bulutlu
    backgroundUrl = "url(image/cloudy.jpg)";
  } else if (weatherId >= 500 && weatherId <= 531) {
    // Yağmurlu
    backgroundUrl = "url(image/rainy.jpeg)";
  } else if (weatherId >= 600 && weatherId <= 622) {
    // Karlı
    backgroundUrl = "url(image/snowy.jpg)";
  } else if (weatherId >= 200 && weatherId <= 232) {
    // Fırtına
    backgroundUrl = "url(image/stormy.jpg)";
  } else if (weatherId >= 700 && weatherId <= 800) {
    // Fırtına
    backgroundUrl = "url(image/foggy.jpg)";
  }
  else {
    // Bilinmeyen durum
    backgroundUrl = "url(images/default.jpg)";
  }

  body.style.backgroundImage = backgroundUrl;
  body.style.backgroundSize = 'cover';
  body.style.backgroundPosition = 'center';
}

const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu")

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});
const menuLinks = mobileMenu.querySelectorAll("a");
menuLinks.forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
});
const links = document.querySelectorAll(".nav-list ul li a");
        const currentPage = window.location.pathname.split("/").pop();

        links.forEach(link => {
            const linkPage = link.getAttribute("href");
            if (linkPage === currentPage) {
                link.classList.add("active");
            }
        });