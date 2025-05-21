export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  const OLLAMA_URL = process.env.OLLAMA_URL;
  
  if (!OLLAMA_URL) {
    return new Response(
      JSON.stringify({ 
        error: 'OLLAMA_URL environment variable is not set',
        models: []
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`);
    
    if (!res.ok) {
      throw new Error(`Ollama API returned ${res.status}`);
    }
    
    return new Response(res.body, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch models from Ollama',
        models: []
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
