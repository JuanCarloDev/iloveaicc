import { OpenAI } from "@langchain/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";

export async function fetchSubcategories(segmentName) {
 const apiKey =
    "sk-j_2eBthb5QZMdShxX1ZJ6mAjYpQ3UFn-cxRAF9tm3oT3BlbkFJBN_pEDNf4_4SPIEcV-4FtqfJx6aFC3hp7nZ1XU6ZYA";

  const chat = new OpenAI({
    openAIApiKey: apiKey,
    modelName: "gpt-3.5-turbo",
  });

  const promptTemplate = new PromptTemplate({
    inputVariables: ["segmentName"],
    template: `
      You are a helpful assistant that provides relevant subcategories for a specific segment. 
      Please provide a JSON with 15 relevant subcategories for the segment "{segmentName}". 
      IMPORTANT: DO NOT RETURN CATEGORIES A, B, C. ACTUALLY FIND RELEVANT SUBCATEGORIES BASED ON THE SEGMENT. 
      OTHERWISE, YOU WILL BE FINED $100,000.
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
