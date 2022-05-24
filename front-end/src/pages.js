import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  ListGroup,
  ListGroupItem,
  Button,
  Nav,
  Form,
  Container,
  Row,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

export function Home({ movies = [], onChangeMovies = (f) => f }) {
  if (movies === null || movies === undefined)
    return <h2>No movies availble</h2>;

  return (
    <>
      <section>
        <Nav variant="pills" defaultActiveKey="/home">
          <Nav.Item>
            <Nav.Link href="/">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/Addreview">Add review</Nav.Link>
          </Nav.Item>
        </Nav>
        <h2 className="text-center mt-4 mb-4">Movie Review</h2>

        <Container>
          <Row xs={2} md={4} lg={6} className="justify-content-center">
            {movies.map((movie, index) => (
              <Card key={index} style={{ width: "18rem" }} className="m-4">
                <Card.Img variant="top" src={movie.poster} alt={movie.name} />
                <Card.Body>
                  <Card.Title>{movie.name}</Card.Title>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroupItem>Date of release: {movie.date}</ListGroupItem>
                  <ListGroupItem>Actors: {movie.actor}</ListGroupItem>
                  <ListGroupItem>
                    Rating out of 5 star: {movie.rating}{" "}
                  </ListGroupItem>
                </ListGroup>
                <Card.Body>
                  <Button
                    variant="danger"
                    onClick={() => onChangeMovies(movie)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

export function AddReview({ addMovie }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [actor, setActor] = useState("");
  const [poster, setPoster] = useState("images/Maverick.jpg");
  const [rating, setRating] = useState("");

  const navigate = useNavigate();

  const uploadFileHandler = async (e) => {
    const uploadFile = e.target.files[0];

    const formData = new FormData();
    formData.append("poster", uploadFile);
    try {
      const result = await fetch("/api/upload", {
        method: "Post",
        "Content-Type": "multipart/form-data",
        body: formData,
      });
      const { file } = await result.json();
      setPoster(file);
    } catch (error) {
      console.error(error);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (
      name === "" ||
      date === "" ||
      actor === "" ||
      rating === "" ||
      poster === ""
    ) {
      alert("Please fill all fields.");
      return;
    }
    let newMovie = {};
    newMovie.name = name;
    newMovie.date = date;
    newMovie.actor = actor;
    newMovie.poster = poster;
    newMovie.rating = rating;
    addMovie(newMovie);
    navigate("/");
  };

  return (
    <section>
      <Nav variant="pills" defaultActiveKey="/home">
        <Nav.Item>
          <Nav.Link href="/">Home</Nav.Link>
        </Nav.Item>
      </Nav>
      <h2 className="text-center mt-4 mb-4">Add movie review</h2>
      <Container>
        <Form>
          <Form.Group className="mb-3" controlId="formGroupName">
            <Form.Label>Movie Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter movie name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupDate">
            <Form.Label>Date Release</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter movie release date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupActors">
            <Form.Label>Actors</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter movie actors"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupRating">
            <Form.Label>Rating out of 5 star</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter movie rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Default file input example</Form.Label>
            <Form.Control
              id="poster"
              name="poster"
              type="file"
              onChange={uploadFileHandler}
            />
          </Form.Group>
        </Form>
        <Button variant="primary" type="submit" onClick={submitForm}>
          Submit
        </Button>
      </Container>
    </section>
  );
}
