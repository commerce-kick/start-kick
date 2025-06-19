//@ts-nocheck
import { useChat } from "@ai-sdk/react"
import { AlertCircle, Bot, Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { MiniProductCardWithSuspense } from "@/components/commerce/mini-product-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { genAIResponse } from "@/integrations/ai/ai"
import { Link } from "@tanstack/react-router"
import type { UIMessage } from "ai"

// Update the MiniProductCard to use the correct product structure
function MiniProductCard({ product }: { product: any }) {
  return (
    <Link to="/products/$productId" params={{ productId: product.productId }}>
      <div className="space-y-2 rounded-lg border p-3">
        {product.image ? (
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.productName || "Product"}
            className="h-32 w-full rounded object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = "/placeholder.svg?height=128&width=128&text=No+Image"
            }}
          />
        ) : (
          <div className="h-32 w-full rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
        <div>
          <h3 className="line-clamp-2 text-sm font-medium">{product.productName}</h3>
          {product.price && <p className="font-semibold text-green-600">{product.price}</p>}
          {product.brand && <p className="text-xs text-gray-500">{product.brand}</p>}
        </div>
      </div>
    </Link>
  )
}

function Messages({
  messages,
  toolResults,
}: {
  messages: Array<UIMessage>
  toolResults: Map<string, any>
}) {
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  if (!messages.length) {
    return (
      <div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">Ask about products!</div>
    )
  }

  return (
    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
      {messages.map(({ id, role, content, parts }) => (
        <div key={id} className={`py-2 ${role === "assistant" ? "bg-muted/30" : ""}`}>
          {content && (
            <div className="flex items-start gap-2 px-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  role === "assistant" ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
              >
                {role === "assistant" ? <Bot className="w-3 h-3" /> : "U"}
              </div>
              <div className="flex-1 text-sm">{content}</div>
            </div>
          )}

          {/* Tool results with client-side data fetching */}
          {parts
            ?.filter((part) => part.type === "tool-invocation")
            .map((toolCall) => {
              const toolResult = toolResults.get(toolCall.toolInvocation.toolCallId)

              return (
                <div key={toolCall.toolInvocation.toolCallId} className="mt-2 mx-3">
                  {/* Categories */}
                  {toolCall.toolInvocation.toolName === "getCategory" && toolResult?.categories && (
                    <div className="text-xs space-y-1">
                      <div className="font-medium">Categories:</div>
                      <div className="flex flex-wrap gap-1">
                        {toolResult.categories.slice(0, 4).map((cat: any) => (
                          <span key={cat.id} className="bg-blue-100 px-2 py-1 rounded text-xs">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  {toolCall.toolInvocation.toolName === "getProducts" && toolResult && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium">Found {toolResult.total} products</div>
                      {toolResult.hits && toolResult.hits.length > 0 && (
                        <div className="grid grid-cols-1 gap-2">
                          {toolResult.hits.map((product: any) => (
                            <MiniProductCard key={product.productId} product={product} />
                          ))}
                        </div>
                      )}
                      {toolResult.colors && toolResult.colors.length > 0 && (
                        <div className="text-xs">
                          <span className="font-medium">Available colors: </span>
                          <span className="text-gray-600">{toolResult.colors.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Single product recommendation */}
                  {toolCall.toolInvocation.toolName === "recommendProduct" && toolResult?.productId && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium">Recommended Product:</div>
                      <MiniProductCardWithSuspense
                        productId={toolResult.productId}
                        onAddToCart={(id) => console.log("Add to cart:", id)}
                        onToggleWishlist={(id) => console.log("Toggle wishlist:", id)}
                      />
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      ))}
    </div>
  )
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [toolResults, setToolResults] = useState<Map<string, any>>(new Map())
  const [rateLimitError, setRateLimitError] = useState<string | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    initialMessages: [],
    fetch: async (_url, options) => {
      try {
        const response = await genAIResponse({
          data: JSON.parse(options!.body! as string),
        })

        if (response.status === 429) {
          const errorData = await response.json()
          setRateLimitError("Rate limit reached. Please wait 60 seconds.")
          throw new Error(errorData.error)
        }

        setRateLimitError(null)
        return response
      } catch (error) {
        console.error("Chat error:", error)
        throw error
      }
    },
    onToolCall: async (call) => {
      try {
        let result
        const tools = await import("@/integrations/ai/tools").then((m) => m.default())

        switch (call.toolCall.toolName) {
          case "getProducts":
            result = await (await tools).getProducts.execute(call.toolCall.args)
            break
          case "recommendProduct":
            result = await (await tools).recommendProduct.execute(call.toolCall.args)
            break
          case "getCategory":
            result = await (await tools).getCategory.execute(call.toolCall.args)
            break
        }

        setToolResults((prev) => {
          const newMap = new Map(prev)
          newMap.set(call.toolCall.toolCallId, result)
          return newMap
        })

        return "OK"
      } catch (error) {
        return "Error"
      }
    },
  })

  return (
    <div className="fixed top-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="sm" className="shadow-md">
            <Bot className="w-4 h-4 mr-2" />
            AI
          </Button>
        </SheetTrigger>
        <SheetContent className="flex h-[calc(100vh-2rem)] w-[400px] flex-col p-0">
          <SheetHeader className="border-b px-3 py-2">
            <SheetTitle className="text-sm">AI Assistant</SheetTitle>
          </SheetHeader>

          <Messages messages={messages} toolResults={toolResults} />

          <div className="border-t p-3">
            {rateLimitError && (
              <Alert className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{rateLimitError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about products..."
                  className="w-full text-sm border rounded px-3 py-2 pr-10"
                  disabled={isLoading || !!rateLimitError}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || isLoading || !!rateLimitError}
                  className="absolute right-1 top-1 h-6 w-6 p-0"
                  variant="ghost"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
