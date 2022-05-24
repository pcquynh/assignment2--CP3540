import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "/build")));
app.use(express.json());

const client = new MongoClient("mongodb://localhost:27017");

const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

//File uploading
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/build/images"));
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: storage,
  fileFilter: imageFilter,
}).single("poster");

app.use(upload);

//Make uploads folder to static

app.use("/images", express.static("images"));

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

app.post("/api/upload", (req, res) => {
  upload(req, res, (error) => {
    if (error) {
      console.log("first err", error);
      res.send({
        msg: error,
      });
    } else {
      if (req.file == undefined) {
        console.log("Error: No File Selected!");
        res.send({
          msg: "Error: No File Selected!",
        });
      } else {
        console.log("File Uploaded!");
        res.send({
          msg: "File Uploaded!",
          file: `images/${req.file.filename}`,
        });
      }
    }
  });
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
