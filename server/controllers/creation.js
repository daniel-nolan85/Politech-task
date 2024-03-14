import OpenAIApi from 'openai';

// Initialize OpenAI API instance with key stored in env variables
const openai = new OpenAIApi({
  apiKey: process.env.REACT_APP_API_KEY,
  dangerouslyAllowBrowser: true, // Allow running in browser environment
});

// Controller function to generate an image based on user inputs
export const createImage = async (req, res) => {
  // Destructure values from request body
  const { prompt, imageResolution } = req.body;
  try {
    // Generate image using OpenAi API
    const aiResponse = await openai.images.generate({
      prompt, // User inputted prompt
      n: 1, // Number of images to generate
      size: imageResolution, // desired image resolution
      response_format: 'b64_json', // Response format: base64-encoded image
    });

    // Extract generated image and revised prompt from AI response
    const image = aiResponse.data[0].b64_json;
    const revisedPrompt = aiResponse.data[0].revised_prompt;

    // Send response back to client
    res.status(200).json({ image, revisedPrompt });
  } catch (error) {
    // Server-side error handling
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
};

// Controller function to create a caption based on the provided prompt
export const createCaption = async (req, res) => {
  // Destructure value of prompt from request body
  const { prompt } = req.body;
  try {
    // Generate caption using OpenAI API
    const message = `Create a caption for an image that has previously been generated using this prompt: ${prompt}`;
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0613', // Specify language model
      messages: [{ role: 'user', content: message }], // Define messages exchanged
      temperature: 0.7, // Control the randomness of generated responses
      max_tokens: 256, // Set the maximum number of tokens in the generated completion
      top_p: 1, // Set the token selection probability threshold
      frequency_penalty: 0, // Adjust the token frequency penalty
      presence_penalty: 0, // Adjust the token presence penalty
    });

    // Extract generated caption from AI response
    const caption = aiResponse.choices[0].message.content;

    // Send response back to client
    res.status(200).json({ caption });
  } catch (error) {
    // Server-side error handling
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
};

// Controller function to create keywords based on the provided prompt
export const createKeywords = async (req, res) => {
  const { prompt } = req.body;
  try {
    // Generate keywords using OpenAI API
    const message = `Provide some comma separated keywords that will relate to an image that has previously been generated using this prompt: ${prompt}`;
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0613', // Specify language model
      messages: [{ role: 'user', content: message }], // Define messages exchanged
      temperature: 0.7, // Control the randomness of generated responses
      max_tokens: 256, // Set the maximum number of tokens in the generated completion
      top_p: 1, // Set the token selection probability threshold
      frequency_penalty: 0, // Adjust the token frequency penalty
      presence_penalty: 0, // Adjust the token presence penalty
    });

    // Extract generated keywords from AI response
    const keywords = aiResponse.choices[0].message.content;

    // Send response back to client
    res.status(200).json({ keywords });
  } catch (error) {
    // Server-side error handling
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
};
