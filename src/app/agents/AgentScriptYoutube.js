import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export async function AgentScriptYoutube(topic) {
   const apiKey = process.env.OPENAI_API_KEY;

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
          content: `次のトピックに基づいて、長い YouTube ビデオの詳細なスクリプトを生成します。
 ${topic.topic}。説明: ${topic.description}。
 スクリプトは、YouTube 視聴者にとって魅力的で有益で、適切に構成されている必要があります。次のセクションを含めてください。
 - **はじめに**: 説得力のあるフックから始めて、トピックを紹介します。
 - **メインコンテンツ**: トピックを明確でよく整理されたセクションに分割します。見出し、箇条書き、例を使用して、コンテンツを理解しやすくします。
 - **結論**: 重要なポイントを要約し、行動喚起を提供し、視聴者に「いいね！」、コメント、チャンネル登録するよう促します。
 - **追加のヒント**: 視聴者に関連する可能性のある追加のヒントや洞察を提供します。
 明確な見出し、箇条書き、改行を使用してスクリプトをフォーマットします。 「マークされた」ライブラリを使用して書式設定を処理するため、必要に応じて太字のテキストと改行を含めます。`,
        },
        {
          role: "user",
          content: `次のトピックに関する詳細な YouTube スクリプトを生成します。 ${topic.subtopic}.`,
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
