import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export async function AgentScript(topic) {
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
          content: `
      Generate a script for based on the following topic:
      ${topic.subtopic}. Description: ${topic.description}.
      The script should be engaging and relevant. Please format the script with clear headings, bullet points, and line breaks to make it easy to read. i will use the libary marked to formatting, so do bolds and jump lines.
    `,
        },
        {
          role: "user",
          content: `Generate a script for the following topic: ${topic.subtopic}.`,
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
