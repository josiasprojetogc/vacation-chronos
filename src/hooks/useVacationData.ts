import { useQuery } from "@tanstack/react-query";
import { VacationData, VacationPeriod } from "@/types/vacation";
import { parseBrazilianDate } from "@/utils/dateUtils";
import { detectConflicts } from "@/utils/conflictDetection";

const API_URL = "https://api-ferias-ti-dot-vmgc-e-commerce.rj.r.appspot.com/api/v1/vacation/";

export const useVacationData = (minDate?: Date) => {
  return useQuery({
    queryKey: ["vacations", minDate?.toISOString()],
    queryFn: async (): Promise<VacationPeriod[]> => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch vacation data");
      }
      const data: VacationData[] = await response.json();
      
      let processedData = data.map((item) => ({
        ...item,
        startDate: parseBrazilianDate(item.dataini),
        endDate: parseBrazilianDate(item.datafim),
        startDateReq: parseBrazilianDate(item.datainireq),
        endDateReq: parseBrazilianDate(item.datafimreq),
        hasConflict: false,
        conflictWith: [],
      }));
      
      // Filtrar férias que se sobrepõem ao período visível (termina após ou durante o mês selecionado)
      if (minDate) {
        processedData = processedData.filter(item => item.endDate >= minDate || item.endDateReq >= minDate);
      }
      
      // Ordenar por data de início (asc)
      processedData.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      
      return detectConflicts(processedData);
    },
    refetchInterval: 60000, // Refetch every minute
  });
};
