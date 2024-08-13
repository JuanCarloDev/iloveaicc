import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export async function AgentScriptYoutube(topic) {
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
      Generate a detailed script for a long YouTube video based on the following topic:
      ${topic.subtopic}. Description: ${topic.description}.
      The script should be engaging, informative, and well-structured for a YouTube audience. Please include the following sections:
      - **Introduction**: Start with a compelling hook and introduce the topic.
      - **Main Content**: Break down the topic into clear, well-organized sections. Use headings, bullet points, and examples to make the content easy to follow.
      - **Conclusion**: Summarize the key points, provide a call to action, and encourage viewers to like, comment, and subscribe.
      - **Additional Tips**: Provide any additional tips or insights that may be relevant to the audience.
      Format the script with clear headings, bullet points, and line breaks. I will use the library 'marked' to handle formatting, so include bold text and line breaks where necessary.
    `,
        },
        {
          role: "user",
          content: `Generate a detailed YouTube script for the following topic: ${topic.subtopic}.`,
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
