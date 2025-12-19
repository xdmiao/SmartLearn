
import { GoogleGenAI } from "@google/genai";

// Initialize the client safely
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const fetchAnswerFromGemini = async (question: string, context: string, useSearch: boolean = false): Promise<string> => {
  if (!apiKey) {
    return "错误：未配置 API Key。请检查环境变量。";
  }

  try {
    const prompt = `
      你是一位知识渊博、循循善诱的中文家庭教师。
      请针对以下问题提供一个结构清晰、通俗易懂的详细解答。
      
      问题：${question}
      背景上下文：${context}

      要求：
      1. 使用 Markdown 格式。
      2. 包含引言、核心解释和总结。
      3. 语气亲切，富有教育意义。
      4. 如果涉及代码，请使用代码块。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Disable explicit thinking for faster standard responses
        tools: useSearch ? [{ googleSearch: {} }] : undefined
      }
    });

    let text = response.text || "抱歉，无法生成答案。";

    // Handle Search Grounding Sources (if Google Search was used)
    if (useSearch && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      const chunks = response.candidates[0].groundingMetadata.groundingChunks;
      // Extract URIs from chunks
      const sources = chunks
        .map((chunk: any) => chunk.web?.uri)
        .filter((uri: string) => uri);
      
      if (sources.length > 0) {
        // Deduplicate sources
        const uniqueSources = Array.from(new Set(sources));
        text += "\n\n---\n**参考来源 (Search Sources)**:\n" + uniqueSources.map((url: unknown) => `- <${url}>`).join("\n");
      }
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "获取答案时发生错误，请稍后重试。";
  }
};
