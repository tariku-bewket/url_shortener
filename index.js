require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// In-memory URL database
const urlDatabase = {};

// POST a new short URL
app.post("/api/shorturl/new", (req, res) => {
  const { url } = req.body;

  // Validate the URL
  if (!url) {
    return res.json({ error: "invalid url" });
  }

  // Check if the URL starts with http or https
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return res.json({ error: "invalid url" });
  }

  // Generate a short URL
  const shortUrl = urlShortener(url);

  return res.json({ original_url: url, short_url: shortUrl });
});

// Redirect to the original URL
app.get("/api/shorturl/:shortUrl", (req, res) => {
  const { shortUrl } = req.params;
  const url = urlDatabase[shortUrl];

  if (!url) {
    return res.json({ error: "invalid url" });
  }

  return res.redirect(url);
});

// Function to generate a short URL
function urlShortener(url) {
  const shortUrl = Math.random().toString(36).substring(2, 7);
  urlDatabase[shortUrl] = url; // Store the original URL

  return shortUrl;
}

// Start the server
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
