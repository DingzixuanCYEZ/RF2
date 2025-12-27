export interface Phrase {
  id: string;
  chinese: string;
  english: string;
  consecutiveCorrect: number; // 'x' in the algorithm
  consecutiveWrong: number;
  totalReviews: number;
  lastReviewedAt?: number;
  note?: string;
}

export interface DeckStats {
  totalStudyTimeSeconds: number;
  totalReviewCount: number;
}

export interface Deck {
  id: string;
  name: string;
  phrases: Phrase[];
  queue: string[]; // Array of Phrase IDs representing the study order
  stats?: DeckStats; // New: Milestones per deck
}

export interface DailyStats {
  date: string; // YYYY-MM-DD (Asia/Shanghai)
  reviewCount: number;
  correctCount: number; // New: Track correct answers
  wrongCount: number;   // New: Track wrong answers
  reviewedPhraseIds: string[]; // To track distinct phrases studied today
  studyTimeSeconds: number;
}

export interface GlobalStats {
  totalReviewCount: number;
  totalPhrasesCount: number; 
  totalStudyTimeSeconds: number;
  daily: DailyStats;
}

export interface BackupData {
  version: number;
  timestamp: number;
  decks: Deck[];
  stats: GlobalStats;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  STUDY = 'STUDY',
  IMPORT = 'IMPORT',
  EDIT_DECK = 'EDIT_DECK',
  EXAM_SETUP = 'EXAM_SETUP',
  EXAM_SESSION = 'EXAM_SESSION',
}

export enum CardState {
  HIDDEN = 'HIDDEN',       // Only Chinese shown
  VERIFYING = 'VERIFYING', // Clicked "Know", showing English + Correct/Incorrect buttons
  MISSED = 'MISSED',       // Clicked "Don't Know", showing English + Next button
  REVIEWED = 'REVIEWED',   // Clicked Correct/Incorrect, showing result + Next button
}

export interface StudySessionResult {
  phraseId: string;
  correct: boolean;
}