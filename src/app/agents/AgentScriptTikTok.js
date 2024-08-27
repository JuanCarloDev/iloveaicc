import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export async function AgentScriptTikTok(topic) {
  const apiKey =
    "sk-j_2eBthb5QZMdShxX1ZJ6mAjYpQ3UFn-cxRAF9tm3oT3BlbkFJBN_pEDNf4_4SPIEcV-4FtqfJx6aFC3hp7nZ1XU6ZYA";

  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  const ScriptResponse = z.object({
    script: z.string(), // Supondo que o script retornado seja uma string
  });

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: `次のトピックに基づいて TikTok 用のスクリプトを生成します。
 ${topic.subtopic}。説明: ${topic.description}。
 スクリプトは魅力的で、TikTok に関連したものでなければなりません。読みやすいように、明確な見出し、箇条書き、改行を使用してスクリプトをフォーマットしてください。私はフォーマットするようにマークされたライブラリを使用し、太字とジャンプ行のみを実行します。
    `,
        },
        {
          role: "user",
          content: `次のトピックの TikTok スクリプトを生成します。${topic.subtopic}.`,
        },
      ],
      response_format: zodResponseFormat(ScriptResponse, "event"),
    });

    const event = completion.choices[0].message.parsed;
    console.log("Generated Script:", event);

    return event.script; // Retorna o script gerado
  } catch (error) {
    console.error("Failed to generate script:", error);
    return "";
  }
}
