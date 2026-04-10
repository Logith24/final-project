require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bookRoutes = require("./bookRoutes");

const app = express();

const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/library";

const rawOrigins = process.env.FRONTEND_URL || "";
const allowedOrigins = rawOrigins
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions =
  allowedOrigins.length > 0
    ? {
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) return callback(null, true);
          return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
      }
    : { origin: true };

app.use(cors(corsOptions));
app.use(express.json());
app.use("/books", bookRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.error("DB connection error:", err.message);
    process.exit(1);
  });

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
