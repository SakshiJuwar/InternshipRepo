/*
import * as fs from 'fs';
import pdf from 'pdf-parse';

export const extractTextFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);
  return data.text;
};
*/
// lib/pdfParser.js
import { spawn } from 'child_process';
import path from 'path';

export const extractTextFromPDF = (filePath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve('python/extractText.py');
    const python = spawn('C:\\Users\\Sakshi Juwar\\AppData\\Local\\Programs\\Python\\Python311\\python.exe', [scriptPath, filePath]);

    let data = '';
    let error = '';

    python.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    python.stderr.on('data', (chunk) => {
      error += chunk.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        return reject(`Python script failed: ${error}`);
      }

      try {
        const result = JSON.parse(data);
        if (result.error) {
          return reject(`Python error: ${result.error}`);
        }
        resolve(result); // array of text chunks
      } catch (err) {
        reject(`Failed to parse Python output: ${err}`);
      }
    });
  });
};
