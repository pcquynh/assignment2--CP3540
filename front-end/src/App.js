import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Home, AddReview } from "./pages";

function App() {
  const [movies, setMovies] = useState(null);
  useEffect(() => {
    // load the json data
    fetch("/api/data")
      .then((response) => response.json())
      .then(setMovies)
      .catch((e) => console.log(e.message));
  }, [movies]);

  const removeMovies = (movie) => {
    const updatedMovies = movies.filter((m) => m.id !== movie.id);
    setMovies(updatedMovies);
  };

  const addMovie = async (movie) => {
    const result = await fetch("/api/addMovie", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(movie),
    });
    const newMovie = await result.json();
    setMovies([...movies, newMovie]);
  };

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<Home movies={movies} onChangeMovies={removeMovies} />}
        />
        <Route path="/addReview" element={<AddReview addMovie={addMovie} />} />
      </Routes>
    </div>
  );
}

export default App;
