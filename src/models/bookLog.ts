export interface BookLog {
  id: number;
  pageStart: number;
  pageEnd: number;
  readingTime: number;
  readingDate: string;
  logType: '일반' | '완독';
}

export interface BookLogQuestion {
  id: number;
  question: string;
  answer: string;
}
