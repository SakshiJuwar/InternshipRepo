import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

export const upsertToPinecone = async (vectors) => {
  const index = pinecone.Index(process.env.PINECONE_INDEX);

  //  Upsert directly with the array, not as { vectors }
  await index.upsert(vectors);
};





// Function to retrieve relevant chunks based on the question embedding
export const getRelevantChunksFromPinecone = async (questionEmbedding) => {
  const index = pinecone.Index(process.env.PINECONE_INDEX);
  
  // Query the Pinecone index with the question's embedding
  const queryResponse = await index.query({
    vector: questionEmbedding,
    topK: 5, // Number of relevant chunks you want to retrieve
    includeValues: true,
    includeMetadata: true,
  });

  // Return the most relevant chunks (texts) from the query response
  return queryResponse.matches.map(match => match.metadata.text);
};



export const getPineconeIndex = async (indexName) => {
  return pinecone.Index(indexName);
};