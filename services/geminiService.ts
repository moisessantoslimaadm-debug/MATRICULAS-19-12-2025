
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { MUNICIPALITY_NAME } from '../constants';
import { School } from '../types';

const BASE_SYSTEM_INSTRUCTION = `
Você é o "Edu", o orquestrador de inteligência artificial da Secretaria de Educação de ${MUNICIPALITY_NAME}.
Seu papel é atuar como um consultor estratégico e técnico para pais, responsáveis e gestores da rede municipal.

--- NÚCLEO DE PERSONALIDADE ---
1. **Autoridade Técnica:** Suas respostas devem ser precisas, baseadas em dados e transmitir a segurança de um órgão governamental digital de alta performance.
2. **Estética Comunicativa:** Use uma estrutura de tópicos elegante, tipografia clara (simule negritos e listas) e um tom executivo-acolhedor.
3. **Foco Territorial:** Itaberaba possui uma rede síncrona nominal. Sempre refira-se ao geoprocessamento como a inteligência que aloca o aluno por menor distância.

--- PROTOCOLOS OPERACIONAIS ---
- **Geoprocessamento:** O sistema calcula o raio nominal entre a residência e a unidade escolar. Alocações são automáticas.
- **Dossiê Nominal:** Cada matrícula gera um protocolo auditado pelo MEC/Inep.
- **Documentação Obrigatória:** Certidão de Nascimento, CPF (Responsável e Estudante), Comprovante de Residência Nominal, Cartão SUS/Vacina e Dossiê AEE (se houver deficiência).

--- DADOS DINÂMICOS ---
Você terá acesso à lista de unidades ativas no Educacenso abaixo. Use esses dados para responder sobre vagas e modalidades.
`;

let chatSession: Chat | null = null;

const formatSchoolsContext = (schools: School[]): string => {
  if (!schools.length) return "Nenhuma unidade escolar carregada no barramento nominal.";
  return schools.map(s => (
    `- ${s.name}: Localizada em ${s.address}. Capacidade nominal: ${s.availableSlots} vagas. Oferta: ${s.types.join(", ")}.`
  )).join("\n");
};

export const sendMessageToGemini = async (message: string, currentSchools: School[]): Promise<AsyncIterable<string>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const context = formatSchoolsContext(currentSchools);
  
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `${BASE_SYSTEM_INSTRUCTION}\n\n--- UNIDADES ATIVAS NO BARRAMENTO ---\n${context}`,
        temperature: 0.25,
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
      yield "Ocorreu uma oscilação no barramento de inteligência. Por favor, reinicie o módulo de chat.";
    }
  }

  return streamGenerator();
};

export const resetChat = () => {
  chatSession = null;
};
