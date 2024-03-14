import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import preview from '../assets/preview.png';
import Loader from '../components/Loader';
import Keywords from '../components/Keywords';
import FormInput from '../components/FormInput';
import CheckboxInput from '../components/CheckboxInput';
import DropDown from '../components/Dropdown';
import {
  createImage,
  createCaption,
  createKeywords,
} from '../requests/creation';

const Create = () => {
  // State variables
  const [form, setForm] = useState({
    prompt: '',
    image: '',
    caption: '',
    keywords: '',
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [captionRequired, setCaptionRequired] = useState(false);
  const [keywordsRequired, setKeywordsRequired] = useState(false);
  const [imageResolution, setImageResolution] = useState('256x256');

  // Accessing user token from Redux state
  const { token } = useSelector((state) => state.user) || {};

  // Destructure form state variables
  const { prompt, image, caption, keywords } = form;

  // Function to generate AI creation
  const generateImg = async () => {
    if (!prompt) {
      toast.error('Please enter a prompt');
      return;
    }

    try {
      // Initiate loading state
      setGeneratingImg(true);

      // Generate an image
      const res = await createImage(token, prompt, imageResolution);
      setForm((prevForm) => ({
        ...prevForm,
        image: `data:image/jpeg;base64,${res.data.image}`,
      }));

      // If user requires a caption, generate a caption
      if (captionRequired) {
        const captionRes = await createCaption(token, prompt);
        setForm((prevForm) => ({
          ...prevForm,
          caption: captionRes.data.caption,
        }));
      }

      // If user requires keywords, generate keywords
      if (keywordsRequired) {
        const keywordsRes = await createKeywords(token, prompt);
        setForm((prevForm) => ({
          ...prevForm,
          keywords: keywordsRes.data.keywords,
        }));
      }

      // Client-side error handling
    } catch (error) {
      toast.error(error);
    } finally {
      // Reset loading state regardless of response
      setGeneratingImg(false);
    }
  };

  // Function to handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // JSX rendering
  return (
    <section className='max-w-7xl mx-auto p-4'>
      <form className='mt-16' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          {/* Reusable input component for caption */}
          <FormInput
            type={type}
            name='prompt'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-mainDark focus:border-mainDark outline-none block w-full p-3'
            placeholder='Describe what you want to see...'
            value={prompt}
            onChange={handleChange}
          />

          {/* Styled slider components to handle checkbox inputs */}
          <div className='flex justify-between flex-col md:flex-row py-8'>
            <div className='flex items-center mb-6 md:mb-0'>
              <p className='w-40 block h-7 text-sm font-medium text-gray-900'>
                Create a caption
              </p>

              {/* Reusable checkbox component for caption */}
              <CheckboxInput
                labelText='Create a caption'
                id='toggleCaption'
                checked={captionRequired}
                onChange={() => setCaptionRequired(!captionRequired)}
              />
            </div>

            <div className='flex items-center mb-6 md:mb-0'>
              <p className='w-40 block h-7 text-sm font-medium text-gray-900'>
                Create keywords
              </p>

              {/* Reusable checkbox component for keywords */}
              <CheckboxInput
                labelText='Create keywords'
                id='toggleKeywords'
                checked={keywordsRequired}
                onChange={() => setKeywordsRequired(!keywordsRequired)}
              />
            </div>

            {/* Reusable dropdown component for image resolution */}
            <div className='flex items-center'>
              <DropDown
                imageResolution={imageResolution}
                setImageResolution={setImageResolution}
              />
            </div>
          </div>

          {/* Generated image preview */}
          <div className='flex flex-col lg:flex-row'>
            <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-mainDark-500 focus:border-mainDark-500 w-64 p-3 h-64 flex justify-center items-center'>
              {image ? (
                <img
                  src={image}
                  alt={prompt}
                  className='w-full h-full object-contain'
                />
              ) : (
                <img
                  src={preview}
                  alt='preview'
                  className='w-9/12 h-9/12 object-contain opacity-40'
                />
              )}

              {/* Reusable Loader component */}
              {generatingImg && (
                <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                  <Loader />
                </div>
              )}
            </div>

            {/* Caption and Keywords if specified */}
            <div className='flex-1 ml-0 lg:ml-4'>
              {caption && (
                <div>
                  <h2 className='font-extrabold text-[24px] text-black mb-2'>
                    AI generated caption
                  </h2>
                  <p>{caption.slice(1, -1)}</p>
                </div>
              )}
              {keywords && (
                <div>
                  <h2 className='font-extrabold text-[24px] text-black my-2'>
                    AI generated keywords
                  </h2>
                  <Keywords keywords={keywords} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generate button */}
        <div className='my-5 flex gap-5'>
          <button
            type='button'
            onClick={!image ? generateImg : regenerate}
            className='text-black bg-main font-medium rounded-md text-sm w-64 px-5 py-2.5 text-center'
          >
            {generatingImg ? 'Generating...' : 'Generate CreAItion'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Create;
