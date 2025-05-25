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
      role: 'user',
      content: `
    Available foods:
    ${foodList}
    
    My daily goal is 2200 kcal, 160g protein, 180g carbs, 70g fat.
    
    Generate 3 meals (breakfast, lunch, dinner) using only these foods.
    Each meal must include 1 foods from the list.
    For breakfast, use only typical morning foods (oats, eggs, toast, avocado, yogurt, etc.).
    List each food with grams.
    For each meal, show the total macros (protein, carbs, fat, calories).
    At the end, show the total for all meals, which matches my daily goal.
    
    Output only the results in this exact format (do not explain or show calculations):
    
    Breakfast
    - [amount] [food]
    - [amount] [food]
    Protein: [g] | Carbs: [g] | Fat: [g] | Calories: [kcal]
    
    Lunch
    - ...
    Protein: [g] | Carbs: [g] | Fat: [g] | Calories: [kcal]
    
    Dinner
    - ...
    Protein: [g] | Carbs: [g] | Fat: [g] | Calories: [kcal]
    
    Total (all meals):
    Protein: 160g | Carbs: 180g | Fat: 70g | Calories: 2200kcal

    Note: These meal suggestions are approximate. You can increase or reduce the quantities in any meal to better suit your daily needs
    `
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
