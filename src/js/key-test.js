// Get API key from the .env file
const apiKey = import.meta.env.VITE_NPS_API_KEY;

// Build the endpoint URL
const url = "https://developer.nps.gov/api/v1/parks?parkCode=yell";
//url = `${url}&api_key=${apiKey}`;

// Fetch data using request headers
async function getPark() {
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": apiKey
    }
  });

  const data = await response.json();

  console.log(data);
  const parkTag = document.getElementById("park-info")
  parkTag.innerText = JSON.stringify(data)

}

getPark();