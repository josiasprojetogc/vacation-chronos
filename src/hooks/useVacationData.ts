import { useQuery } from "@tanstack/react-query";
import { VacationData, VacationPeriod } from "@/types/vacation";
import { parseBrazilianDate } from "@/utils/dateUtils";
import { detectConflicts } from "@/utils/conflictDetection";

const API_URL = "https://api-app-gestao-patrimonial-dot-vmgc-e-commerce.rj.r.appspot.com/api/v1/vacation/";

export const useVacationData = () => {
  return useQuery({
    queryKey: ["vacations"],
    queryFn: async (): Promise<VacationPeriod[]> => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch vacation data");
      }
      const data: VacationData[] = await response.json();
      
      const processedData = data.map((item) => ({
        ...item,
        startDate: parseBrazilianDate(item.dataini),
        endDate: parseBrazilianDate(item.datafim),
        startDateReq: parseBrazilianDate(item.datainireq),
        endDateReq: parseBrazilianDate(item.datafimreq),
        hasConflict: false,
        conflictWith: [],
      }));
      
      return detectConflicts(processedData);
    },
    refetchInterval: 60000, // Refetch every minute
  });
};
