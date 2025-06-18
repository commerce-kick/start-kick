import { useChat } from "@ai-sdk/react";
import { Bot, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

// Define types for tool results
interface ToolResult {
  type: string;
  toolInvocationId: string;
  result: any;
}

import ProductCard from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { genAIResponse } from "@/integrations/ai/ai";
import type { UIMessage } from "ai";

function Messages({ messages, toolResults }: { messages: Array<UIMessage>, toolResults: Map<string, any> }) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Ask me anything about our products! I'm here to help.
      </div>
    );
  }

  return (
    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
      {messages.map(({ id, role, content, parts }) => (
        <div
          key={id}
          className={`py-3 ${
            role === "assistant"
              ? "bg-muted/50"
              : "bg-transparent"
          }`}
        >
          {content.length > 0 && (
            <div className="flex items-start gap-3 px-4">
              {role === "assistant" ? (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
              ) : (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                  You
                </div>
              )}
              <div className="min-w-0 flex-1">
                <ReactMarkdown
                  rehypePlugins={[
                    rehypeRaw,
                    rehypeSanitize,
                    rehypeHighlight,
                    remarkGfm,
                  ]}
                  components={{
                    // @ts-ignore - className is valid but TypeScript doesn't recognize it
                    p: ({ node, ...props }) => <p className="prose prose-sm dark:prose-invert max-w-none" {...props} />
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          )}
          {parts
            .filter((part) => part.type === "tool-invocation")
            .map((toolCall) => {
              // Get the tool result from our stored results
              const toolResult = toolResults.get(toolCall.toolInvocation.toolCallId);

              console.log("Tool processing:", {
                toolName: toolCall.toolInvocation.toolName,
                toolCallId: toolCall.toolInvocation.toolCallId,
                hasStoredResult: !!toolResult,
                storedResultKeys: toolResult ? Object.keys(toolResult) : []
              });

              return (
                <div
                  key={`${toolCall.toolInvocation.toolName}-${toolCall.toolInvocation.toolCallId}`}
                  className="mx-auto max-w-[90%] mt-4 px-4"
                >
                  {/* Debug info - temporarily show this */}
                  <div className="mb-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
                    <strong>Debug:</strong> Tool: {toolCall.toolInvocation.toolName} | 
                    Has Result: {toolResult ? 'YES' : 'NO'} | 
                    Tool ID: {toolCall.toolInvocation.toolCallId}
                    {toolResult && (
                      <div className="mt-1">
                        <strong>Result Keys:</strong> {Object.keys(toolResult || {}).join(', ')}
                      </div>
                    )}
                    <div className="mt-1 text-[10px]">
                      <strong>Tool Args:</strong> {JSON.stringify(toolCall.toolInvocation.args)}
                    </div>
                  </div>

                  {/* Render ProductCard for recommendProduct tool */}
                  {toolCall.toolInvocation.toolName === "recommendProduct" && toolResult && (
                    <Card className="overflow-hidden border shadow-sm">
                      <div className="p-4">
                        <h4 className="text-sm font-medium mb-2">Recommended Product</h4>
                        <ProductCard 
                          product={toolResult} 
                          className="border-0 shadow-none" 
                          showBrand={true}
                          showDescription={true}
                        />
                      </div>
                    </Card>
                  )}

                  {/* Fallback - show raw data if ProductCard doesn't work */}
                  {toolCall.toolInvocation.toolName === "recommendProduct" && toolResult && (
                    <Card className="overflow-hidden border shadow-sm mt-2">
                      <div className="p-4">
                        <h4 className="text-sm font-medium mb-2">Raw Product Data</h4>
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                          {JSON.stringify(toolResult, null, 2)}
                        </pre>
                      </div>
                    </Card>
                  )}

                  {/* Product search results */}
                  {toolCall.toolInvocation.toolName === "getProducts" && toolResult && (
                    <Card className="overflow-hidden border shadow-sm">
                      <div className="p-4">
                        <h4 className="text-sm font-medium mb-2">Product Search Results</h4>
                        
                        {toolResult && (
                          <div className="space-y-3">
                            {/* Product count */}
                            <div className="text-xs text-muted-foreground">
                              Found {toolResult.total || 0} products
                            </div>
                            
                            {/* Available refinements */}
                            {toolResult.refinements && toolResult.refinements.length > 0 && (
                              <div className="border-t pt-2">
                                <div className="text-xs font-medium mb-1">Available Filters:</div>
                                <div className="space-y-2">
                                  {toolResult.refinements.map((refinement: any, index: number) => (
                                    <div key={index} className="text-xs">
                                      <div className="font-medium text-green-700">
                                        {refinement.label || refinement.attributeId}
                                        <span className="ml-2 text-[10px] font-mono bg-green-100 px-1 py-0.5 rounded">
                                          {refinement.attributeId}
                                        </span>
                                      </div>
                                      {refinement.values && refinement.values.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {refinement.values.slice(0, 8).map((value: any, vIndex: number) => (
                                            <div key={vIndex} className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 rounded text-[10px]">
                                              <span className="font-medium">{value.label || value.value}</span>
                                              {value.hitCount && <span className="text-gray-500 ml-1">({value.hitCount})</span>}
                                              <div className="text-[9px] text-blue-600 font-mono mt-0.5">
                                                {refinement.attributeId}={value.value}
                                              </div>
                                            </div>
                                          ))}
                                          {refinement.values.length > 8 && (
                                            <div className="text-[10px] text-muted-foreground self-center">
                                              +{refinement.values.length - 8} more
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2 p-2 bg-blue-50 rounded text-[10px]">
                                  <strong>💡 Tip:</strong> Tell me about specific preferences (color, size, price range) and I'll apply these filters automatically!
                                </div>
                              </div>
                            )}
                            
                            {/* Product hits preview */}
                            {toolResult.hits && toolResult.hits.length > 0 && (
                              <div className="border-t pt-2">
                                <div className="text-xs font-medium mb-1">Products:</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {toolResult.hits.slice(0, 4).map((product: any) => (
                                    <div key={product.productId} className="text-xs p-1.5 bg-muted/20 rounded">
                                      <div className="font-medium truncate">{product.productName}</div>
                                      {product.price && (
                                        <div className="text-[10px]">{product.price.formatted || product.price}</div>
                                      )}
                                      <div className="text-[10px] text-muted-foreground truncate">
                                        ID: {product.productId}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {toolResult.hits.length > 4 && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    +{toolResult.hits.length - 4} more products
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Full JSON data (collapsed) */}
                            <details className="text-xs mt-2">
                              <summary className="cursor-pointer text-muted-foreground">View raw data</summary>
                              <div className="mt-1 overflow-auto max-h-40 bg-muted/50 p-2 rounded-md">
                                <pre className="text-[10px]">
                                  {JSON.stringify(toolResult, null, 2)}
                                </pre>
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Category information */}
                  {toolCall.toolInvocation.toolName === "getCategory" && toolResult && (
                    <Card className="overflow-hidden border shadow-sm">
                      <div className="p-4">
                        <h4 className="text-sm font-medium mb-2">
                          {toolCall.toolInvocation.args.id === "root" ? 
                            "🏪 Site Category Structure" : 
                            "📂 Category Information"
                          }
                        </h4>
                        {toolResult && (
                          <div className="space-y-3">
                            {/* Main category info */}
                            {toolCall.toolInvocation.args.id !== "root" && (
                              <div>
                                <div className="font-medium">{toolResult.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  ID: <span className="font-mono">{toolResult.id}</span>
                                  {toolResult.parentCategoryId && (
                                    <span> (Parent: {toolResult.parentCategoryId})</span>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Subcategories with IDs for search */}
                            {toolResult.categories && toolResult.categories.length > 0 && (
                              <div className={toolCall.toolInvocation.args.id !== "root" ? "border-t pt-2" : ""}>
                                <div className="text-xs font-medium mb-2">
                                  {toolCall.toolInvocation.args.id === "root" ? 
                                    "Available Categories:" : 
                                    "Subcategories:"
                                  }
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                  {toolResult.categories.map((category: any) => (
                                    <div key={category.id} className={`text-xs p-3 rounded border-l-4 ${
                                      toolCall.toolInvocation.args.id === "root" ? 
                                        "bg-green-50 border-green-400" : 
                                        "bg-muted/30 border-muted"
                                    }`}>
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <div className="font-medium text-sm">{category.name}</div>
                                          <div className="text-[10px] mt-1 font-mono bg-gray-100 px-2 py-1 rounded">
                                            cgid={category.id}
                                          </div>
                                          {category.categories && category.categories.length > 0 && (
                                            <div className="mt-2">
                                              <div className="text-[10px] font-medium text-gray-600 mb-1">
                                                Subcategories ({category.categories.length}):
                                              </div>
                                              <div className="flex flex-wrap gap-1">
                                                {category.categories.slice(0, 4).map((subcat: any) => (
                                                  <span key={subcat.id} className="text-[9px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded">
                                                    {subcat.name}
                                                  </span>
                                                ))}
                                                {category.categories.length > 4 && (
                                                  <span className="text-[9px] text-gray-500">+{category.categories.length - 4} more</span>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Usage hint */}
                            <div className="text-xs text-muted-foreground border-t pt-2">
                              <div className="font-medium mb-1">
                                {toolCall.toolInvocation.args.id === "root" ? 
                                  "🎯 Next Steps:" : 
                                  "How to use:"
                                }
                              </div>
                              <div className="bg-muted/20 p-1.5 rounded">
                                {toolCall.toolInvocation.args.id === "root" ? 
                                  "Now I can search products using these category IDs. Tell me what you're looking for!" :
                                  "To search products in this category, use:"
                                }
                                {toolCall.toolInvocation.args.id !== "root" && (
                                  <pre className="mt-1 bg-muted/40 p-1 rounded text-[10px] overflow-x-auto">
                                    {`getProducts(refine: ["cgid=${toolResult?.id || ''}"])`}
                                  </pre>
                                )}
                              </div>
                            </div>
                            
                            {/* Full JSON data (collapsed) */}
                            <details className="text-xs">
                              <summary className="cursor-pointer text-muted-foreground">View raw data</summary>
                              <div className="mt-1 overflow-auto max-h-40 bg-muted/50 p-2 rounded-md">
                                <pre className="text-[10px]">
                                  {JSON.stringify(toolResult, null, 2)}
                                </pre>
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                  
                  {/* Product search results */}
                  {toolCall.toolInvocation.toolName === "getProducts" && toolResult && (
                    <Card className="overflow-hidden border shadow-sm">
                      <div className="p-4">
                        <h4 className="text-sm font-medium mb-2">Product Search Results</h4>
                        
                        {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                        {toolResult.result && (
                          <div className="space-y-3">
                            {/* Product count */}
                            <div className="text-xs text-muted-foreground">
                              {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                              Found {toolResult.result.total || 0} products
                            </div>
                            
                            {/* Available refinements */}
                            {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                            {toolResult.result.refinements && toolResult.result.refinements.length > 0 && (
                              <div className="border-t pt-2">
                                <div className="text-xs font-medium mb-1">Available Refinements:</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                                  {toolResult.result.refinements.map((refinement: any, index: number) => (
                                    <div key={index} className="text-xs">
                                      <div className="font-medium">{refinement.label || refinement.attributeId}</div>
                                      {refinement.values && refinement.values.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {refinement.values.slice(0, 5).map((value: any, vIndex: number) => (
                                            <div key={vIndex} className="px-1.5 py-0.5 bg-muted/30 rounded text-[10px]">
                                              {value.label || value.value} {value.hitCount && `(${value.hitCount})`}
                                            </div>
                                          ))}
                                          {refinement.values.length > 5 && (
                                            <div className="text-[10px] text-muted-foreground">
                                              +{refinement.values.length - 5} more
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Product hits preview */}
                            {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                            {toolResult.result.hits && toolResult.result.hits.length > 0 && (
                              <div className="border-t pt-2">
                                <div className="text-xs font-medium mb-1">Products:</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                                  {toolResult.result.hits.slice(0, 4).map((product: any) => (
                                    <div key={product.productId} className="text-xs p-1.5 bg-muted/20 rounded">
                                      <div className="font-medium truncate">{product.productName}</div>
                                      {product.price && (
                                        <div className="text-[10px]">{product.price.formatted || product.price}</div>
                                      )}
                                      <div className="text-[10px] text-muted-foreground truncate">
                                        ID: {product.productId}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                                {toolResult.result.hits.length > 4 && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                                    +{toolResult.result.hits.length - 4} more products
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Full JSON data (collapsed) */}
                            <details className="text-xs mt-2">
                              <summary className="cursor-pointer text-muted-foreground">View raw data</summary>
                              <div className="mt-1 overflow-auto max-h-40 bg-muted/50 p-2 rounded-md">
                                <pre className="text-[10px]">
                                  {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                                  {JSON.stringify(toolResult.result, null, 2)}
                                </pre>
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                  
                  {/* Category information */}
                  {toolCall.toolInvocation.toolName === "getCategory" && toolResult && (
                    <Card className="overflow-hidden border shadow-sm">
                      <div className="p-4">
                        <h4 className="text-sm font-medium mb-2">Category Information</h4>
                        {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                        {toolResult.result && (
                          <div className="space-y-3">
                            {/* Main category info */}
                            <div>
                              {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                              <div className="font-medium">{toolResult.result.name}</div>
                              {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                              <div className="text-xs text-muted-foreground">
                                {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                                ID: <span className="font-mono">{toolResult.result.id}</span>
                                {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                                {toolResult.result.parentCategoryId && (
                                  <span> (Parent: {toolResult.result?.parentCategoryId})</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Subcategories with IDs for search */}
                            {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                            {toolResult.result.categories && toolResult.result.categories.length > 0 && (
                              <div className="border-t pt-2">
                                <div className="text-xs font-medium mb-1">Subcategories:</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                                  {toolResult.result.categories.map((category: any) => (
                                    <div key={category.id} className="text-xs p-2 bg-muted/30 rounded">
                                      <div className="font-medium">{category.name}</div>
                                      <div className="text-[10px] mt-0.5">
                                        Search with: <span className="font-mono bg-muted/50 px-1 py-0.5 rounded">cgid={category.id}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Usage hint */}
                            <div className="text-xs text-muted-foreground border-t pt-2">
                              <div className="font-medium mb-1">How to use:</div>
                              <div className="bg-muted/20 p-1.5 rounded">
                                To search products in this category, use:
                                <pre className="mt-1 bg-muted/40 p-1 rounded text-[10px] overflow-x-auto">
                                  {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                                  {`getProducts(refine: ["cgid=${toolResult?.result?.id || ''}"])`}
                                </pre>
                              </div>
                            </div>
                            
                            {/* Full JSON data (collapsed) */}
                            <details className="text-xs">
                              <summary className="cursor-pointer text-muted-foreground">View raw data</summary>
                              <div className="mt-1 overflow-auto max-h-40 bg-muted/50 p-2 rounded-md">
                                <pre className="text-[10px]">
                                  {/* @ts-ignore - result exists at runtime but TypeScript doesn't recognize it */}
                                  {JSON.stringify(toolResult.result, null, 2)}
                                </pre>
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [toolResults, setToolResults] = useState<Map<string, any>>(new Map());
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    initialMessages: [],
    fetch: async (_url, options) => {
      console.log("Chat fetch called with options:", options);
      try {
        const { messages } = JSON.parse(options!.body! as string);
        console.log("Sending messages to AI:", JSON.stringify(messages, null, 2));
        
        console.log("Calling genAIResponse...");
        const response = await genAIResponse({
          data: {
            messages,
          },
        });
        
        console.log("genAIResponse returned:", {
          status: response.status,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries()),
        });
        
        // Check if the response is valid
        if (!response.ok) {
          console.error("AI response not OK:", response.status, response.statusText);
          throw new Error(`AI response error: ${response.status} ${response.statusText}`);
        }
        
        // Check if the response is a valid stream
        if (!response.body) {
          console.error("AI response has no body");
          throw new Error("AI response has no body");
        }
        
        return response;
      } catch (error) {
        console.error("Error in chat fetch:", error);
        throw error;
      }
    },
    onToolCall: async (call) => {
      console.log("Tool call received:", JSON.stringify(call.toolCall, null, 2));
      
      // Execute the tool call and store the result
      try {
        let result;
        
        if (call.toolCall.toolName === "getProducts") {
          const tools = await import("@/integrations/ai/tools").then(m => m.default());
          result = await (await tools).getProducts.execute(call.toolCall.args);
        } else if (call.toolCall.toolName === "recommendProduct") {
          const tools = await import("@/integrations/ai/tools").then(m => m.default());
          result = await (await tools).recommendProduct.execute(call.toolCall.args);
        } else if (call.toolCall.toolName === "getCategory") {
          const tools = await import("@/integrations/ai/tools").then(m => m.default());
          result = await (await tools).getCategory.execute(call.toolCall.args);
        }
        
        // Store the result with the tool call ID
        setToolResults(prev => new Map(prev).set(call.toolCall.toolCallId, result));
        
        console.log(`Tool ${call.toolCall.toolName} executed, result stored for ID:`, call.toolCall.toolCallId);
        
        return `Tool ${call.toolCall.toolName} executed successfully`;
      } catch (error) {
        console.error(`Error executing tool ${call.toolCall.toolName}:`, error);
        return `Error executing tool: ${error}`;
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
    },
    onResponse: (response) => {
      console.log("Chat response received:", {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        hasBody: !!response.body,
      });
    },
    onFinish: (message) => {
      console.log("Chat finished with final message:", {
        id: message.id,
        role: message.role,
        contentLength: message.content.length,
        hasToolCalls: message.parts?.some(part => part.type === 'tool-invocation') || false,
        hasParts: !!message.parts,
      });
    },
  });

  // Log state changes
  useEffect(() => {
    console.log("Chat state updated:", { 
      messageCount: messages.length, 
      isLoading, 
      hasError: !!error 
    });
    
    if (error) {
      console.error("Chat error state:", error);
    }
  }, [messages, isLoading, error]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            className="flex items-center gap-2 shadow-md"
            size="sm"
          >
            <Bot className="h-4 w-4" />
            AI Assistant
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] md:w-[700px] p-0 flex flex-col h-[calc(100vh-2rem)] max-h-[700px]">
          <SheetHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>AI Shopping Assistant</SheetTitle>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            <Messages messages={messages} toolResults={toolResults} />
          </div>

          <div className="border-t p-4">
            {error && (
              <div className="mb-3 p-2 bg-red-50 text-red-700 rounded-md text-sm">
                Error: {error.message || "Failed to get AI response"}
              </div>
            )}
            <form onSubmit={(e) => {
              console.log("Form submitted");
              handleSubmit(e);
            }}>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about products, recommendations, or help with shopping..."
                  className="w-full resize-none overflow-hidden rounded-md border py-3 pr-10 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={1}
                  style={{ minHeight: "44px", maxHeight: "120px" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height =
                      Math.min(target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8"
                  variant="ghost"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}