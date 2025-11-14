import { useState } from "react";

export type ZoomLevel = 1 | 2 | 3 | 4 | 5;

const ZOOM_CONFIGS = {
  1: { dayWidth: 120, name: "Ano" },
  2: { dayWidth: 180, name: "Trimestre" },
  3: { dayWidth: 120, name: "Mês" },
  4: { dayWidth: 100, name: "Dia" },
  5: { dayWidth: 150, name: "Dia (Zoom)" },
};

export const useGanttZoom = () => {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(4);

  const zoomIn = () => {
    if (zoomLevel < 5) {
      setZoomLevel((prev) => (prev + 1) as ZoomLevel);
    }
  };

  const zoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel((prev) => (prev - 1) as ZoomLevel);
    }
  };

  const dayWidth = ZOOM_CONFIGS[zoomLevel].dayWidth;
  const zoomName = ZOOM_CONFIGS[zoomLevel].name;

  return {
    zoomLevel,
    dayWidth,
    zoomName,
    zoomIn,
    zoomOut,
    canZoomIn: zoomLevel < 5,
    canZoomOut: zoomLevel > 1,
    setZoomLevel,
  };
};
