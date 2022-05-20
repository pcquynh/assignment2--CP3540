import express from "express";
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());

// app.get("/hello", (req, res) => {
//   res.send("hello there");
// });
// app.get("/hello/:name", (req, res) => {
//   res.send(`hello ${req.params.name}`);
// });

// app.post("/hello", (req, res) => {
//   res.send(`hello! ${req.body.name}`);
// });

const client = new MongoClient("mongodb://localhost:27017");

app.post("/api/addMovie", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("movies");
    const movieInfo = await db.collection("mymovies").insertOne(req.body);
    res.status(200).json(movieInfo);
    client.close();
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get("/api/data", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("movies");
    const movieInfo = await db.collection("mymovies").find({}).toArray();
    res.status(200).json(movieInfo);
    client.close();
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(8000, () => console.log("Server is listening on port 8000"));
