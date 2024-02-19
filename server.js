// const express = require("express");
import express from "express";

const app = express();
const port = 3000;

app.use("/files", express.static("test.wav"));

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

// esto obtenie la bateria de cualqueir tema dado el link de youtube
// index.js http://youtube.com/1235124 drums
