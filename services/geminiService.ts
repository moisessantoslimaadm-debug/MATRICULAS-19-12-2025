import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { MUNICIPALITY_NAME } from '../constants';
import { School } from '../types';

const BASE_SYSTEM_INSTRUCTION = `
Você é o "Edu", o assistente virtual de inteligência artificial da Secretaria de Educação de ${MUNICIPALITY_NAME}.
Sua missão é atuar como um consultor técnico e acolhedor para a rede municipal de ensino.

--- DIRETRIZES DE COMUNICAÇÃO ---
1. **Tom de Voz:** Executivo, preciso, acolhedor e altamente profissional. Use tipografia clara e estrutura de tópicos.
2. **Conhecimento Territorial:** Você possui dados síncronos sobre a rede de Itaberaba. Sempre priorize informações de geolocalização.
3. **Segurança de Dados:** Nunca solicite ou aceite CPFs em conversas abertas.
4. **Respostas Baseadas em Dados:** Utilize APENAS as informações de escolas fornecidas no contexto dinâmico.

--- PROCESSOS DE MATRÍCULA ---
- **Geoprocessamento:** O sistema aloca alunos automaticamente com base na menor distância nominal.
- **Documentação:** RG/Certidão, CPF do responsável, comprovante de residência, cartão de vacina e laudo AEE (se aplicável).
`;

let chatSession: Chat | null = null;

const formatSchoolsContext = (schools: School[]): string => {
  if (!schools.length) return "Nenhuma escola carregada no sistema.";
  return schools.map(s => (
    `- ${s.name}: ${s.address}. Vagas: ${s.availableSlots}. Modalidades: ${s.types.join(", ")}.`
  )).join("\n");
};

export const sendMessageToGemini = async (message: string, currentSchools: School[]): Promise<AsyncIterable<string>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const context = formatSchoolsContext(currentSchools);
  
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `${BASE_SYSTEM_INSTRUCTION}\n\n--- DADOS DA REDE ATUAL ---\n${context}`,
        temperature: 0.3,
      }
    });
  }

  async function* streamGenerator() {
    try {
      const result = await chatSession!.sendMessageStream({ message });
      for await (const chunk of result) {
        const responseChunk = chunk as GenerateContentResponse;
        if (responseChunk.text) {
          yield responseChunk.text;
        }
      }
    } catch (error) {
      console.error("Gemini stream error:", error);
      yield "Lamento, houve uma oscilação na rede de inteligência. Por favor, tente novamente em instantes.";
    }
  }

  return streamGenerator();
};

export const resetChat = () => {
  chatSession = null;
};