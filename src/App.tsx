import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import CloseIcon from './components/CloseIcon';

type Characters = {
  id: number,
  name: string,
  status: string,
  species: string,
  type: string,
  gender: string,
  image: string,
  episode: string[],
}

type Results = {
  data: {
    results: Characters[]
  }
}

function App() {
  const [characters, setCharacters] = useState<Characters[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Characters[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<Characters[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const getCharacters = () => {
    axios.get('https://rickandmortyapi.com/api/character').then((res: Results) => {
      setCharacters(res.data.results);
    });
  }
  const handelSearch = (e: any) => {
    const search = e.target.value;
    setLoading(true);
    if (search.length <= 0 && e.keyCode === 8) {
      setSelectedCharacters(prevCharacters => prevCharacters.slice(0, -1));
    }
    axios.get(` https://rickandmortyapi.com/api/character/?name=${search}`).then((res: Results) => {
      setLoading(false);
      if (res.data.results.length > 0) {
        setFilteredCharacters(res.data.results);
      }
    }).catch(() => {
      setLoading(false);
      setFilteredCharacters([]);
    });
  }
  useEffect(() => {
    getCharacters();
  }, []);
  useEffect(() => {
    setFilteredCharacters(characters);
  }, [characters]);
  return (
    <div className="App flex justify-center p-3">
      <div className="flex flex-wrap justify-items-center w-96" onMouseEnter={() => setShow(true)} onMouseLeave={()=>{setShow(false)}}>
        <div className="w-full flex flex-row bg-white border-2 border-gray-400 rounded-2xl py-2 px-3 placeholder:text-gray-600 relative">
          <div className="max-w-2/3 flex flex-nowrap gap-2 overflow-y-scroll no-scrollbar flex-grow-0">
            {selectedCharacters.map((character: Characters) => (
              <div key={character.id} className="w-auto flex gap-2 bg-gray-200 rounded-md px-2 justify-center items-center">
                <p className='text-nowrap'>{character.name}</p>
                <button className='bg-gray-500 fill-white flex h-4 items-center justify-center leading-none p-0 rounded-md text-sm w-4' type='button' onClick={() => setSelectedCharacters(selectedCharacters.filter((selectedCharacter) => selectedCharacter.name !== character.name))}>
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>
          <input
            className='bg-white outline-none border-0 w-1/3 ps-3'
            type="text"
            onChange={handelSearch}
            onKeyDown={handelSearch}
            onFocus={() => setShow(true)}
            onBlur={() => setShow(false)}
            placeholder='Search'
          />
          {loading &&
            <span className='text-sm text-gray-500 text-end absolute top-2 end-2'>loading...</span>
          }
        </div>
        <div className={`w-full bg-white border-2 border-gray-400 rounded-2xl mt-2 grid grid-cols-1 transition-all overflow-y-scroll ${show ? 'h-52' : 'h-0 !border-0'}`}>
          {filteredCharacters.length > 0 ? filteredCharacters.map((character: Characters) => (
            <label
              key={character.id}
              className='grid grid-cols-12 grid-rows-2 gap-2 border-b-2 border-gray-300 p-2 h-fit last:border-b-0'
              htmlFor={character.name.toLocaleLowerCase().replaceAll(' ', '-')}
              onClick={() => setShow(true)}
            >
              <input
                type="checkbox"
                id={character.name.toLocaleLowerCase().replaceAll(' ', '-')}
                onFocus={() => setShow(true)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCharacters([...selectedCharacters, character]);
                  } else {
                    setSelectedCharacters(selectedCharacters.filter((selectedCharacter) => selectedCharacter.name !== character.name));
                  }
                }}
                className='w-4 h-4 col-span-1 row-span-2 m-auto accent-blue-600'
                checked={selectedCharacters.some(selectedCharacter => selectedCharacter.id === character.id)}
              />
              <img className='w-14 h-14 rounded-lg col-span-2 object-cover row-span-2' src={character.image} alt={character.name} />
              <h1 className='col-span-8 text-start  row-span-1 text-ellipsis text-nowrap overflow-hidden'>{character.name}</h1>
              <h1 className='col-span-8 text-start  row-span-1 text-sm text-gray-500'>{character.episode.length + " Episodes"}</h1>
            </label>
          )) : <h1>No Results</h1>}
        </div>
      </div>
    </div>
  );
}

export default App;
