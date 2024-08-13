import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export async function fetchTopics(subcategories) {
  const apiKey =
    "sk-j_2eBthb5QZMdShxX1ZJ6mAjYpQ3UFn-cxRAF9tm3oT3BlbkFJBN_pEDNf4_4SPIEcV-4FtqfJx6aFC3hp7nZ1XU6ZYA";

  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  // Encapsulando o array de tópicos em um objeto chamado 'topics'.
  const TopicsResponse = z.object({
    topics: z.array(
      z.object({
        subtopic: z.string(),
        description: z.string(),
      })
    ),
  });

  const subcategoriesString = JSON.stringify(subcategories);

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: `
              For each subcategory in the list below, provide a JSON object with 3 related subtopics. Each subtopic should be a single string with up to 10 words, followed by a brief description.
              The resulting JSON should be a single array containing all the subtopics with their descriptions. The structure should be as follows:
                {"subtopic": "subtopic_1", "description": "Description of subtopic 1."},
                {"subtopic": "subtopic_2", "description": "Description of subtopic 2."},
                {"subtopic": "subtopic_3", "description": "Description of subtopic 3."},
                {"subtopic": "subtopic_4", "description": "Description of subtopic 4."},
              Ensure that the topics are highly relevant to each subcategory provided. Avoid generic or unrelated topics.
              IMPORTANT: DO NOT RETURN TOPICS A, B, C. ACTUALLY FIND RELEVANT SUBTOPICS BASED ON THE SUBCATEGORIES.
            `,
          },
          {
            role: "user",
            content: `ACTUALLY FIND RELEVANT SUBTOPICS BASED ON THE SUBCATEGORIES.
              Subcategories: ${subcategoriesString}`,
          },
        ],
        response_format: zodResponseFormat(TopicsResponse, "event"),

        /* response_format: zodResponseFormat({
          schema: Topics.array(),
          json_schema: {
            name: "TopicsResponse", // Nome do schema, que é necessário
          },
        }), */
      });

      // Pega o objeto `parsed` da primeira escolha (choice)xw

      const event = completion.choices[0].message.parsed;
      console.log(event);

      return event;
      /*  // Se a resposta for válida, retorne o resultado
      if (event && Array.isArray(event)) {
        return event;
      } */

      // Caso contrário, lance um erro para tentar novamente
      throw new Error("Invalid response format or empty array");
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error.message);
      if (attempt === 4) {
        console.error("All attempts failed.");
        return [];
      }
    }
  }
}
