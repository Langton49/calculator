import { Point2D } from '../types';
import { MathEngine } from './MathService';

export class GraphService {
  static generatePoints2D(expression: string, xMin: number, xMax: number, step: number = 0.1): Point2D[] {
    try {
      const parsedFunction = MathEngine.parseExpression(expression);
      const points: Point2D[] = [];
      
      for (let x = xMin; x <= xMax; x += step) {
        try {
          const y = MathEngine.evaluateFunction(parsedFunction, { x });
          if (isFinite(y)) {
            points.push({ x, y });
          }
        } catch (error) {
          // Skip points that can't be evaluated (e.g., domain errors)
          continue;
        }
      }
      
      return points;
    } catch (error) {
      throw new Error(`Cannot generate points for expression "${expression}": ${(error as Error).message}`);
    }
  }

  // Legacy method for backward compatibility
  static generatePoints(expression: string, xMin: number, xMax: number, step: number = 0.1): Point2D[] {
    return this.generatePoints2D(expression, xMin, xMax, step);
  }
}