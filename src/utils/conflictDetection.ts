import { VacationPeriod } from "@/types/vacation";

export const detectConflicts = (vacations: VacationPeriod[]): VacationPeriod[] => {
  return vacations.map((vacation) => {
    const conflicts: number[] = [];
    
    vacations.forEach((other) => {
      if (vacation.codusu === other.codusu) return;
      
      const hasOverlap = 
        (vacation.startDate <= other.endDate && vacation.endDate >= other.startDate) ||
        (other.startDate <= vacation.endDate && other.endDate >= vacation.startDate);
      
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
