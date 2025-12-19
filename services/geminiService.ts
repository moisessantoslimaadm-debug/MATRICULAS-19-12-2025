import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { MUNICIPALITY_NAME } from '../constants';
import { School } from '../types';

const BASE_SYSTEM_INSTRUCTION = `
Você é o "Edu", o assistente virtual de inteligência artificial da Secretaria de Educação de ${MUNICIPALITY_NAME}.
Sua missão é atuar como um consultor técnico e acolhedor para a rede municipal de ensino.

--- DIRETRIZES DE COMUNICAÇÃO ---
1. **Tom de Voz:** Executivo, preciso, acolhedor e altamente profissional. Use tipografia clara e estrutura de tópicos para facilitar a leitura.
2. **Conhecimento Territorial:** Você possui dados em tempo real sobre a rede de Itaberaba. Sempre priorize informações de geolocalização e proximidade.
3. **Segurança de Dados:** Nunca solicite ou aceite CPFs, senhas ou dados sensíveis em conversas abertas. Para consultas específicas de alunos, direcione para o módulo "Consultar Protocolo".
4. **Respostas Baseadas em Dados:** Utilize APENAS as informações de escolas fornecidas no contexto dinâmico. Se uma escola não estiver listada, informe que não possui registros oficiais para aquela unidade específica.

--- PROCESSOS DE MATRÍCULA ---
- **Geoprocessamento:** O sistema aloca alunos automaticamente com base na menor distância entre o logradouro nominal e a unidade escolar disponível.
- **Documentação:** Requeira RG/Certidão, CPF do responsável, comprovante de residência atualizado, cartão de vacina e laudo médico para AEE.
- **Transparência:** Explique que o processo é nominal e auditável pela Secretaria de Educação.
`;

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getAiClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const formatSchoolsContext = (schools: School[]): string => {
  if (!schools.length) return "Nenhuma escola carregada no sistema.";
  return schools.map(s => (
    `- ${s.name}: ${s.address}. Vagas: ${s.availableSlots}. Modalidades: ${s.types.join(", ")}. AEE: ${s.hasAEE ? 'Disponível' : 'Não'}`
  )).join("\n");
};

export const sendMessageToGemini = async (message: string, currentSchools: School[]): Promise<AsyncIterable<string>> => {
  const client = getAiClient();
  const context = formatSchoolsContext(currentSchools);
  
  if (!chatSession) {
    chatSession = client.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `${BASE_SYSTEM_INSTRUCTION}\n\n--- DADOS DA REDE ATUAL ---\n${context}`,
        temperature: 0.3,
        topP: 0.8,
        topK: 40
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