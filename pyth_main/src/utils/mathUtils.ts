export const formatNumber = (num: number, precision: number = 6): string => {
  return parseFloat(num.toPrecision(precision)).toString();
};

export const isValidExpression = (expression: string): boolean => {
  // Basic validation - will be expanded in subsequent tasks
  return expression.trim().length > 0;
};