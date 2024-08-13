import { OpenAI } from "@langchain/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";

export async function fetchTopics2(subcategories) {
  const apiKey =
    "sk-j_2eBthb5QZMdShxX1ZJ6mAjYpQ3UFn-cxRAF9tm3oT3BlbkFJBN_pEDNf4_4SPIEcV-4FtqfJx6aFC3hp7nZ1XU6ZYA";

  const subcategoriesString = JSON.stringify(subcategories);

  const chat = new OpenAI({
    openAIApiKey: apiKey,
    modelName: "gpt-3.5-turbo",
  });

  const promptTemplate = new PromptTemplate({
    template: `
      For each subcategory in the list below, provide a JSON object with 3 related subtopics. Each subtopic should be a single string with up to 10 words, followed by a brief description.
      The resulting JSON should be a single array containing all the subtopics with their descriptions. The structure should be as follows:
        {"subtopic": "subtopic_1", "description": "Description of subtopic 1."},
        {"subtopic": "subtopic_2", "description": "Description of subtopic 2."},
        {"subtopic": "subtopic_3", "description": "Description of subtopic 3."},
        ...
      Ensure that the topics are highly relevant to each subcategory provided. Avoid generic or unrelated topics.
      IMPORTANT: DO NOT RETURN TOPICS A, B, C. ACTUALLY FIND RELEVANT SUBTOPICS BASED ON THE SUBCATEGORIES.
      Subcategories: ${subcategoriesString}
    `,
  });

  const chain = new LLMChain({
    prompt: promptTemplate,
    llm: chat,
  });

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await chain.call();
      const content = response.text.trim();
      console.log("API Response:", content);

      try {
        const parsedData = JSON.parse(content);
        const topicsList = parsedData.topics || [];
        if (Array.isArray(topicsList) && topicsList.length > 0) {
          console.log("Topics List:", topicsList);
          return topicsList;
        }
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }

      console.warn(`Attempt ${attempt + 1} failed, retrying...`);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      if (attempt === 4) {
        console.error("All attempts failed.");
        return [];
      }
    }
  }

  return [];
}
