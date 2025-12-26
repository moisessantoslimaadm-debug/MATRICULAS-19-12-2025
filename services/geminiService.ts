import { GoogleGenAI } from "@google/genai";
import { MUNICIPALITY_NAME } from '../constants';
import { School, RegistryStudent } from '../types';

const BASE_SYSTEM_INSTRUCTION = `
Você é o "Edu", o orquestrador de inteligência artificial da Secretaria de Educação de ${MUNICIPALITY_NAME}.
Seu papel é atuar como um consultor estratégico e técnico para pais, responsáveis e gestores da rede municipal.

--- NÚCLEO DE PERSONALIDADE ---
1. **Autoridade Técnica:** Suas respostas devem ser precisas, baseadas em dados e transmitir a segurança de um órgão governamental digital.
2. **Estética Comunicativa:** Use uma estrutura de tópicos elegante e tom executivo. Evite gírias.
3. **Foco Territorial:** Itaberaba possui uma rede síncrona nominal. Refira-se ao geoprocessamento como a inteligência que aloca o aluno por menor distância residencial.

--- PROTOCOLOS OPERACIONAIS ---
- Utilize a ferramenta de busca do Google (googleSearch) para verificar prazos de matrícula nacionais, legislações do MEC (como a BNCC 2025) e informações geográficas de Itaberaba.
- Se o usuário perguntar sobre estatísticas, utilize o sumário executivo fornecido.
- Se o usuário perguntar sobre escolas específicas, utilize os dados do contexto local fornecido das unidades ativas.
- SEMPRE extraia as URLs dos "groundingChunks" e as liste no final da mensagem como "Fontes Oficiais Consultadas".
`;

const formatSchoolsContext = (schools: School[]): string => {
  if (!schools.length) return "Nenhuma unidade escolar carregada no barramento nominal.";
  return schools.map(s => (
    `- ${s.name} (INEP: ${s.inep}): Localizada em ${s.address}. Vagas: ${s.availableSlots}. Oferta: ${s.types.join(", ")}.`
  )).join("\n");
};

export const sendMessageToGemini = async (message: string, currentSchools: School[], allStudents: RegistryStudent[] = []) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const schoolsContext = formatSchoolsContext(currentSchools);
  
  // Cálculo de Estatísticas Básicas para Contexto
  const totalStudents = allStudents.length;
  const totalSpecialNeeds = allStudents.filter(s => s.specialNeeds).length;
  const totalTransport = allStudents.filter(s => s.transportRequest).length;

  const statsContext = `
--- SUMÁRIO EXECUTIVO DA REDE ---
- Total de Alunos Matriculados: ${totalStudents}
- Alunos com Necessidades Especiais (AEE): ${totalSpecialNeeds}
- Alunos utilizando Transporte Escolar: ${totalTransport}
- Total de Unidades Escolares: ${currentSchools.length}
  `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: {
      systemInstruction: `${BASE_SYSTEM_INSTRUCTION}\n${statsContext}\n\n--- UNIDADES ATIVAS NO BARRAMENTO SME ---\n${schoolsContext}`,
      temperature: 0.2,
      tools: [{ googleSearch: {} }]
    }
  });

  const text = response.text || "Lamento, o barramento de IA encontrou uma oscilação no processamento.";
  
  // Extração de metadados de grounding para transparência pública
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const urls = groundingChunks?.map((chunk: any) => ({
    uri: chunk.web?.uri,
    title: chunk.web?.title
  })).filter((u: any) => u.uri && u.title) || [];

  return { text, urls };
};

export const generatePedagogicalReport = async (student: RegistryStudent, attendancePercent: number, grades: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Gere um Relatório Pedagógico Individual formal para o aluno ${student.name}.
    
    Dados do Aluno:
    - Frequência Atual: ${attendancePercent}%
    - Avaliação Recente (Conceito): ${JSON.stringify(grades)}
    - Necessidades Especiais (AEE): ${student.specialNeeds ? 'Sim' : 'Não'}
    - Observações do Professor (Histórico): ${student.teacherNotes?.map(n => n.content).join('; ') || 'Sem observações registradas.'}

    Estrutura do Relatório (Use linguagem formal, pedagógica e acolhedora, direcionada aos pais/responsáveis):
    1. Introdução: Breve apresentação do desempenho geral.
    2. Análise de Assiduidade: Comentário sobre a frequência.
    3. Desenvolvimento Cognitivo e Conceitual: Análise baseada nos conceitos (DI, EP, DB, DE).
    4. Recomendações: Sugestões práticas para a família apoiar o aluno.
    5. Conclusão: Encerramento positivo.

    Não use formatação Markdown (negrito, itálico) excessiva, prefira texto corrido e parágrafos claros para impressão oficial.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.4,
    }
  });

  return response.text;
};

export const resetChat = () => {
  // Stateless implementation
};