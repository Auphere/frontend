import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // TODO: Replace with Auphere backend integration
  // This is a placeholder that uses OpenAI directly
  // In production, this should call auphere-backend at localhost:8000
  
  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: await convertToModelMessages(messages),
    system: `Eres Auphere, un asistente inteligente especializado en descubrimiento y planificación de salidas nocturnas.
    
Tu objetivo es ayudar a los usuarios a:
- Descubrir bares, restaurantes, clubs y lugares para salir
- Crear planes multi-parada para sus salidas nocturnas
- Obtener recomendaciones personalizadas basadas en sus preferencias

Siempre sé amigable, entusiasta y enfócate en crear experiencias memorables.`,
  });

  return result.toUIMessageStreamResponse();
}

