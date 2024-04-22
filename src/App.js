import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [tiles, setTiles] = useState([]);
  const [newTile, setNewTile] = useState({ name: '', rating: 5, last_engaged: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    fetchTiles();
  }, []);

  const fetchTiles = async () => {
    try {
      const response = await axios.get('/tiles');
      setTiles(response.data);
    } catch (error) {
      console.error('Error fetching tiles:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewTile({ ...newTile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/tiles', newTile);
      fetchTiles();
      setNewTile({ name: '', rating: 5, last_engaged: new Date().toISOString().split('T')[0] });
    } catch (error) {
      console.error('Error adding tile:', error);
    }
  };

  return (
    <div>
      <h1>Tile Manager</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={newTile.name} onChange={handleInputChange} placeholder="Name" required />
        <input type="range" name="rating" value={newTile.rating} onChange={handleInputChange} min="1" max="10" />
        <input type="date" name="last_engaged" value={newTile.last_engaged} onChange={handleInputChange} max={new Date().toISOString().split('T')[0]} />
        <button type="submit">Add Tile</button>
      </form>
      <div>
        {tiles.map(tile => (
          <div key={tile.id}>
            <p>Name: {tile.name}</p>
            <p>Rating: {tile.rating}</p>
            <p>Last Engaged: {tile.last_engaged}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
