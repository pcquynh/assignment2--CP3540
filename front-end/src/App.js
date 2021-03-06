import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Home, AddReview } from "./pages";

function App() {
  const [movies, setMovies] = useState(null);
  // load the json data
  const fetchData = async () => {
    const result = await fetch("/api/data", {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await result.json();
    setMovies(body);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const removeMovies = async (movie) => {
    const result = await fetch(`/api/delete/${movie._id}`, {
      method: "Delete",
    });
    const updatedMovies = movies.filter((m) => m._id !== movie._id);
    setMovies(updatedMovies);
  };

  const addMovie = async (movie) => {
    const result = await fetch("/api/addMovie", {
      method: "Post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(movie),
    });
    const newMovie = await result.json();
    setMovies([...movies, newMovie]);
    fetchData();
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
