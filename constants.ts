
import { School, SchoolType, RegistryStudent, RegistrationFormState } from './types';

export const MUNICIPALITY_NAME = "Itaberaba";

export const MOCK_SCHOOLS: School[] = [
  {
    id: '29383935',
    inep: '29383935',
    name: 'CRECHE PARAISO DA CRIANCA',
    address: 'Av. Rio Branco, 450 - Centro, Itaberaba - BA',
    types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80',
    rating: 5.0,
    availableSlots: 150,
    lat: -12.5253,
    lng: -40.2917,
    hasAEE: true 
  },
  {
    id: '29383940',
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

const generateMockStudents = (count: number): RegistryStudent[] => {
  const bairros = [
    { name: 'Centro', lat: -12.5253, lng: -40.2917 },
    { name: 'Primavera', lat: -12.5280, lng: -40.3020 },
    { name: 'Barro Vermelho', lat: -12.5320, lng: -40.2850 },
    { name: 'Jardim das Palmeiras', lat: -12.5180, lng: -40.3100 }
  ];

  const nomes = ['Arthur Silva Pereira', 'Beatriz Santos Oliveira', 'Caio Souza Lima', 'Daniela Ferreira Costa', 'Enzo Almeida Rodrigues'];
  const projetos = ['Robótica Municipal', 'Música na Escola', 'Atleta do Futuro', 'Horta Comunitária'];

  return Array.from({ length: count }).map((_, i) => {
    const bairro = bairros[i % bairros.length];
    const latOffset = (Math.random() - 0.5) * 0.01;
    const lngOffset = (Math.random() - 0.5) * 0.01;
    const nomeCompleto = nomes[i % nomes.length];

    return {
      id: `std-${i}-${Date.now()}`,
      enrollmentId: `PROT-${100000 + i}`,
      name: nomeCompleto.toUpperCase(),
      birthDate: '2015-05-10',
      cpf: `000.000.000-${(i % 99).toString().padStart(2, '0')}`,
      status: i % 8 === 0 ? 'Pendente' : 'Matriculado',
      school: i % 2 === 0 ? 'CRECHE PARAISO DA CRIANCA' : 'ESCOLA MUNICIPAL JOÃO XXIII',
      lat: bairro.lat + latOffset,
      lng: bairro.lng + lngOffset,
      specialNeeds: i % 5 === 0,
      disabilityType: i % 5 === 0 ? 'Autismo' : undefined,
      participatesAEE: i % 5 === 0,
      transportRequest: i % 4 === 0,
      municipalProjects: i % 3 === 0 ? [projetos[i % projetos.length]] : [],
      photo: `https://i.pravatar.cc/150?u=${i}`,
      address: {
        street: `Rua Projetada ${i + 10}`,
        number: `${Math.floor(Math.random() * 900)}`,
        neighborhood: bairro.name,
        city: 'Itaberaba',
        zipCode: '46880-000',
        zone: 'Urbana'
      }
    };
  });
};

export const MOCK_STUDENT_REGISTRY: RegistryStudent[] = generateMockStudents(40);

export const INITIAL_REGISTRATION_STATE: RegistrationFormState = {
  step: 1,
  student: { fullName: '', birthDate: '', cpf: '', needsSpecialEducation: false, needsTransport: false },
  guardian: { fullName: '', cpf: '', email: '', phone: '', relationship: 'Mãe' },
  address: { street: '', number: '', neighborhood: '', city: MUNICIPALITY_NAME, zipCode: '', residenceZone: 'Urbana' },
  selectedSchoolId: null
};
