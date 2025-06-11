/*import { NextResponse } from 'next/server';
import { getCohereEmbedding } from '../../lib/cohere';
import { getRelevantChunksFromPinecone } from '../../lib/pinecone';
import { getCompletion } from '../../lib/openai';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    // Embed question
    const embedRes = await getCohereEmbedding.embed({ texts: [prompt], model: 'embed-english-v3.0' });
    const questionEmbedding = embedRes.body.embeddings[0];

    // Retrieve chunks
    const relevantChunks = await getRelevantChunksFromPinecone(questionEmbedding, 5);
    const context = relevantChunks.join('\n\n');

    // Get completion
    const answer = await getCompletion(prompt, context);

    return NextResponse.json({ response: answer });
  } catch (err) {
    console.error('Chat error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}*/


import { NextResponse } from 'next/server';
import { getCohereEmbedding, getCohereAnswer} from '../../lib/cohere';
import { getRelevantChunksFromPinecone } from '../../lib/pinecone';
//import { getCompletion } from '../../lib/openai';

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = JSON.parse(req.body);

    const questionEmbedding = await getCohereEmbedding(prompt);
    const relevantChunks = await getRelevantChunksFromPinecone(questionEmbedding, 5);
   // const context = relevantChunks.join('\n\n');
   // const answer = await getCohereAnswer(prompt, context);
   // ✅ Keep it as an array for Cohere R+
const contextChunks = await getRelevantChunksFromPinecone(questionEmbedding, 5);
const answer = await getCohereAnswer(prompt, contextChunks);


    return res.status(200).json({ response: answer });

  } catch (err) {
    console.error('💥 Chat error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}


/*// 1. Embed the user's question
const questionEmbedding = await getCohereEmbedding(userQuestion);

// 2. Query Pinecone with questionEmbedding and get top matching chunks (contextChunks)

// 3. Get answer using Command R+
const answer = await getCohereAnswer(userQuestion, contextChunks);*/
