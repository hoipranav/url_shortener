import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [longUrl, setLongUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null);

  const handleLongUrlChange = (event) => {
    setLongUrl(event.target.value)
    setError(null)
  }

  const isValidUrl = (url) => {
    try {
      return Boolean(new URL(url))
    } catch (e) {
      return false
    }
  }

  const shortenUrl = async (event) => {
    event.preventDefault()

    if (!longUrl) {
      setError('Please enter a URL')
      return
    }

    if (!isValidUrl(longUrl)) {
      setError('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const urlObject = { "long_url": longUrl }
      // console.log('url obj', urlObject)

      const response = await axios.post('http://localhost:8000/shorten', urlObject)

      // console.log('response: ', response)
      setShortUrl(response.data.short_url)
      setLongUrl('')
    } catch (error) {
      if (error.response) {
        setError(`Error: ${error.response.data.detail}`)
      } else if (error.request) {
        setError('Network error.')
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className='container mx-auto p-8 max-w-md'>
      <h1 className='text-3xl font-bold text-center mb-6'>URL Shortener</h1>
      <form onSubmit={shortenUrl} className='space-y-4'>

        <label htmlFor='longUrl' className='block mb-2 font-medium'>Long URL </label>
        <div className='flex items-center space-x-2'>
          <input
            type='text'
            id='longUrl'
            onChange={handleLongUrlChange}
            value={longUrl}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300'
          />

          <button type='submit' disabled={isLoading}
            className={`${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium py-2 px-4 rounded-md`}>
            {isLoading ? 'Shortening...' : 'Shorten'}
          </button>
        </div>
        {error && <p className='text-red-500'>{error}</p>}
      </form>

      {shortUrl && (
        <div className='mt-6'>
          <p className='font-medium'>Short URL</p>
          <div className='flex items-center space-x-2'>
            <a
              href={shortUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 hover:underline'
            >
              {shortUrl}
            </a>
            <button
              onClick={() => copyToClipboard(shortUrl)}
              className='bg-gray-200 hover:bg-gray-300 text-grey-800 font-medium py-1 px-3 rounded-md'
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App