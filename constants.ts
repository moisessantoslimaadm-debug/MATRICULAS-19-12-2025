
import { School, SchoolType, RegistryStudent, RegistrationFormState } from './types';

export const MUNICIPALITY_NAME = "Itaberaba";

export const MOCK_SCHOOLS: School[] = [
  {
    id: '29463777',
    inep: '29463777',
    name: 'CENTRO MUNICIPAL DE ED INF CEMEI LINESIO BASTOS DE SANTANA',
    address: 'Zona Urbana, Itaberaba - BA',
    types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80',
    rating: 5.0,
    availableSlots: 400,
    lat: -12.5253,
    lng: -40.2917,
    hasAEE: true 
  },
  {
    id: '29383940',
    inep: '29383940',
    name: 'ESCOLA MUNICIPAL JOÃO XXIII',
    address: 'Rua São José, 12 - Primavera, Itaberaba - BA',
    types: [SchoolType.FUNDAMENTAL_1, SchoolType.FUNDAMENTAL_2],
    image: 'https://images.unsplash.com/photo-1577896851231-70ef1460370e?auto=format&fit=crop&q=80',
    rating: 4.8,
    availableSlots: 450,
    lat: -12.5280,
    lng: -40.3020,
    hasAEE: true
  }
];

export const MOCK_STUDENT_REGISTRY: RegistryStudent[] = [
  {
    id: '1',
    inepId: '192488740534',
    enrollmentId: '741668410',
    name: 'LORENA MENEZES FERREIRA',
    birthDate: '25/09/2020',
    cpf: '58834789806',
    race: 'parda',
    sex: 'feminino',
    status: 'Matriculado',
    school: 'CEMEI LINESIO BASTOS DE SANTANA',
    schoolId: '29463777',
    className: 'GRUPO 4 F - VESPERTINO',
    classCode: '35309535',
    grade: 'Educação infantil - pré-escola (4 e 5 anos)',
    classSchedule: 'Segunda a Sexta - 13:00 às 17:00',
    weeklyHours: '20:00:00',
    residenceZone: 'Urbana',
    transportRequest: false,
    specialNeeds: false,
    lat: -12.5253, lng: -40.2917
  },
  {
    id: '2',
    inepId: '193137298570',
    enrollmentId: '750447994',
    name: 'ANTHONY OLIVEIRA FRANCA',
    birthDate: '21/07/2020',
    cpf: '12087350558',
    race: 'preta',
    sex: 'masculino',
    status: 'Matriculado',
    school: 'CEMEI LINESIO BASTOS DE SANTANA',
    schoolId: '29463777',
    className: 'ATENDIMENTO EDUCACIONAL ESPECIALIZADO - AEE - TURMA D',
    classCode: '35621544',
    grade: 'AEE - VESPERTINO',
    classSchedule: 'Terça e Quinta - 13:30 às 16:00',
    weeklyHours: '05:00:00',
    specialNeeds: true,
    disabilityType: 'Transtorno do espectro autista',
    resourceAEE: 'Auxílio ledor | Tempo adicional',
    residenceZone: 'Urbana',
    transportRequest: true,
    transportVehicle: 'Vans/Kombis | Ônibus',
    lat: -12.5255, lng: -40.2919
  },
  {
    id: '3',
    inepId: '193263003584',
    enrollmentId: '742317200',
    name: 'KEVIN RYAN GOMES DE SOUZA',
    birthDate: '08/02/2020',
    cpf: '58271214870',
    race: 'parda',
    sex: 'masculino',
    status: 'Matriculado',
    school: 'CEMEI LINESIO BASTOS DE SANTANA',
    schoolId: '29463777',
    className: 'GRUPO 5 E - VESPERTINO',
    classCode: '35331126',
    grade: 'Educação infantil - pré-escola (4 e 5 anos)',
    residenceZone: 'Urbana',
    transportRequest: true,
    transportVehicle: 'Vans/Kombis | Ônibus',
    specialNeeds: false,
    lat: -12.5256, lng: -40.2920
  }
];

export const INITIAL_REGISTRATION_STATE: RegistrationFormState = {
  step: 1,
  student: { fullName: '', birthDate: '', cpf: '', needsSpecialEducation: false, needsTransport: false },
  guardian: { fullName: '', cpf: '', email: '', phone: '', relationship: 'Mãe' },
  address: { street: '', number: '', neighborhood: '', city: MUNICIPALITY_NAME, zipCode: '', residenceZone: 'Urbana' },
  selectedSchoolId: null
};
