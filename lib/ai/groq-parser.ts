import Groq from "groq-sdk";
import { z } from "zod";

const FALLBACK_MODELS = [
  "moonshotai/kimi-k2-instruct-0905", // Primary: Latest Kimi K2
  "meta-llama/llama-4-maverick-17b-128e-instruct", // Fallback 1
  "meta-llama/llama-4-scout-17b-16e-instruct", // Fallback 2
] as const;

function createGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY environment variable is missing");
  }
  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

const OrderDetailsSchema = z.object({
  order_id: z.string(),
  sender_name: z.string().nullable(),
  sender_phone: z.string().nullable(),
  message_card: z.string().nullable(),
  delivery_date: z.string().nullable(),
  confidence_score: z.number().min(0).max(1),
  parsing_notes: z.string().nullable(),
});

export type OrderDetails = z.infer<typeof OrderDetailsSchema>;

function isRetryableError(error: any): boolean {
  const status = error?.status;
  return status === 503 || status === 429 || (status >= 500 && status < 600);
}

export async function parseOrderDetailsWithAI(
  messageText: string,
  orderId: string,
): Promise<OrderDetails> {
  let lastError: any;

  for (let i = 0; i < FALLBACK_MODELS.length; i++) {
    const model = FALLBACK_MODELS[i];

    try {
      console.log(`Attempting AI parsing with model: ${model}`);

      const groq = createGroqClient();
      const completion = await groq.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are a data extraction specialist for a flower delivery service. Extract order details from customer messages.

 IMPORTANT RULES:
 1. Extract ONLY the information that is clearly present in the message
 2. Return null for fields that are not found or unclear
 3. Be lenient with formatting - customers may use different separators (":" or "-") or order
 4. Fields may be in English OR Malay:
    - Sender Name / Nama Pembeli
    - Sender Phone / Nombor Telefon Pembeli
    - Message Card Content / Tulisan atas Kad
    - Delivery Date / Tarikh Penghantaran
 5. Delivery date: Extract ANY date mentioned for delivery (formats: DD/MM/YYYY, DD-MM-YYYY, "9th September", etc.). Ignore day names. Format output as YYYY-MM-DD. Current year is 2025. If year is missing, assume 2025. If year is invalid (not 2025 or 2026), set delivery_date to null and add note in parsing_notes explaining the validation failure.
 6. Phone numbers should be cleaned (remove spaces, keep only digits and +). If multiple numbers, use the first one.
 7. Sender name should be the actual person's name, not business names unless clearly indicated
 8. Message card is the personal message content for the flower card
 9. Confidence score: Based on core fields (sender_name, sender_phone, message_card)
 10. Add parsing notes to explain what was found or missing`,
          },
          {
            role: "user",
            content: `Extract order details from this customer message for order ${orderId}:

 ${messageText}

 Look for these fields (may be in English or Malay):
 - Sender Name / Nama Pembeli (person sending the flowers)
 - Sender Phone / Nombor Telefon Pembeli (contact number, clean and use first if multiple)
 - Message Card Content / Tulisan atas Kad (personal message for flower card)
 - Delivery Date / Tarikh Penghantaran (any date mentioned for delivery, convert to YYYY-MM-DD format)`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "order_details",
            strict: true,
            schema: {
              type: "object",
              properties: {
                order_id: { type: "string" },
                sender_name: { type: ["string", "null"] },
                sender_phone: { type: ["string", "null"] },
                message_card: { type: ["string", "null"] },
                delivery_date: { type: ["string", "null"] },
                confidence_score: { type: "number" },
                parsing_notes: { type: ["string", "null"] },
              },
              required: [
                "order_id",
                "sender_name",
                "sender_phone",
                "message_card",
                "delivery_date",
                "confidence_score",
                "parsing_notes",
              ],
              additionalProperties: false,
            },
          },
        },
        temperature: 0.1,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from Groq API");
      }

      const parsed = JSON.parse(response);
      const result = OrderDetailsSchema.parse(parsed);

      // Add model info to parsing notes for debugging
      if (i > 0) {
        result.parsing_notes = `${result.parsing_notes || ""} (Used fallback model: ${model})`;
      }

      console.log(`✅ AI parsing successful with model: ${model}`);
      return result;
    } catch (error) {
      lastError = error;
      console.error(`❌ AI parsing failed with model ${model}:`, error);

      // Check if this is a retryable error (503, 429, 5xx)
      if (!isRetryableError(error)) {
        // Non-retryable error (4xx, validation errors, etc.) - don't try other models
        console.log(
          `Non-retryable error with model ${model}, not trying fallbacks`,
        );
        break;
      }

      // If this is the last model, don't continue
      if (i === FALLBACK_MODELS.length - 1) {
        console.log(`All models exhausted, returning fallback response`);
        break;
      }

      console.log(`Trying next fallback model...`);
    }
  }

  // Return fallback with order_id after all models failed
  return {
    order_id: orderId,
    sender_name: null,
    sender_phone: null,
    message_card: null,
    delivery_date: null,
    confidence_score: 0.0,
    parsing_notes: `AI parsing failed with all models. Last error: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
  };
}

export function isParsingComplete(orderDetails: OrderDetails): boolean {
  // Core fields required: sender_name, sender_phone, message_card
  // delivery_date is optional (only when customer specifies future date)
  return !!(
    orderDetails.sender_name &&
    orderDetails.sender_phone &&
    orderDetails.message_card
  );
}
