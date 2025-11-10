export interface VacationData {
  codusu: number;
  nome: string;
  dataini: string;
  datafim: string;
}

export interface VacationPeriod extends VacationData {
  startDate: Date;
  endDate: Date;
  hasConflict: boolean;
  conflictWith?: number[];
}
