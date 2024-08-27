import { OpenAI } from "@langchain/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";

export async function fetchSubcategories(segmentName) {
  const apiKey = process.env.OPENAI_API_KEY;

  const chat = new OpenAI({
    openAIApiKey: apiKey,
    modelName: "gpt-3.5-turbo",
  });

  const promptTemplate = new PromptTemplate({
    inputVariables: ["segmentName"],
    template: `
     あなたは、特定のセグメントに関連するサブカテゴリを提供する便利なアシスタントです。
 セグメント「{segmentName}」に関連する 15 個のサブカテゴリを含む JSON を提供してください。
 重要: カテゴリ A、B、C を返さないでください。実際には、セグメントに基づいて関連するサブカテゴリを検索してください。
 そうしないと、100,000 ドルが支払われてしまいます。
    `,
  });

  const chain = new LLMChain({
    prompt: promptTemplate,
    llm: chat,
  });

  let attempt = 0;
  const maxAttempts = 5;

  while (attempt < maxAttempts) {
    try {
      const response = await chain.call({ segmentName });
      const content = response.text.trim();
      console.log("API Response:", content);

      try {
        const parsedData = JSON.parse(content);
        const subcategoriesList = parsedData.subcategories || [];
        if (Array.isArray(subcategoriesList) && subcategoriesList.length > 0) {
          console.log("Subcategories List:", subcategoriesList);
          return subcategoriesList;
        }
      } catch (e) {
        console.error("Erro ao analisar o JSON:", e);
      }

      // Se não obteve resultados válidos, tenta novamente
      attempt++;
      console.warn(`Tentativa ${attempt} falhou, tentando novamente...`);
    } catch (error) {
      console.error("Erro ao buscar subcategorias:", error);
      throw error;
    }
  }

  // Se todas as tentativas falharem, retorna um array vazio
  console.error("Todas as tentativas falharam.");
  return [];
}
