
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
  enrollmentId?: string;
  inepId?: string;
  name: string;
  birthDate: string;
  cpf: string;
  nis?: string;
  status: 'Matriculado' | 'Pendente' | 'Em Análise' | 'Transferido' | 'Abandono';
  school?: string;
  schoolId?: string;
  shift?: string;
  grade?: string;
  className?: string;
  specialNeeds?: boolean;
  disabilityType?: string; // Ex: Autismo, Deficiência Visual
  participatesAEE?: boolean;
  municipalProjects?: string[]; // Ex: ["Música na Escola", "Robótica Municipal"]
  photo?: string;
  attendance?: {
    totalSchoolDays: number;
    presentDays: number;
    justifiedAbsences: number;
    unjustifiedAbsences: number;
  };
  performanceHistory?: PerformanceRow[];
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    zipCode: string;
    zone: 'Urbana' | 'Rural';
  };
  transportRequest?: boolean;
  lat: number;
  lng: number;
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
