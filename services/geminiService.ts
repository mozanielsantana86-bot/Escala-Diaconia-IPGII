import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAnnouncement = async (
  date: string, 
  time: string, 
  volunteers: string[]
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Você é um assistente útil para um grupo de voluntários de uma igreja ou organização comunitária.
      Crie uma mensagem curta, motivadora e informativa para o WhatsApp.
      
      Contexto:
      - Evento: Reunião de Domingo
      - Data: ${date}
      - Horário: ${time}
      - Voluntários escalados: ${volunteers.join(', ')}
      
      A mensagem deve:
      1. Lembrar os voluntários do compromisso.
      2. Incluir uma frase curta inspiradora sobre servir ao próximo.
      3. Pedir confirmação.
      4. Usar emojis apropriados.
      5. Ser formatada para WhatsApp (use *negrito* para destaques).
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a mensagem.";
  } catch (error) {
    console.error("Error generating announcement:", error);
    return "Erro ao conectar com a IA. Verifique sua chave de API ou tente novamente.";
  }
};

export const generateIndividualMessage = async (
  volunteerName: string,
  date: string,
  time: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Crie uma mensagem curta e direta para WhatsApp para um voluntário específico.
      
      - Destinatário: ${volunteerName}
      - Data do plantão: ${date}
      - Horário: ${time}
      
      Tom de voz: Amigável e respeitoso.
      Objetivo: Lembrar do plantão e enviar orientações básicas (chegar 15 min antes).
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating individual message:", error);
    return `Olá ${volunteerName}, lembrete do seu plantão dia ${date} às ${time}. Por favor, chegue 15 minutos antes.`;
  }
};