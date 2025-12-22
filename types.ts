
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

export interface RegistryStudent {
  id: string;
  enrollmentId?: string; // Código da Matrícula (741668410...)
  inepId?: string; // Identificação única (192488740534...)
  name: string;
  birthDate: string;
  cpf: string;
  nationality?: string;
  race?: string; // Cor/Raça
  sex?: 'masculino' | 'feminino';
  status: 'Matriculado' | 'Pendente' | 'Em Análise' | 'Transferido' | 'Abandono';
  school?: string;
  schoolId?: string;
  grade?: string; // Etapa de ensino
  classCode?: string; // Código da turma
  className?: string; // Nome da turma (Ex: GRUPO 4 F)
  mediationType?: string; // Presencial/EAD
  classSchedule?: string; // Dias e horário (Segunda a Sexta...)
  weeklyHours?: string; // Carga horária (20:00:00)
  specialNeeds?: boolean;
  disabilityType?: string; // Transtorno do espectro autista, etc.
  resourceAEE?: string; // Auxílio ledor, tempo adicional...
  residenceZone?: 'Urbana' | 'Rural';
  transportRequest?: boolean;
  transportVehicle?: string; // Vans/Kombis, Ônibus, Micro-ônibus
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
}
