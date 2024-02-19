#!/usr/bin/env node

import dotenv from "dotenv";
import ytdl from "ytdl-core";
import fs from "fs";
import path from "path";
import Moises from "moises/sdk.js";

const moises = new Moises({ apiKey: process.env.ROCKAI_MOISES_API_KEY });

dotenv.config();

async function downloadYouTubeAudio(url, outputPath) {
  return new Promise((resolve, reject) => {
    ytdl(url, { filter: "audioonly" })
      .pipe(fs.createWriteStream(outputPath))
      .on("finish", () => resolve(outputPath))
      .on("error", reject);
  });
}

async function processAudio(workflow, youtubeURL) {
  // log pretty
  console.log(`Processing audio with workflow: ${workflow}`);
  console.log(`Downloading audio from: ${youtubeURL}`);
  try {
    const audioPath = path.join("./audio", "downloadedAudio.wav");
    await downloadYouTubeAudio(youtubeURL, audioPath);
    console.log("Audio downloaded");
    await moises.processFolder(workflow, "./audio", "./stems", {});
    console.log(`Audio processed with workflow: ${workflow}`);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Obtener los argumentos de la línea de comandos
const [workflow, youtubeURL] = process.argv.slice(2);

if (!workflow || !youtubeURL) {
  console.error("Usage: node script.js <workflow> <youtubeURL>");
  process.exit(1);
}

processAudio(workflow, youtubeURL);

// import Moises from "moises/sdk.js";

// const moises = new Moises({ apiKey: process.env.ROCKAI_MOISES_API_KEY });

// await moises.processFolder("test1", "./audio", "./stems", {});
