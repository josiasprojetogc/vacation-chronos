import { useState, useEffect, useRef, RefObject } from "react";
import { ViewMode } from "@/types/viewMode";

interface UseDynamicPeriodWidthProps {
  periodsCount: number;
  leftColumnWidth: number;
  viewMode: ViewMode;
}

export const useDynamicPeriodWidth = (
  containerRef: RefObject<HTMLDivElement>,
  { periodsCount, leftColumnWidth, viewMode }: UseDynamicPeriodWidthProps
) => {
  const [periodWidth, setPeriodWidth] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const calculateWidth = () => {
      if (!containerRef.current || periodsCount === 0) return;

      const containerWidth = containerRef.current.clientWidth;
      const availableWidth = containerWidth - leftColumnWidth;
      
      // Calcular largura ideal baseada no número de períodos
      let calculatedWidth = availableWidth / periodsCount;
      
      // Definir larguras mínimas e máximas baseadas no viewMode
      let minWidth: number;
      let maxWidth: number;
      
      switch (viewMode) {
        case 'year':
          minWidth = 100;
          maxWidth = 200;
          break;
        case 'quarter':
          minWidth = 150;
          maxWidth = 300;
          break;
        case 'month':
          minWidth = 80;
          maxWidth = 180;
          break;
        case 'day':
        default:
          minWidth = 40;
          maxWidth = 150;
          break;
      }
      
      // Aplicar limites
      calculatedWidth = Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
      
      setPeriodWidth(calculatedWidth);
      setIsInitialized(true);
    };

    // Garantir que o cálculo aconteça após a montagem completa
    const timer = setTimeout(calculateWidth, 0);
    
    return () => clearTimeout(timer);

  }, [periodsCount, leftColumnWidth, viewMode, containerRef]);

  useEffect(() => {
    if (!isInitialized) return;

    const calculateWidth = () => {
      if (!containerRef.current || periodsCount === 0) return;

      const containerWidth = containerRef.current.clientWidth;
      const availableWidth = containerWidth - leftColumnWidth;
      
      let calculatedWidth = availableWidth / periodsCount;
      
      let minWidth: number;
      let maxWidth: number;
      
      switch (viewMode) {
        case 'year':
          minWidth = 100;
          maxWidth = 200;
          break;
        case 'quarter':
          minWidth = 150;
          maxWidth = 300;
          break;
        case 'month':
          minWidth = 80;
          maxWidth = 180;
          break;
        case 'day':
        default:
          minWidth = 40;
          maxWidth = 150;
          break;
      }
      
      calculatedWidth = Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
      
      setPeriodWidth(calculatedWidth);
    };

    const resizeObserver = new ResizeObserver(calculateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isInitialized, periodsCount, leftColumnWidth, viewMode, containerRef]);

  return periodWidth;
};
