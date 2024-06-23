import WEATHER_API_KEY from './.env';
import WEATHER_API_URL from './.env';
import NEWS_API_URL from './.env';
import NEWS_API_KEY from './.env';
import GEMINI_API_KEY from './.env';
import { GoogleGenerativeAI } from "@google/generative-ai";

  
const button = document.getElementById("generate");

button.addEventListener("click", handleClick);

function handleClick() {

    
  


const onSuccess = (position) => {
const latitude = position.coords.latitude;
const longitude = position.coords.longitude;
console.log("Latitude:", latitude);
console.log("Longitude:", longitude);

 
let lat = latitude;
let lon = longitude;



const url = `${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${lat},${lon}`;

fetch(url)
.then(response => response.json())
.then(data1 => {
    console.log("API response:", data1);
    


        // Now make the second API call
        fetch(`${NEWS_API_URL}?api-key=${NEWS_API_KEY}`)
      .then(response => response.json())
      .then(data2 => {
        // Combine the data
        const randomNumber = Math.floor(Math.random() * (data2.results.length + 1));
        const selectedArticle = data2.results[randomNumber];
        const imageURL = selectedArticle.multimedia[0].url;
        console.log(randomNumber);
        console.log(data2.results[randomNumber]);
        const combinedData = JSON.stringify({ ...data1, ...data2.results[randomNumber].abstract });
        console.log(combinedData);






        // Make the final API call

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

        async function run() {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const prompt = `Write a single haiku about both the weather AND the top stories, based on this string: ${combinedData}. Limit the haiku to the five-seven-five syllable format. Be sure to integrate aspects from both the weather and the news in the haiku.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);

        const haikuContainer = document.getElementById("haiku-container");

        if (haikuContainer) {
          // Update the innerHTML with your desired content
          haikuContainer.innerHTML = `
            <img src=${imageURL} alt="Haiku image">
            <p>${text}</p>
          `;
        } else {
          console.error("Element with id 'haiku-container' not found.");
        }
        }

        run();
      })
      .catch(error => {
        console.error("Error fetching data2:", error);
      });


  })
  .catch(error => {
    console.error("Error fetching data1:", error);
  });


};

const onError = (error) => {
  console.error("Error getting location:", error);
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
} else {
  console.warn("Geolocation is not supported by this browser.");
}

  }
