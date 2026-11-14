export type Role = 'ROLE_STUDENT' | 'ROLE_TEACHER' | 'ROLE_ADMIN';
export type ExamLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export type ExamModule = 'LESEN' | 'SPRACHBAUSTEINE' | 'HOEREN';
export type AssignmentStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  name: string;
  role: Role;
}

export interface Question {
  id: number;
  title: string;
  passage?: string;
  questionText: string;
  level: ExamLevel;
  module: ExamModule;
  audioUrl?: string;
  maxAudioPlays?: number;
  options: string[];
  correctAnswer?: string;
  explanation?: string;
  points: number;
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  level: ExamLevel;
  durationMinutes: number;
  passingPercentage: number;
  questions: Question[];
  createdAt?: string;
}

export interface ExamAssignment {
  id: number;
  student: User;
  exam: Exam;
  assignedBy: User;
  assignedAt: string;
  expiresAt: string;
  status: AssignmentStatus;
}

export interface SectionScore {
  score: number;
  maxScore: number;
  percentage: number;
}

export interface QuestionReview {
  questionId: number;
  title: string;
  passage?: string;
  questionText: string;
  module: ExamModule;
  options: string[];
  chosenAnswer?: string;
  correctAnswer: string;
  correct: boolean;
  pointsEarned: number;
  maxPoints: number;
  explanation?: string;
}

export interface ExamResult {
  id: number;
  assignmentId: number;
  examId: number;
  examTitle: string;
  examLevel: ExamLevel;
  studentEmail: string;
  studentName: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
  sectionScores: Record<ExamModule, SectionScore>;
  questionsReview: QuestionReview[];
}
