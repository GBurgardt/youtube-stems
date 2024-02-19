#!/usr/bin/env node
import ytdl from "ytdl-core";
import path from "path";
import Moises from "moises/sdk.js";
import dotenv from "dotenv";
import os from "os";

dotenv.config();
import fs from "fs";

import * as fsPromises from "fs";
import { getVideoTitle } from "./utils.js";

const moises = new Moises({ apiKey: process.env.ROCKAI_MOISES_API_KEY });

async function ensureDirectoryExistence(dirPath) {
  try {
    await fsPromises.promises.mkdir(dirPath, { recursive: true }); // Usa await con fs.promises.mkdir
    console.log(`Directory created or already exists: ${dirPath}`);
  } catch (error) {
    console.error(`Error creating directory: ${dirPath}`, error);
  }
}

async function processAudio(youtubeURL) {
  console.log(`Downloading audio from: ${youtubeURL}`);

  const workflow = "test1";

  const audioUrl = path.join(os.homedir(), "rockai/audio");
  const stemUrl = path.join(os.homedir(), "rockai/stems");

  try {
    await ensureDirectoryExistence(audioUrl);
    await ensureDirectoryExistence(stemUrl);

    // const timestamp = Date.now(); // Obtiene el sello de tiempo actual
    // const audioPath = path.join(audioUrl, `downloadedAudio_${timestamp}.wav`); // Nombre de archivo único

    const audioName = await getVideoTitle(youtubeURL);

    const audioPath = path.join(audioUrl, `${audioName}.wav`);
    console.log("Audio path", audioPath);

    await downloadYouTubeAudio(youtubeURL, audioPath);
    console.log("Audio downloaded");
    console.log("audioUrl", audioUrl);
    await moises.processFolder(workflow, audioUrl, stemUrl, {});
    console.log(`Audio processed`);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function downloadYouTubeAudio(url, outputPath) {
  return new Promise((resolve, reject) => {
    ytdl(url, { filter: "audioonly" })
      .pipe(fs.createWriteStream(outputPath))
      .on("finish", () => resolve(outputPath))
      .on("error", reject);
  });
}

const [youtubeURL] = process.argv.slice(2);

if (!youtubeURL) {
  console.error("Usage: rockai <youtubeURL>");
  process.exit(1);
}

processAudio(youtubeURL).then(() => {
  console.log("Done");
});
