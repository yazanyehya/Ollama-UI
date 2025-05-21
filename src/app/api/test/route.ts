export async function GET(req: Request) {
  return new Response(JSON.stringify({
    OLLAMA_URL: process.env.OLLAMA_URL || 'not set'
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
} 