import getTools from "@/integrations/ai/tools"
import { anthropic } from "@ai-sdk/anthropic"
import { createServerFn } from "@tanstack/react-start"
import { streamText } from "ai"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

// Ultra-minimal system prompt
const SYSTEM_PROMPT = `AI shopping assistant. Workflow:
1. getCategory(id="root") for categories
2. getProducts({refine:["cgid=ID"]}) to browse
3. Add filters: {refine:["cgid=ID","c_refinementColor=White"]}
Use actual category IDs, browse don't search.`

// Aggressive conversation management
function getEssentialMessages(messages: Message[]): Message[] {
  if (messages.length <= 2) return messages

  // Keep only the last user message and last assistant response
  const lastUserMsg = messages.filter((m) => m.role === "user").slice(-1)[0]
  const lastAssistantMsg = messages.filter((m) => m.role === "assistant").slice(-1)[0]

  return [lastUserMsg, lastAssistantMsg].filter(Boolean)
}

export const genAIResponse = createServerFn({ method: "POST", response: "raw" })
  .validator((d: { messages: Array<Message> }) => d)
  .handler(async ({ data }) => {
    // Ultra-aggressive message trimming
    const essentialMessages = getEssentialMessages(data.messages)

    console.log(`Token optimization: ${data.messages.length} → ${essentialMessages.length} messages`)

    const tools = await getTools()

    try {
      const result = streamText({
        model: anthropic("claude-3-5-haiku-20241022"),
        messages: essentialMessages.map((msg) => ({
          role: msg.role,
          content: msg.content.trim(),
        })),
        system: SYSTEM_PROMPT,
        tools,
        maxSteps: 5, // Further reduced
        toolChoice: "auto",
        maxTokens: 1000, // Limit response length
      })

      return result.toDataStreamResponse()
    } catch (error) {
      console.error("AI Error:", error)

      if (error instanceof Error && error.message.includes("rate limit")) {
        return new Response(JSON.stringify({ error: "Rate limit. Wait 60s." }), {
          status: 429,
          headers: { "Content-Type": "application/json" },
        })
      }

      return new Response(JSON.stringify({ error: "Service unavailable" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
  })
