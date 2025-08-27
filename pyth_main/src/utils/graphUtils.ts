import { Point, GraphSettings } from '../types';

export const scalePoint = (point: Point, settings: GraphSettings, canvasWidth: number, canvasHeight: number): Point => {
  const xScale = canvasWidth / (settings.xMax - settings.xMin);
  const yScale = canvasHeight / (settings.yMax - settings.yMin);
  
  return {
    x: (point.x - settings.xMin) * xScale,
    y: canvasHeight - (point.y - settings.yMin) * yScale
  };
};