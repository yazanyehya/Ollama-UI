import { createOllama } from 'ollama-ai-provider';
import { streamText, convertToCoreMessages, CoreMessage, UserContent } from 'ai';
import foods from '../../../../data/foods.json';

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages, selectedModel, data } = await req.json();

  const ollamaUrl = process.env.OLLAMA_URL;
  const initialMessages = messages.slice(0, -1);
  const currentMessage = messages[messages.length - 1];

  const ollama = createOllama({ baseURL: ollamaUrl + "/api" });

  const foodList = Object.entries(foods)
    .map(([name, macros]) =>
      `${name}: ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fat}g fat, ${macros.calories} kcal`
    )
    .join('\n');

    const systemPrompt: CoreMessage = {
      role: 'system',
      content: `You are a nutritionist. Generate 3 meals (breakfast, lunch, dinner) using these foods:
    
    ${foodList}
    The user will give you daily macro goals (calories, protein, carbs, fat).
    Your response must generate 3 meals (breakfast, lunch, dinner) that stay within ±10% of each target.
    Each meal:
    - 2–4 foods
    - Specify grams per food
    - Calculate total macros for the meal
    - Format:
    
    Breakfast  
    - 200g chicken breast  
    - 100g oats  
    Protein: __g | Carbs: __g | Fat: __g | Calories: __ kcal
    
    Lunch ...
    Dinner ...
    Total: ...`
    };
    

    
    
    
    
    
    

  const messageContent: UserContent = [{ type: 'text', text: currentMessage.content }];

  data?.images?.forEach((imageUrl: string) => {
    const image = new URL(imageUrl);
    messageContent.push({ type: 'image', image });
  });

  const result = await streamText({
    model: ollama('phi4-mini'), 
    messages: [
      systemPrompt,
      ...convertToCoreMessages(initialMessages),
      { role: 'user', content: messageContent },
    ],
  });

  return result.toDataStreamResponse();
}
