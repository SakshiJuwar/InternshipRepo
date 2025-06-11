import { getCohereEmbedding } from '@/lib/cohere';
import { extractTextFromPDF } from '@/lib/pdfParser';
import { getPineconeIndex } from '@/lib/pinecone';
import { writeFile } from 'fs/promises';
import { unlink } from 'fs';

export async function POST(req) {
  const data = await req.formData();
  const file = data.get('file');

  if (!file) {
    return new Response(JSON.stringify({ error: 'File is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = `./tmp/${file.name}`;
    await writeFile(filePath, buffer);

    // Extract text from PDF
    const text = await extractTextFromPDF(filePath);
    const embedding = await getCohereEmbedding(text);

    // Index embedding in Pinecone
    const index = await getPineconeIndex('pdf-chatbot');
    await index.upsert([{ id: file.name, values: embedding }]);

    // Clean up the uploaded file after processing
    await unlink(filePath);

    return new Response(
      JSON.stringify({ message: 'PDF uploaded & indexed successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Error during PDF upload and indexing:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
