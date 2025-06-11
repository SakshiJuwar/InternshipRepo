/*import fs from 'fs';
import formidable from 'formidable';
import { extractTextFromPDF } from '../../lib/pdfParser';
import { getCohereEmbedding } from '../../lib/cohere';
import { upsertToPinecone } from '../../lib/pinecone'; // Ensure this exists and works correctly
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable({
      uploadDir: './tmp',
      keepExtensions: true,
      multiples: false,
    });

    form.parse(req, async (err, fields, files) => {
      if (err || !files.file) {
        console.error('Form parsing error:', err);
        return res.status(400).json({ error: 'No file uploaded or form error' });
      }
      

      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      try {
        const fileText = await extractTextFromPDF(file.filepath);
        const embedding = await getCohereEmbedding(fileText);
        const fileUrl = await uploadFileToS3(file);
        const id = `pdf-${Date.now()}`;
        await upsertToPinecone(embedding, id);

        fs.unlinkSync(file.filepath); // delete temp file

        res.status(200).json({ message: 'File uploaded and indexed', fileUrl });
      } catch (error) {
        console.error('Processing error:', error);
        res.status(500).json({ error: 'Error processing file' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `uploads/${file.originalFilename}`,
    Body: fs.createReadStream(file.filepath),
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('S3 upload failed');
  }
};
*/

import fs from 'fs';
import formidable from 'formidable';
import { extractTextFromPDF } from '@/lib/pdfParser'; // This calls the Python script
import { getCohereEmbedding } from '@/lib/cohere';
import { upsertToPinecone } from '@/lib/pinecone';
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = formidable({
    uploadDir: './tmp',
    keepExtensions: true,
    multiples: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      console.error('Form parsing error:', err);
      return res.status(400).json({ error: 'No file uploaded or form error' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const filePath = file.filepath;

    try {
      // 1. Extract text from PDF using Python (PyMuPDF)
      const textChunks = await extractTextFromPDF(filePath); // returns array of chunks

      if (!Array.isArray(textChunks) || textChunks.length === 0) {
        throw new Error('No text extracted from PDF');
      }

      // 2. Generate embedding for each chunk & upsert into Pinecone
      const pineconeVectors = await Promise.all(
        textChunks.map(async (chunk, index) => {
          const embedding = await getCohereEmbedding(chunk);
          return {
            id: `${file.originalFilename}-chunk-${index}`, // Unique id for each chunk
            values: embedding,
            metadata: {
              chunk: chunk,
              source: file.originalFilename,
              page: index + 1,
            },
          };
        })
      );
      
      // Pass the array of vectors to the upsert function
      await upsertToPinecone(pineconeVectors); // Bulk upsert
      

      // 3. Upload file to S3
      const fileUrl = await uploadFileToS3(file);

      // 4. Clean up temp file
      fs.unlinkSync(filePath);

      return res.status(200).json({
        message: 'File processed and indexed successfully',
        chunks: pineconeVectors.length,
        fileUrl,
      });
    } catch (error) {
      console.error('Processing error:', error);
      return res.status(500).json({ error: 'Error processing file' });
    }
  });
}

// Upload PDF to AWS S3
const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `uploads/${file.originalFilename}`,
    Body: fs.createReadStream(file.filepath),
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('S3 upload failed');
  }
};
