import fs from "node:fs/promises";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// Middleware
app.use(cors({
  origin: "*", // Allow all domains
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(bodyParser.json());
app.use(express.static("images"));

// Helper function for reading JSON files
const readJSON = async (filePath) => {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (err) {
    throw new Error(`Error reading or parsing file ${filePath}: ${err.message}`);
  }
};

// Helper function for writing JSON files
const writeJSON = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    throw new Error(`Error writing file ${filePath}: ${err.message}`);
  }
};

// Routes
app.get("/places", async (req, res, next) => {
  try {
    const places = await readJSON("./data/places.json");
    res.status(200).json({ places });
  } catch (err) {
    next(err);
  }
});

app.get("/all-categories", async (req, res, next) => {
  try {
    const data = await readJSON("./data/categories.json");
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
});

app.get("/all-category", async (req, res, next) => {
  try {
    const data = await readJSON("./data/category.json");
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
});

app.get("/products", async (req, res, next) => {
  try {
    const data = await readJSON("./data/products.json");
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
});

app.get("/user-places", async (req, res, next) => {
  try {
    const places = await readJSON("./data/user-places.json");
    res.status(200).json({ places });
  } catch (err) {
    next(err);
  }
});

app.put("/user-places", async (req, res, next) => {
  try {
    const placeId = req.body.placeId;

    const placesData = await readJSON("./data/places.json");
    const place = placesData.find((place) => place.id === placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    const userPlacesData = await readJSON("./data/user-places.json");
    const updatedUserPlaces = userPlacesData.some((p) => p.id === place.id)
      ? userPlacesData
      : [...userPlacesData, place];

    await writeJSON("./data/user-places.json", updatedUserPlaces);

    res.status(200).json({ userPlaces: updatedUserPlaces });
  } catch (err) {
    next(err);
  }
});

app.delete("/user-places/:id", async (req, res, next) => {
  try {
    const placeId = req.params.id;
    const userPlacesData = await readJSON("./data/user-places.json");

    const updatedUserPlaces = userPlacesData.filter((place) => place.id !== placeId);

    await writeJSON("./data/user-places.json", updatedUserPlaces);

    res.status(200).json({ userPlaces: updatedUserPlaces });
  } catch (err) {
    next(err);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "404 - Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
