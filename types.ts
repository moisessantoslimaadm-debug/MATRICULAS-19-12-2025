
export enum SchoolType {
  INFANTIL = 'Educação Infantil',
  FUNDAMENTAL_1 = 'Fundamental I',
  FUNDAMENTAL_2 = 'Fundamental II',
  MEDIO = 'Ensino Médio',
  EJA = 'EJA'
}

export enum UserRole {
  ADMIN_SME = 'Secretaria de Educação',
  DIRECTOR = 'Diretor Escolar',
  TEACHER = 'Professor',
  STUDENT = 'Aluno / Responsável'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  schoolId?: string;
  schoolName?: string;
  email: string;
  photo?: string;
  studentId?: string;
}

export interface PerformanceRow {
  subject: string;
  g1?: string[]; 
  average?: number;
  concept?: 'DI' | 'EP' | 'DB' | 'DE';
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  schoolId: string;
  schoolName?: string;
  cpf: string;
  email: string;
  status: 'Ativo' | 'Licença' | 'Desligado';
  phone?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: string;
  status: 'Ativo' | 'Pausado' | 'Encerrado';
  participantsCount: number;
  budget?: string;
}

export interface RegistryStudent {
  id: string;
  enrollmentId?: string; 
  inepId?: string; 
  nire?: string; 
  name: string;
  birthDate: string;
  cpf: string;
  nationality?: string;
  race?: string; 
  sex?: 'masculino' | 'feminino';
  status: 'Matriculado' | 'Pendente' | 'Em Análise' | 'Transferido' | 'Abandono';
  school?: string;
  schoolId?: string;
  grade?: string; 
  classCode?: string; 
  className?: string; 
  mediationType?: string; 
  classSchedule?: string; 
  weeklyHours?: string; 
  specialNeeds?: boolean;
  disabilityType?: string; 
  resourceAEE?: string; 
  residenceZone?: 'Urbana' | 'Rural';
  transportRequest?: boolean;
  transportVehicle?: string; 
  photo?: string;
  lat: number;
  lng: number;
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    zipCode: string;
    zone: 'Urbana' | 'Rural';
  };
  performanceHistory?: PerformanceRow[];
  lastSync?: string;
  geoDistance?: number; 
  projects?: string[]; // IDs dos projetos vinculados
}

export interface RegistrationFormState {
  step: number;
  student: {
    fullName: string;
    birthDate: string;
    cpf: string;
    needsSpecialEducation: boolean;
    needsTransport: boolean;
    photo?: string;
  };
  guardian: {
    fullName: string;
    relationship: string;
    phone: string;
    cpf: string;
    email: string;
  };
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    zipCode: string;
    residenceZone: 'Urbana' | 'Rural';
  };
  selectedSchoolId: string | null;
}

export interface School {
  id: string;
  inep?: string;
  name: string;
  address: string;
  types: SchoolType[];
  image: string;
  rating: number;
  availableSlots: number;
  lat: number;
  lng: number;
  hasAEE: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
  groundingUrls?: {uri: string, title: string}[];
}
