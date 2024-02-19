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

async function processAudio(youtubeURL) {
  console.log(`Downloading audio from: ${youtubeURL}`);

  const workflow = "test1";

  try {
    const audioPath = path.join("./audio", "downloadedAudio.wav");
    await downloadYouTubeAudio(youtubeURL, audioPath);
    console.log("Audio downloaded");
    await moises.processFolder(workflow, "./audio", "./stems", {});
    console.log(`Audio processed`);
  } catch (error) {
    console.error("Error:", error);
  }
}

const [youtubeURL] = process.argv.slice(2);

if (!youtubeURL) {
  console.error("Usage: rockai <youtubeURL>");
  process.exit(1);
}

processAudio(youtubeURL);
