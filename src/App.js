import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [selectedAnime, setSelectedAnime] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  const handleCheckboxChange = (event) => {
    const anime = event.target.value;
    if (event.target.checked) {
      setSelectedAnime((prevSelectedAnime) => [...prevSelectedAnime, anime]);
    } else {
      setSelectedAnime((prevSelectedAnime) =>
        prevSelectedAnime.filter((item) => item !== anime)
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true); // Set loading state to true before making the API request

      const prompt = `I like ${selectedAnime.join(', ')} anime. Can you recommend a similar anime and summarize it in 100 tokens with genre, popularity, writter and rankings in imdb.`;
      const completionRequest = {
        model: 'text-davinci-003',
        prompt,
        max_tokens: 200,
        temperature: 0.7,
      };

      const response = await axios.post('https://api.openai.com/v1/completions', completionRequest, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const recommendedAnime = response.data.choices[0].text.trim().split('\n');
      setRecommendations(recommendedAnime);
    } catch (error) {
      console.error('Error:', error.response.data.error.message);
    } finally {
      setLoading(false); // Set loading state to false after the API request is completed
    }
  };


  return (
    <div className="App">
      <h2>Select the anime you have seen or heard:</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="checkbox"
            value="Dragon Ball Z"
            onChange={handleCheckboxChange}
          />
          Dragon Ball Z
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="Death Note"
            onChange={handleCheckboxChange}
          />
          Death Note
        </label>
        {/* Add more checkbox inputs for additional anime options */}
        <br />
        <label>
          <input
            type="checkbox"
            value="Naruto"
            onChange={handleCheckboxChange}
          />
          Naruto
        </label>
        <br />
        <button type="submit">Get Recommendations</button>
      </form>
  
      <div className="recommendations">
        <h3>Recommended Anime:</h3>
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          recommendations.map((anime, index) => <div key={index}>{anime}</div>)
        )}
      </div>
    </div>
  );
}

export default App;
