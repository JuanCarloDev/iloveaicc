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
            content: `以下のリストのサブカテゴリごとに、3 つの関連サブトピックを含む JSON オブジェクトを提供します。各サブトピックは、最大 10 単語からなる単一の文字列で、その後に簡単な説明が続きます。
 結果として得られる JSON は、すべてのサブトピックとその説明を含む単一の配列である必要があります。構造は次のようになります。
 {"サブトピック": "サブトピック 1", "説明": "サブトピック 1 の説明。"},
 {"サブトピック": "サブトピック 2", "説明": "サブトピック 2 の説明。"},
 {"サブトピック": "サブトピック 3", "説明": "サブトピック 3 の説明。"},
 {"サブトピック": "サブトピック 4", "説明": "サブトピック 4 の説明。"},
 トピックが提供された各サブカテゴリとの関連性が高いことを確認してください。一般的なトピックや無関係なトピックは避けてください。
 重要: トピック A、B、C は返さないでください。実際には、サブカテゴリに基づいて関連するサブトピックを見つけてください。`,
          },
          {
            role: "user",
            content: `サブカテゴリに基づいて、関連するサブトピックを実際に見つけます。
 サブカテゴリ: ${subcategoriesString}`,
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
