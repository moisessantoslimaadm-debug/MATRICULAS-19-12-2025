
import { School, SchoolType, RegistryStudent, RegistrationFormState, Project, Professional } from './types';

export const MUNICIPALITY_NAME = "Itaberaba";

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-fanfarra',
    name: 'FANFARRA ESTUDANTIL DE ITABERABA - FANEDI',
    description: 'Iniciação musical e atividades rítmicas para o desenvolvimento cultural dos estudantes.',
    category: 'Cultura',
    status: 'Ativo',
    participantsCount: 45,
    budget: 'R$ 15.000,00',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80'
  },
  {
    id: 'proj-aee',
    name: 'SALA DE RECURSOS MULTIFUNCIONAIS',
    description: 'Atendimento Educacional Especializado para alunos com deficiência, TDAH e altas habilidades.',
    category: 'Inclusão',
    status: 'Ativo',
    participantsCount: 25,
    budget: 'R$ 30.000,00',
    image: 'https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5?auto=format&fit=crop&q=80'
  }
];

// Dados extraídos do Recibo de Fechamento - Educacenso 2025
export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: 'prof-dir-29446309',
    name: 'EDIANA SILVA DE OLIVEIRA',
    role: 'Diretor Escolar',
    schoolId: 'sch-zona-d-1',
    schoolName: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
    cpf: '704.919.505-78',
    email: 'ediana.silva@itaberaba.ba.gov.br',
    status: 'Ativo',
    phone: '(75) 99100-0001'
  },
  {
    id: 'prof-sec-29446309',
    name: 'NORA NOVAES MELO',
    role: 'Secretário Escolar / Informante',
    schoolId: 'sch-zona-d-1',
    schoolName: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
    cpf: '089.463.535-20',
    email: 'nora.melo@itaberaba.ba.gov.br',
    status: 'Ativo',
    phone: '(75) 99100-0002'
  }
];

// Base de coordenadas central de Itaberaba para delta
const BASE_LAT = -12.5266;
const BASE_LNG = -40.2927;

// Função auxiliar para gerar coordenadas próximas a um ponto
const getGeo = (latOffset: number, lngOffset: number) => ({
    lat: BASE_LAT + latOffset + (Math.random() * 0.002 - 0.001),
    lng: BASE_LNG + lngOffset + (Math.random() * 0.002 - 0.001)
});

export const MOCK_SCHOOLS: School[] = [
  // --- ZONA A ---
  {
    id: 'sch-zona-a-1', inep: '29000001', name: 'CEMEI - LINÉSIO BASTOS DE SANTANA', zone: 'Zona A',
    address: 'Rua Manoel Bastos, S/N° - Açude Novo', types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80', rating: 4.5, availableSlots: 150, hasAEE: true,
    ...getGeo(0.005, -0.005)
  },
  {
    id: 'sch-zona-a-2', inep: '29000002', name: 'ESCOLA MUNICIPAL PROF.ª CORA RIBEIRO DOS SANTOS', zone: 'Zona A',
    address: 'Conj. Hab. Irmã Dulce, S/N° - Coelba', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80', rating: 4.2, availableSlots: 200, hasAEE: false,
    ...getGeo(0.006, -0.004)
  },
  {
    id: 'sch-zona-a-3', inep: '29000003', name: 'CRECHE MUNICIPAL MARIA BETÂNIA MELO SOUZA', zone: 'Zona A',
    address: 'Av. Principal, S/N° - Conj. Hab. Nova Itaberaba', types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80', rating: 4.8, availableSlots: 100, hasAEE: false,
    ...getGeo(0.007, -0.006)
  },
  {
    id: 'sch-zona-a-4', inep: '29000004', name: 'ESCOLA MUNICIPAL JOÃO ALMEIDA MASCARENHAS', zone: 'Zona A',
    address: 'Caminho 08, S/N° - RM', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80', rating: 4.0, availableSlots: 180, hasAEE: true,
    ...getGeo(0.005, -0.003)
  },

  // --- ZONA B ---
  {
    id: 'sch-zona-b-1', inep: '29000005', name: 'ESCOLA MUNICIPAL LUIZ VIANA FILHO', zone: 'Zona B',
    address: 'Rua Joel Presídio, N° 279 – Barro Vermelho', types: [SchoolType.FUNDAMENTAL_1, SchoolType.FUNDAMENTAL_2],
    image: 'https://images.unsplash.com/photo-1544928147-79a2e746b50d?auto=format&fit=crop&q=80', rating: 4.6, availableSlots: 350, hasAEE: true,
    ...getGeo(-0.002, 0.002)
  },
  {
    id: 'sch-zona-b-2', inep: '29000006', name: 'ESCOLA MUNICIPAL ODULPHO SANTOS BRITTO', zone: 'Zona B',
    address: 'Rua DR. Mario Araújo S/N° - Barro Vermelho', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80', rating: 4.3, availableSlots: 220, hasAEE: false,
    ...getGeo(-0.003, 0.002)
  },
  {
    id: 'sch-zona-b-3', inep: '29000007', name: 'ESCOLA MUNICIPAL PAULO FREIRE', zone: 'Zona B',
    address: 'Rua Orman Ribeiro dos Santos, S/n° - Barro Vermelho', types: [SchoolType.FUNDAMENTAL_1, SchoolType.EJA],
    image: 'https://images.unsplash.com/photo-1596496356938-a2a1dc6d9510?auto=format&fit=crop&q=80', rating: 4.7, availableSlots: 300, hasAEE: true,
    ...getGeo(-0.002, 0.003)
  },
  {
    id: 'sch-zona-b-4', inep: '29000008', name: 'ESCOLA MUNICIPAL PROF.º DARCY RIBEIRO', zone: 'Zona B',
    address: 'Rua Dr. Henrique Brito S/N°- Lot. Costa e Silva', types: [SchoolType.FUNDAMENTAL_2],
    image: 'https://images.unsplash.com/photo-1577896335477-993d5448c6bd?auto=format&fit=crop&q=80', rating: 4.5, availableSlots: 280, hasAEE: true,
    ...getGeo(-0.004, 0.004)
  },
  {
    id: 'sch-zona-b-5', inep: '29000009', name: 'CRECHE MUNICIPAL PARAÍSO DA CRIANÇA', zone: 'Zona B',
    address: 'Rua Dr. Orman Ribeiro, S/N° - Barro Vermelho', types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&q=80', rating: 4.9, availableSlots: 80, hasAEE: false,
    ...getGeo(-0.002, 0.003)
  },
  {
    id: 'sch-zona-b-6', inep: '29000010', name: 'CRECHE MUNICIPAL SONHO DE CRIANÇA', zone: 'Zona B',
    address: 'Rua Roque Fagundes, N° 243 - São João/Praça Castro Alves', types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80', rating: 4.8, availableSlots: 90, hasAEE: false,
    ...getGeo(0.001, 0.001)
  },
  {
    id: 'sch-zona-b-7', inep: '29000011', name: 'INSTITUTO MUNICIPAL DE EDUCAÇÃO DE TEMPO INTEGRAL MINISTRO CARLOS SANTANA', zone: 'Zona B',
    address: 'Rua Orman Ribeiro, S/N° - Barro Vermelho', types: [SchoolType.FUNDAMENTAL_1, SchoolType.FUNDAMENTAL_2],
    image: 'https://images.unsplash.com/photo-1544531696-214dd055ff28?auto=format&fit=crop&q=80', rating: 5.0, availableSlots: 500, hasAEE: true,
    ...getGeo(-0.003, 0.003)
  },

  // --- ZONA C ---
  {
    id: 'sch-zona-c-1', inep: '29000012', name: 'ESCOLA MUNICIPAL EUCLIDES BARBOSA', zone: 'Zona C',
    address: 'Conj. Hab. Itaberaba I - Concic', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1522661067900-ab829854a57f?auto=format&fit=crop&q=80', rating: 4.1, availableSlots: 250, hasAEE: false,
    ...getGeo(-0.008, -0.008)
  },
  {
    id: 'sch-zona-c-2', inep: '29000013', name: 'CEMEI - PROFESSORA IRACINA QUEIROZ DE OLIVEIRA', zone: 'Zona C',
    address: 'Rua São Roque, N°5555- Bairro Universitário', types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&q=80', rating: 4.6, availableSlots: 120, hasAEE: true,
    ...getGeo(-0.007, -0.006)
  },
  {
    id: 'sch-zona-c-3', inep: '29000014', name: 'ESCOLA MUNICIPAL DORALICE DE SOUZA SAMPAIO', zone: 'Zona C',
    address: 'Av. Luiz Viana Filho, S/N° - Batalhão', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&q=80', rating: 4.4, availableSlots: 300, hasAEE: true,
    ...getGeo(-0.006, -0.007)
  },
  {
    id: 'sch-zona-c-4', inep: '29000015', name: 'ESCOLA MUNICIPAL DONA MORA GUIMARÃES', zone: 'Zona C',
    address: 'Área do Inst. Meteorológico, S/N° Caititu', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&q=80', rating: 4.3, availableSlots: 260, hasAEE: false,
    ...getGeo(-0.005, -0.008)
  },
  {
    id: 'sch-zona-c-5', inep: '29000016', name: 'ESCOLA MUNICIPAL REITOR EDGARD SANTOS', zone: 'Zona C',
    address: 'Rua Alagoas, N° 82 – Lot. Bahia', types: [SchoolType.FUNDAMENTAL_2],
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d50c14f?auto=format&fit=crop&q=80', rating: 4.5, availableSlots: 320, hasAEE: true,
    ...getGeo(-0.006, -0.005)
  },
  {
    id: 'sch-zona-c-6', inep: '29000017', name: 'CEMEI – PROFª MARIA ISABEL DE CARVALHO', zone: 'Zona C',
    address: 'Rua 08, S/N – Campo do Governo', types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80', rating: 4.7, availableSlots: 110, hasAEE: false,
    ...getGeo(-0.007, -0.005)
  },

  // --- ZONA D ---
  {
    id: 'sch-zona-d-1', inep: '29446309', name: 'CENTRO MUNICIPAL DE EDUCAÇÃO BÁSICA', zone: 'Zona D',
    address: 'Rua Cônego Gilberto Carneiro Leão, S/N° - Paroquial', types: [SchoolType.FUNDAMENTAL_1, SchoolType.FUNDAMENTAL_2, SchoolType.EJA],
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80', rating: 5.0, availableSlots: 600, hasAEE: true,
    ...getGeo(0.002, 0.005)
  },
  {
    id: 'sch-zona-d-2', inep: '29000019', name: 'ESCOLA MUNICIPAL NELSON ALVES DE GUIMARÃES CARVALHO', zone: 'Zona D',
    address: 'Av. Getúlio Vargas, N° 1282 – DER-BA', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80', rating: 4.2, availableSlots: 240, hasAEE: false,
    ...getGeo(0.003, 0.006)
  },
  {
    id: 'sch-zona-d-3', inep: '29000020', name: 'ESCOLA MUNICIPAL MUNDO DOS SABERES', zone: 'Zona D',
    address: 'Rua Hermes Bastos, N° 08 - Urbis', types: [SchoolType.INFANTIL, SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80', rating: 4.6, availableSlots: 180, hasAEE: true,
    ...getGeo(0.004, 0.007)
  },
  {
    id: 'sch-zona-d-4', inep: '29000021', name: 'CEMEI - HERCÍLIA DIAS MASCARENHAS – TEMPO INTEGRAL', zone: 'Zona D',
    address: 'Rua Esmeraldo Queiroz, S/N° Urbis', types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&q=80', rating: 4.9, availableSlots: 150, hasAEE: true,
    ...getGeo(0.004, 0.008)
  },
  {
    id: 'sch-zona-d-5', inep: '29000022', name: 'CEMEI - PROF.ª CLEONILZE SILVA DOS ANJOS', zone: 'Zona D',
    address: 'Rua 04, S/N – Bairro Alameda das Umburanas', types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80', rating: 4.5, availableSlots: 130, hasAEE: false,
    ...getGeo(0.005, 0.009)
  },
  {
    id: 'sch-zona-d-6', inep: '29000023', name: 'ESCOLA MUNICIPAL DA 5ª RESIDÊNCIA DO DER-BA', zone: 'Zona D',
    address: 'Rua Hermes Bastos, S/N- Urbis', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80', rating: 4.1, availableSlots: 160, hasAEE: false,
    ...getGeo(0.003, 0.007)
  },

  // --- ZONA E (CENTRO) ---
  {
    id: 'sch-zona-e-1', inep: '29000024', name: 'ESCOLA MUNICIPAL PEDRA QUE BRILHA', zone: 'Zona E',
    address: 'Praça Lauro Silva, S/N° - Centro', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80', rating: 4.8, availableSlots: 350, hasAEE: true,
    ...getGeo(0.000, 0.000)
  },
  {
    id: 'sch-zona-e-2', inep: '29000025', name: 'ESCOLA MUNICIPAL GÓES CALMON', zone: 'Zona E',
    address: 'Rua Góes Calmon, N° 01 - Centro', types: [SchoolType.FUNDAMENTAL_1, SchoolType.FUNDAMENTAL_2],
    image: 'https://images.unsplash.com/photo-1560523159-4a9692d222f9?auto=format&fit=crop&q=80', rating: 4.7, availableSlots: 400, hasAEE: true,
    ...getGeo(-0.001, -0.001)
  },
  {
    id: 'sch-zona-e-3', inep: '29000026', name: 'ESCOLA MUNICIPAL PROF.ª DILMA REGINA CERQUEIRA DE SANTANA', zone: 'Zona E',
    address: 'Rua Jaime Sampaio, S/N° – Pé do Monte', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1557318041-1ce374d55ebf?auto=format&fit=crop&q=80', rating: 4.4, availableSlots: 280, hasAEE: false,
    ...getGeo(0.001, -0.002)
  },
  {
    id: 'sch-zona-e-4', inep: '29000027', name: 'ESCOLA MUNICIPAL NOVO TEMPO', zone: 'Zona E',
    address: 'R. Princesa Isabel, 420 - Centro', types: [SchoolType.EJA, SchoolType.FUNDAMENTAL_2],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80', rating: 4.6, availableSlots: 300, hasAEE: true,
    ...getGeo(0.000, 0.001)
  },

  // --- ZONA F ---
  {
    id: 'sch-zona-f-1', inep: '29000028', name: 'ESCOLA MUNICIPAL EVERALDO BACELAR', zone: 'Zona F',
    address: 'Praça do Rosário, Nº34 Centro', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1577896335477-993d5448c6bd?auto=format&fit=crop&q=80', rating: 4.5, availableSlots: 260, hasAEE: true,
    ...getGeo(0.002, -0.003)
  },
  {
    id: 'sch-zona-f-2', inep: '29000029', name: 'ESCOLA MUNICIPAL VIRIATO SAMPAIO', zone: 'Zona F',
    address: 'Rua da Primavera, S/N°- Primavera', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&q=80', rating: 4.3, availableSlots: 240, hasAEE: false,
    ...getGeo(0.003, -0.004)
  },
  {
    id: 'sch-zona-f-3', inep: '29000030', name: 'ESCOLA MUNICIPAL DE TEMPO INTEGRAL PRESIDENTE TANCREDO DE ALMEIDA NEVES', zone: 'Zona F',
    address: 'Rua 02, S/N°- Jardim das Palmeiras', types: [SchoolType.FUNDAMENTAL_1, SchoolType.FUNDAMENTAL_2],
    image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&q=80', rating: 4.9, availableSlots: 380, hasAEE: true,
    ...getGeo(0.004, -0.005)
  },
  {
    id: 'sch-zona-f-4', inep: '29000031', name: 'ESCOLA MUNICIPAL INFANTIL MONTE DO PARAÍSO', zone: 'Zona F',
    address: 'Rua Aydano Vaz de Queiroz, S/N° - Matadouro', types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80', rating: 4.7, availableSlots: 100, hasAEE: false,
    ...getGeo(0.002, -0.006)
  },
  {
    id: 'sch-zona-f-5', inep: '29000032', name: 'CRECHE MUNICIPAL CHAPEUZINHO VERMELHO', zone: 'Zona F',
    address: 'Rua 08, n° 157 – Jardim das Palmeiras', types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80', rating: 4.8, availableSlots: 90, hasAEE: false,
    ...getGeo(0.004, -0.005)
  },

  // --- ESCOLAS NUCLEADAS (ZONA RURAL) ---
  {
    id: 'sch-rural-1', inep: '29000033', name: 'ESCOLA MUNICIPAL DE TEMPO INTEGRAL ARNALDO ALENCAR', zone: 'Zona Rural',
    address: 'Povoado de Testa Branca', types: [SchoolType.FUNDAMENTAL_1, SchoolType.FUNDAMENTAL_2],
    image: 'https://images.unsplash.com/photo-1544928147-79a2e746b50d?auto=format&fit=crop&q=80', rating: 4.5, availableSlots: 200, hasAEE: true,
    ...getGeo(0.05, 0.05)
  },
  {
    id: 'sch-rural-2', inep: '29000034', name: 'ESCOLA MUNICIPAL ESMERALDO QUEIROZ', zone: 'Zona Rural',
    address: 'Fazenda Lagoa do Curral', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80', rating: 4.2, availableSlots: 120, hasAEE: false,
    ...getGeo(-0.06, 0.04)
  },
  {
    id: 'sch-rural-3', inep: '29000035', name: 'ESCOLA MUNICIPAL SÃO VICENTE', zone: 'Zona Rural',
    address: 'Distrito de São Vicente', types: [SchoolType.FUNDAMENTAL_1, SchoolType.FUNDAMENTAL_2],
    image: 'https://images.unsplash.com/photo-1522661067900-ab829854a57f?auto=format&fit=crop&q=80', rating: 4.6, availableSlots: 300, hasAEE: true,
    ...getGeo(0.07, -0.05)
  },
  {
    id: 'sch-rural-4', inep: '29000036', name: 'ESCOLA MUNICIPAL DE TEMPO INTEGRAL RENATO CINCURÁ DE ANDRADE', zone: 'Zona Rural',
    address: 'Povoado Barro Duro', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1596496356938-a2a1dc6d9510?auto=format&fit=crop&q=80', rating: 4.4, availableSlots: 180, hasAEE: true,
    ...getGeo(-0.04, -0.06)
  },
  {
    id: 'sch-rural-5', inep: '29000037', name: 'ESCOLA MUNICIPAL CARLOS SPÍNOLA DA CUNHA', zone: 'Zona Rural',
    address: 'Povoado de Guaribas', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80', rating: 4.3, availableSlots: 150, hasAEE: false,
    ...getGeo(0.03, 0.08)
  },
  {
    id: 'sch-rural-6', inep: '29000038', name: 'ESCOLA MUNICIPAL DE TEMPO INTEGRAL SÃO ROQUE', zone: 'Zona Rural',
    address: 'Fazendas reunidas - Vazante', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1577896335477-993d5448c6bd?auto=format&fit=crop&q=80', rating: 4.5, availableSlots: 140, hasAEE: true,
    ...getGeo(-0.08, 0.02)
  },
  {
    id: 'sch-rural-7', inep: '29000039', name: 'ESCOLA MUNICIPAL MARIA JOSE DA COSTA RAMOS', zone: 'Zona Rural',
    address: 'Povoado Santa Quitéria', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&q=80', rating: 4.2, availableSlots: 160, hasAEE: false,
    ...getGeo(0.06, -0.03)
  },
  {
    id: 'sch-rural-8', inep: '29000040', name: 'ESCOLA MUN. DE TEMPO INTEGRAL MOISÉS RIBEIRO DE SANTANA', zone: 'Zona Rural',
    address: 'Vila Duas Irmãs', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1544531696-214dd055ff28?auto=format&fit=crop&q=80', rating: 4.7, availableSlots: 190, hasAEE: true,
    ...getGeo(-0.05, -0.04)
  },
  {
    id: 'sch-rural-9', inep: '29000041', name: 'ESCOLA MUNICIPAL ELY ROCHA', zone: 'Zona Rural',
    address: 'Distrito de São Vicente', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80', rating: 4.4, availableSlots: 130, hasAEE: false,
    ...getGeo(0.075, -0.055)
  },
  {
    id: 'sch-rural-10', inep: '29000042', name: 'CRECHE MUNICIPAL GENTE MIÚDA', zone: 'Zona Rural',
    address: 'Povoado de Guaribas', types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80', rating: 4.8, availableSlots: 60, hasAEE: false,
    ...getGeo(0.035, 0.085)
  },

  // --- ZONA RURAL PEQUENO PORTE ---
  {
    id: 'sch-rural-pp-1', inep: '29000043', name: 'ESCOLA MUNICIPAL ANTÔNIO CARLOS MAGALHAES', zone: 'Zona Rural',
    address: 'Povoado de Ipoeira', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80', rating: 4.0, availableSlots: 50, hasAEE: false,
    ...getGeo(-0.09, 0.01)
  },
  {
    id: 'sch-rural-pp-2', inep: '29000044', name: 'ESCOLA MUNICIPAL CASSIMIRO P. DOS SANTOS', zone: 'Zona Rural',
    address: 'Fazenda Lagoa Coberta', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&q=80', rating: 4.1, availableSlots: 40, hasAEE: false,
    ...getGeo(0.08, 0.02)
  },
  {
    id: 'sch-rural-pp-3', inep: '29000045', name: 'ESCOLA MUNICIPAL DUQUE DE CAXIAS', zone: 'Zona Rural',
    address: 'Fazenda Barro Branco', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80', rating: 3.9, availableSlots: 35, hasAEE: false,
    ...getGeo(-0.07, -0.08)
  },
  {
    id: 'sch-rural-pp-4', inep: '29000046', name: 'ESCOLA MUNICIPAL ELZA FREITAS MASCARENHAS', zone: 'Zona Rural',
    address: 'Fazenda Formosa', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80', rating: 4.2, availableSlots: 45, hasAEE: false,
    ...getGeo(0.06, -0.07)
  },
  {
    id: 'sch-rural-pp-5', inep: '29000047', name: 'ESCOLA MUNICIPAL LAURINA JUSTINIANO DOS SANTOS', zone: 'Zona Rural',
    address: 'Fazenda Tiririca', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80', rating: 4.0, availableSlots: 40, hasAEE: false,
    ...getGeo(-0.05, 0.09)
  },
  {
    id: 'sch-rural-pp-6', inep: '29000048', name: 'ESCOLA MUNICIPAL MARIA MILZA', zone: 'Zona Rural',
    address: 'Povoado de Alagoas', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&q=80', rating: 4.3, availableSlots: 60, hasAEE: true,
    ...getGeo(0.04, 0.06)
  },
  {
    id: 'sch-rural-pp-7', inep: '29000049', name: 'ESCOLA MUNICIPAL NOSSA SENHORA DO ROSÁRIO', zone: 'Zona Rural',
    address: 'Povoado Alto Vermelho', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&q=80', rating: 4.1, availableSlots: 55, hasAEE: false,
    ...getGeo(-0.03, -0.09)
  },
  {
    id: 'sch-rural-pp-8', inep: '29000050', name: 'ESCOLA MUNICIPAL SANTA HELENA', zone: 'Zona Rural',
    address: 'Vila Santa Helena', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1557318041-1ce374d55ebf?auto=format&fit=crop&q=80', rating: 4.4, availableSlots: 70, hasAEE: true,
    ...getGeo(0.09, 0.03)
  },
  {
    id: 'sch-rural-pp-9', inep: '29000051', name: 'ESCOLA MUNICIPAL SEVERO FRANCISCO', zone: 'Zona Rural',
    address: 'Fazenda Lagoa Nova', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1560523159-4a9692d222f9?auto=format&fit=crop&q=80', rating: 4.0, availableSlots: 45, hasAEE: false,
    ...getGeo(-0.08, 0.05)
  },
  {
    id: 'sch-rural-pp-10', inep: '29000052', name: 'ESCOLA MUNICIPAL VILA NOVA', zone: 'Zona Rural',
    address: 'Povoado Vila Nova', types: [SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1522661067900-ab829854a57f?auto=format&fit=crop&q=80', rating: 4.2, availableSlots: 50, hasAEE: false,
    ...getGeo(0.02, -0.08)
  },
  {
    id: 'sch-rural-pp-11', inep: '29000053', name: 'CENTRO EDUCACIONAL CRIANÇA FELIZ', zone: 'Zona Rural',
    address: 'Povoado de Alagoas', types: [SchoolType.INFANTIL, SchoolType.FUNDAMENTAL_1],
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80', rating: 4.5, availableSlots: 80, hasAEE: true,
    ...getGeo(0.045, 0.065)
  }
];

// Amostra de dados reais processados do CSV (Convertidos para o formato do sistema)
export const MOCK_STUDENT_REGISTRY: RegistryStudent[] = [
  // Educação Especial / AEE
  {
    id: '118810128914',
    inepId: '118810128914',
    enrollmentId: '740437594',
    name: 'LUANA DE JESUS ALMEIDA',
    birthDate: '1999-01-25',
    cpf: '081.589.275-64',
    race: 'parda',
    sex: 'feminino',
    status: 'Matriculado',
    school: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
    schoolId: 'sch-zona-d-1',
    className: '1º ANO C- VESPERTINO',
    classCode: '35258814',
    grade: 'Ensino Fundamental de 9 anos - 1º Ano',
    classSchedule: 'Segunda a Sexta - 13:00 às 17:00',
    weeklyHours: '20:00:00',
    specialNeeds: true,
    disabilityType: 'Transtorno do Déficit de Atenção com Hiperatividade (TDAH)',
    resourceAEE: 'Auxílio ledor | Tempo adicional',
    residenceZone: 'Urbana',
    transportRequest: true,
    transportVehicle: 'Vans/Kombis',
    lat: -12.5260, lng: -40.2920
  },
  {
    id: '151992904870',
    inepId: '151992904870',
    enrollmentId: '778273636',
    name: 'WILLIAM SILVA MENDES DE OLIVEIRA',
    birthDate: '2014-05-19',
    cpf: '108.798.945-04',
    race: 'não declarado',
    sex: 'masculino',
    status: 'Matriculado',
    school: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
    schoolId: 'sch-zona-d-1',
    className: 'FANFARRA ESTUDANTIL DE ITABERABA',
    classCode: '36809482',
    grade: 'Atividade complementar',
    classSchedule: 'Seg/Ter/Sex - 18:00 às 19:30',
    weeklyHours: '04:30:00',
    specialNeeds: true,
    disabilityType: 'Deficiência intelectual',
    residenceZone: 'Rural',
    transportRequest: false,
    lat: -12.5350, lng: -40.3050 // Zona Rural simulada
  },
  {
    id: '178844655313',
    inepId: '178844655313',
    enrollmentId: '740938000',
    name: 'JOAO MIGUEL CARDOSO DA PALMA',
    birthDate: '2016-12-02',
    cpf: '097.579.685-28',
    race: 'não declarado',
    sex: 'masculino',
    status: 'Matriculado',
    school: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
    schoolId: 'sch-zona-d-1',
    className: '3º ANO B- MATUTINO',
    classCode: '35285472',
    grade: 'Ensino Fundamental de 9 anos - 3º Ano',
    classSchedule: 'Segunda a Sexta - 08:00 às 12:00',
    weeklyHours: '20:00:00',
    specialNeeds: true,
    disabilityType: 'Deficiência física',
    resourceAEE: 'Tempo adicional',
    residenceZone: 'Urbana',
    transportRequest: true,
    transportVehicle: 'Vans/Kombis',
    lat: -12.5275, lng: -40.2935
  },
  
  // Educação Infantil
  {
    id: '192753648343',
    inepId: '192753648343',
    enrollmentId: '740067461',
    name: 'SAMUEL ARAUJO DE SOUSA',
    birthDate: '2020-03-19',
    cpf: '583.596.918-00',
    race: 'branca',
    sex: 'masculino',
    status: 'Matriculado',
    school: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
    schoolId: 'sch-zona-d-1',
    className: 'GRUPO 5C-VESPERTINO',
    classCode: '35258240',
    grade: 'Educação infantil - pré-escola (4 e 5 anos)',
    classSchedule: 'Segunda a Sexta - 13:00 às 17:00',
    weeklyHours: '20:00:00',
    specialNeeds: false,
    residenceZone: 'Urbana',
    transportRequest: false,
    lat: -12.5255, lng: -40.2915
  },
  {
    id: '204480760391',
    inepId: '204480760391',
    enrollmentId: '739577845',
    name: 'LEONARDO BARBOSA DOS SANTOS',
    birthDate: '2020-04-03',
    cpf: '119.436.605-81',
    race: 'parda',
    sex: 'masculino',
    status: 'Matriculado',
    school: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
    schoolId: 'sch-zona-d-1',
    className: 'GRUPO 4B- MATUTINO',
    classCode: '35245378',
    grade: 'Educação infantil - pré-escola (4 e 5 anos)',
    classSchedule: 'Segunda a Sexta - 08:00 às 12:00',
    weeklyHours: '20:00:00',
    specialNeeds: false,
    residenceZone: 'Urbana',
    transportRequest: false,
    lat: -12.5258, lng: -40.2912
  },

  // Ensino Fundamental
  {
    id: '150152946623',
    inepId: '150152946623',
    enrollmentId: '740966022',
    name: 'ANA BEATRIZ DE SOUZA MATOS',
    birthDate: '2015-02-12',
    cpf: '098.187.335-92',
    race: 'parda',
    sex: 'feminino',
    status: 'Matriculado',
    school: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
    schoolId: 'sch-zona-d-1',
    className: '3º ANO C- VESPERTINO',
    classCode: '35285483',
    grade: 'Ensino Fundamental de 9 anos - 3º Ano',
    classSchedule: 'Segunda a Sexta - 13:00 às 17:00',
    weeklyHours: '20:00:00',
    specialNeeds: false,
    residenceZone: 'Urbana',
    transportRequest: false,
    lat: -12.5270, lng: -40.2930
  },
  {
    id: '185346382509',
    inepId: '185346382509',
    enrollmentId: '740766058',
    name: 'ARTHUR GONCALVES DA SILVA',
    birthDate: '2017-08-01',
    cpf: '097.966.335-07',
    race: 'branca',
    sex: 'masculino',
    status: 'Matriculado',
    school: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
    schoolId: 'sch-zona-d-1',
    className: '2º ANO C- VESPERTINO',
    classCode: '35277691',
    grade: 'Ensino Fundamental de 9 anos - 2º Ano',
    classSchedule: 'Segunda a Sexta - 13:00 às 17:00',
    weeklyHours: '20:00:00',
    specialNeeds: false,
    residenceZone: 'Urbana',
    transportRequest: false,
    lat: -12.5272, lng: -40.2932
  },
  
  // Transporte Escolar Rural
  {
    id: '130231940091',
    inepId: '130231940091',
    enrollmentId: '778259455',
    name: 'LINCONS DA SILVA SOUZA',
    birthDate: '2013-09-30',
    cpf: '100.395.145-79',
    race: 'preta',
    sex: 'masculino',
    status: 'Matriculado',
    school: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
    schoolId: 'sch-zona-d-1',
    className: 'FANFARRA ESTUDANTIL DE ITABERABA',
    classCode: '36809482',
    grade: 'Atividade complementar',
    classSchedule: 'Seg/Ter/Sex - 18:00 às 19:30',
    weeklyHours: '04:30:00',
    specialNeeds: false,
    residenceZone: 'Rural',
    transportRequest: true,
    lat: -12.5400, lng: -40.3200 // Zona Rural
  },
  {
    id: '183008393305',
    inepId: '183008393305',
    enrollmentId: '740968698',
    name: 'AYSHA VITORIA DA ENCARNACAO OLIVEIRA',
    birthDate: '2016-10-16',
    cpf: '101.301.575-46',
    race: 'preta',
    sex: 'feminino',
    status: 'Matriculado',
    school: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
    schoolId: 'sch-zona-d-1',
    className: '3º ANO C- VESPERTINO',
    classCode: '35285483',
    grade: 'Ensino Fundamental de 9 anos - 3º Ano',
    classSchedule: 'Segunda a Sexta - 13:00 às 17:00',
    weeklyHours: '20:00:00',
    specialNeeds: false,
    residenceZone: 'Rural',
    transportRequest: true,
    transportVehicle: 'Vans/Kombis',
    lat: -12.5380, lng: -40.3150 // Zona Rural
  },

  // Alunos Indígenas
  {
    id: '193015617191',
    inepId: '193015617191',
    enrollmentId: '740977722',
    name: 'MANUELA BORGES TEIXEIRA',
    birthDate: '2016-08-02',
    cpf: '115.612.915-01',
    race: 'indigena', // Do CSV
    sex: 'feminino',
    status: 'Matriculado',
    school: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
    schoolId: 'sch-zona-d-1',
    className: '3º ANO C- VESPERTINO',
    classCode: '35285483',
    grade: 'Ensino Fundamental de 9 anos - 3º Ano',
    classSchedule: 'Segunda a Sexta - 13:00 às 17:00',
    weeklyHours: '20:00:00',
    specialNeeds: false,
    residenceZone: 'Urbana',
    transportRequest: false,
    lat: -12.5278, lng: -40.2938
  }
];

export const INITIAL_REGISTRATION_STATE: RegistrationFormState = {
  step: 1,
  student: { fullName: '', birthDate: '', cpf: '', needsSpecialEducation: false, needsTransport: false },
  guardian: { fullName: '', cpf: '', email: '', phone: '', relationship: 'Mãe' },
  address: { street: '', number: '', neighborhood: '', city: MUNICIPALITY_NAME, zipCode: '', residenceZone: 'Urbana' },
  selectedSchoolId: null
};
