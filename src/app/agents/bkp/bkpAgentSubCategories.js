// lib/apiService.js

export async function bkpfetchSubcategories(segmentName) {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY; // Assegure-se de definir essa variável no arquivo .env.local

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer sk-j_2eBthb5QZMdShxX1ZJ6mAjYpQ3UFn-cxRAF9tm3oT3BlbkFJBN_pEDNf4_4SPIEcV-4FtqfJx6aFC3hp7nZ1XU6ZYA`, // Use a variável de ambiente para a chave da API
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that provides relevant subcategories for a specific segment. Return only a JSON with a list of subcategories.",
          },
          {
            role: "user",
            content: `Please provide a JSON with 9 relevant subcategories for the segment "${segmentName}". IMPORTANT: DO NOT RETURN CATEGORIES A, B, C. ACTUALLY FIND RELEVANT SUBCATEGORIES BASED ON THE SEGMENT. OTHERWISE, YOU WILL BE FINED $100,000.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    const content = data.choices[0].message.content.trim();
    console.log(content);

    // Tenta analisar o conteúdo como JSON
    try {
      const parsedData = JSON.parse(content);
      const subcategoriesList = parsedData.subcategories || []; // Corrigido para 'subcategories'
      return Array.isArray(subcategoriesList) ? subcategoriesList : [];
    } catch (e) {
      console.error("Erro ao analisar o JSON:", e);
      return [];
    }
  } catch (error) {
    console.error("Erro ao buscar subcategorias:", error);
    throw error;
  }
}
