import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "/build")));
app.use(express.json());

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

app.get("/api/data/:id", async (req, res) => {
  let id = req.params.id;
  try {
    await client.connect();
    const db = client.db("movies");
    const movieInfo = await db
      .collection("mymovies")
      .findOne({ _id: new ObjectId(id) });
    res.status(200).json(movieInfo);
    client.close();
  } catch (error) {
    res.sendStatus(500);
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  let id = req.params.id;
  // id = new ObjectId(id);
  try {
    await client.connect();
    const db = client.db("movies");
    const result = await db
      .collection("mymovies")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.send("Successfully deleted one document.");
    } else {
      res.send("No documents matched the query. Deleted 0 documents.");
    }
    // res.status(200).json({ success: 1 });
  } catch (error) {
    // res.status(400).json({ success: 0 });
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

app.listen(8000, () => console.log("Server is listening on port 8000"));
