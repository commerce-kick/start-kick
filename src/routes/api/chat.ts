import { getCategoriesServer, getProductsServer } from "@/tools/getProducts";
import { chat, toStreamResponse } from "@tanstack/ai";
import { openai } from "@tanstack/ai-openai";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Check for API key
        if (!process.env.OPENAI_API_KEY) {
          return new Response(
            JSON.stringify({
              error: "OPENAI_API_KEY not configured",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        const { messages, conversationId } = await request.json();

        try {
          // Create a streaming chat response
          const stream = chat({
            adapter: openai(),
            messages,
            model: "gpt-4o",
            conversationId,
            tools: [getCategoriesServer, getProductsServer],
          });

          // Convert stream to HTTP response
          return toStreamResponse(stream);
        } catch (error) {
          return new Response(
            JSON.stringify({
              error:
                error instanceof Error ? error.message : "An error occurred",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
