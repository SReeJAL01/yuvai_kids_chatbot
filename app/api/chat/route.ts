import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, userName, userAge, favoriteColor } = await req.json()

  // Extract any image URLs from the messages
  const imageMessages = messages.filter((m: any) => m.imageUrl)
  const latestImageMessage = imageMessages.length > 0 ? imageMessages[imageMessages.length - 1] : null

  // Prepare the system message based on user info
  let systemMessage = `You are YuvAi, a friendly AI assistant for children. 
  You're talking to ${userName || "a child"}, who is ${userAge || "young"} years old.
  Keep your responses appropriate for this age, using simple language and positive, encouraging tone.
  Be educational, fun, and safe. Never use complex terminology without explaining it.
  Avoid any scary, violent, or inappropriate content.`

  // Add image analysis capabilities to the system message
  if (latestImageMessage) {
    systemMessage += `
    You can analyze images that the child uploads. When describing images:
    1. Be enthusiastic and positive
    2. Point out interesting details in a way children would understand
    3. Ask questions about what they see in the image to engage them
    4. If appropriate, share a fun fact related to what's in the image
    5. Keep descriptions brief and engaging`
  }

  // Process messages to include image content if present
  const processedMessages = messages.map((message: any) => {
    if (message.imageUrl) {
      return {
        role: message.role,
        content: [
          { type: "text", text: message.content },
          { type: "image_url", image_url: { url: message.imageUrl } },
        ],
      }
    }
    return message
  })

  const result = streamText({
    model: openai("gpt-4o"),
    messages: processedMessages,
    system: systemMessage,
  })

  return result.toDataStreamResponse()
}
