import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export async function AgentScript(topic) {

  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY; // Obtém a chave da API do ambiente Next.js

  console.log(apiKey)

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
          content: `
    次のトピックに基づいてスクリプトを生成します。
 ${topic.subtopic}。説明: ${topic.description}。
 スクリプトは魅力的で関連性のあるものでなければなりません。読みやすいように、明確な見出し、箇条書き、改行を使用してスクリプトをフォーマットしてください。私はフォーマットするようにマークされたライブラリを使用し、太字とジャンプ行のみを実行します。`,
        },
        {
          role: "user",
          content: `次のトピックのスクリプトを生成します。 ${topic.subtopic}.`,
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
