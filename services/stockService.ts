import { GoogleGenAI, Type } from "@google/genai";

/**
 * Fetches real-time prices exclusively for Cryptocurrencies using Gemini 3 Flash.
 * Stocks are handled via manual input in the UI to ensure 100% accuracy.
 */
export const fetchCryptoPrice = async (symbol: string): Promise<number | null> => {
  const upperSymbol = symbol.toUpperCase().trim();

  if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
    console.error("Gemini API Key missing.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Original lightweight model
      contents: `Fetch the current real-time market price for the cryptocurrency ${upperSymbol} in USD. 
      If it is not a cryptocurrency, return 0.
      Return ONLY a JSON object: {"price": <number>}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            price: {
              type: Type.NUMBER,
              description: "Current crypto price in USD."
            }
          },
          required: ["price"]
        }
      },
    });

    const text = response.text;
    if (text) {
      const result = JSON.parse(text);
      if (result && typeof result.price === 'number' && result.price > 0) {
        return result.price;
      }
    }
  } catch (e: any) {
    console.warn(`Crypto fetch failed for ${upperSymbol}:`, e?.message || e);
  }

  return null;
};

// Legacy support for manual fallbacks
export const fetchPrice = fetchCryptoPrice;
