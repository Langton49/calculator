export interface Point {
  x: number;
  y: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Range {
  min: number;
  max: number;
}

export interface Range2D {
  x: Range;
  y: Range;
}

export interface ParsedFunction {
  expression: string;
  variables: string[];
  compiled: Function;
  domain?: Range | Range2D;
}

export interface GraphSettings {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  gridSize: number;
}

export interface CalculatorState {
  expression: string;
  result: string | number;
  history: CalculationEntry[];
  memory: number;
  mode: 'basic' | 'scientific';
  graphSettings: GraphSettings;
}

export interface CalculationEntry {
  expression: string;
  result: number | string;
  timestamp: Date;
}