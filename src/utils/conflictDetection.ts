import { VacationPeriod } from "@/types/vacation";

export const detectConflicts = (vacations: VacationPeriod[]): VacationPeriod[] => {
  return vacations.map((vacation) => {
    const conflicts: number[] = [];
    
    vacations.forEach((other) => {
      if (vacation.codusu === other.codusu) return;
      
      // Detectar conflitos baseado nas datas de solicitação (datainireq/datafimreq)
      const hasOverlap = 
        (vacation.startDateReq <= other.endDateReq && vacation.endDateReq >= other.startDateReq) ||
        (other.startDateReq <= vacation.endDateReq && other.endDateReq >= vacation.startDateReq);
      
      if (hasOverlap) {
        conflicts.push(other.codusu);
      }
    });
    
    return {
      ...vacation,
      hasConflict: conflicts.length > 0,
      conflictWith: conflicts,
    };
  });
};
