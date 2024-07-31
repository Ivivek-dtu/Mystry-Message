import { HfInference } from '@huggingface/inference';
import { HuggingFaceStream, StreamingTextResponse } from 'ai';

// Create a new Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
  try {
    // Extract the `prompt` from the body of the request
    const randomNum = Math.floor(Math.random() * 10000);
    const prompt = `${randomNum}. Create a list of 3 open-ended and engaging questions formatted as a single string. These questions are for an anonymous social messaging platform and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. Try not to add any prefix like Number or '-' to every sentence starting `
  
    const response = Hf.textGenerationStream({
      model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
      inputs: `<|prompter|>${prompt}<|endoftext|><|assistant|>`,
      parameters: {
        max_new_tokens: 200,
        // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
        typical_p: 0.2,
        repetition_penalty: 1,
        truncate: 1000,
        return_full_text: false,
      },
    });
  
    // Convert the response into a friendly text-stream
    const stream = HuggingFaceStream(response);
  
    // Respond with the stream
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    throw error;
    
  }
}