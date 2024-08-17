"use client"
import React, { useState } from 'react'
import Loading from './Loading';

const Home = () => {

  const [word, setword] = useState(""); // Initialized with an empty string
  const [loading, setloading] = useState(false);
  const [description, setdescription] = useState("");
  const [audio, setaudio] = useState("");
  const [synonyms, setsynonyms] = useState("Synonyms not available");
  const [antonyms, setantonyms] = useState("Antonyms not available");

  const handle_input = async (word) => {
    try {
      if (!word) {
        alert("Enter a word!");
        return;
      }
      setloading(true);
      
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data && data[0]) {
        const meaning = data[0].meanings[0];

        setdescription(meaning?.definitions[0]?.definition || "Meaning not available");

        if (meaning?.synonyms?.length > 0) {
          setsynonyms(meaning.synonyms.join(", "));
        } else {
          setsynonyms("Synonyms not available");
        }

        const antonymsData = data[0].meanings.find(m => m.antonyms && m.antonyms.length > 0);
        if (antonymsData) {
          setantonyms(antonymsData.antonyms.join(", "));
        } else {
          setantonyms("Antonyms not available");
        }

        const audioURL = data[0].phonetics.find(phonetic => phonetic.audio)?.audio || "";
        setaudio(audioURL);
      } else {
        setdescription("Word not found");
        setsynonyms("Synonyms not available");
        setantonyms("Antonyms not available");
      }
      setloading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setdescription("Failed to fetch word data");
      setaudio("");
      setsynonyms("Synonyms not available");
      setantonyms("Antonyms not available");
      setloading(false);
    }
  }

   const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handle_input(word);
        }
    };

  return (
    <div className='h-[100vh] flex flex-col gap-6 min-w-[80%] items-center p-[20px]'>
      <h1 className='text-center text-white text-2xl'>Dictionary Haven</h1>
      <div className='min-w-[80%] ml-4 justify-center gap-5 py-2 rounded flex bg-[#7a787800] backdrop-blur-md'>
        <input
          className='px-[20px] w-[300px] border-none rounded outline-none backdrop-blur'
          onChange={(e) => { setword(e.target.value) }}
          type='text'
          value={word}
          placeholder='Enter any word!'
        />
        <button
          onClick={() => { handle_input(word) }}
          onKeyDown={handleKeyDown(e)}
          className='bg-[#5ca6f1f3] text-white px-[15px] rounded py-[8px]'
        >
          Search
        </button>
      </div>
      {loading && <Loading />}
      {!loading && description && (
        <div className='bg-slate-200 ml-4 w-[90%] flex flex-col rounded gap-1 px-[10px] py-3'>
          <h1 className='w-[100%] p-[10px] flex gap-[8px] capitalize'><span className='font-bold flex'>Word  </span> {word}</h1>
          <h1 className='w-[100%] p-[10px] flex gap-[8px] capitalize'><span className='font-bold flex'>Meaning </span> {description}</h1>
          <h1 className='w-[100%] p-[10px] flex gap-[8px] capitalize'><span className='font-bold flex'>Synonyms </span> {synonyms}</h1>
          <h1 className='w-[100%] p-[10px] flex gap-[8px] capitalize'><span className='font-bold flex'>Antonyms </span> {antonyms}</h1>
          {audio && (
            <div className='w-full flex items-center justify-center'>
              <audio controls>
                <source src={audio} type='audio/mp3' />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Home;
