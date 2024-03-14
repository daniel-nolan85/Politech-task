import axios from 'axios';

// Function to create an image using provided prompt, requested image resolution, and user authtoken for authentication
export const createImage = async (authtoken, prompt, imageResolution) => {
  // Axios request using Vite enabled env variable
  return await axios.post(
    `${import.meta.env.VITE_API_URL}/create-image`,
    { prompt, imageResolution },
    {
      headers: {
        authtoken,
      },
    }
  );
};

// Function to create a caption based on the provided prompt and user authtoken for authentication
export const createCaption = async (authtoken, prompt) => {
  // Axios request using Vite enabled env variable
  return await axios.post(
    `${import.meta.env.VITE_API_URL}/create-caption`,
    { prompt },
    {
      headers: {
        authtoken,
      },
    }
  );
};

// Function to create keywords based on the provided prompt and user authtoken for authentication
export const createKeywords = async (authtoken, prompt) => {
  // Axios request using Vite enabled env variable
  return await axios.post(
    `${import.meta.env.VITE_API_URL}/create-keywords`,
    { prompt },
    {
      headers: {
        authtoken,
      },
    }
  );
};
