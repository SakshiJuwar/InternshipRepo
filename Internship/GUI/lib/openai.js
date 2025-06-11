/*import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

export const getCompletion = async (prompt) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    max_tokens: 500,
    temperature: 0,
  });
  return response.data.choices[0].text;
};
*/

/*
//2nd code
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

// Function to generate a response from OpenAI's GPT model using the question and context
export const getCompletion = async (question, context) => {
  const prompt = `Answer the following question based on the context provided:\n\nContext: ${context}\n\nQuestion: ${question}`;

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',  // You can switch to GPT-4 if needed
      prompt,
      max_tokens: 500,
      temperature: 0.7,  // You can tweak this based on your needs
    });

    return response.data.choices[0].text.trim();  // Extract the response text and return
  } catch (error) {
    console.error('Error generating completion:', error);
    throw new Error('Failed to generate completion from OpenAI');
  }
};
*/


// lib/openai.js 3rd code
// lib/openai.js

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your .env.local file
});

/**
 * Generates a response from OpenAI's GPT model using the question and context
 *
 * @param {string} question - The user's question
 * @param {string} context - Relevant context text retrieved from Pinecone
 * @returns {Promise<string>} - Generated answer from OpenAI
 */
export const getCompletion = async (question, context) => {
  const prompt = `Answer the following question based on the context provided:\n\nContext: ${context}\n\nQuestion: ${question}`;

  try {
    const response = await openai.completions.create({
      model: 'gemini-1.5-flash', // You can use 'gpt-3.5-turbo-instruct' or GPT-4 too
      prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating completion:', error);
    throw new Error('Failed to generate completion from OpenAI');
  }
};
