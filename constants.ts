
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
    schoolId: '29446309',
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
    schoolId: '29446309',
    schoolName: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
    cpf: '089.463.535-20',
    email: 'nora.melo@itaberaba.ba.gov.br',
    status: 'Ativo',
    phone: '(75) 99100-0002'
  }
];

export const MOCK_SCHOOLS: School[] = [
  {
    id: '29446309',
    inep: '29446309',
    name: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
    address: 'Zona Urbana, Itaberaba - BA',
    types: [SchoolType.INFANTIL, SchoolType.FUNDAMENTAL_1, SchoolType.EJA], // Baseado nas turmas do CSV (1º ao 3º ano + Grupo 4/5)
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80',
    rating: 4.9,
    availableSlots: 400, // Total de matrículas do PDF
    lat: -12.5265, // Coordenadas aproximadas do centro de Itaberaba
    lng: -40.2925,
    hasAEE: true
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
    schoolId: '29446309',
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
    schoolId: '29446309',
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
    schoolId: '29446309',
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
    schoolId: '29446309',
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
    schoolId: '29446309',
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
    schoolId: '29446309',
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
    schoolId: '29446309',
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
    schoolId: '29446309',
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
    schoolId: '29446309',
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
    schoolId: '29446309',
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
