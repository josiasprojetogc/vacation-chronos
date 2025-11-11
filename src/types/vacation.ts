export interface VacationData {
  codusu: number;
  nome: string;
  dataini: string;
  datafim: string;
  datainireq: string;
  datafimreq: string;
}

export interface VacationPeriod extends VacationData {
  startDate: Date;
  endDate: Date;
  startDateReq: Date;
  endDateReq: Date;
  hasConflict: boolean;
  conflictWith?: number[];
}

export type VacationType = 'requested' | 'official';
