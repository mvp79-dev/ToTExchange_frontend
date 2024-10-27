// 1.454445 => 1.4544
export const roundNumberDecimal = (number: number, decimal: number) => {
  const factor = Math.pow(10, decimal);
  return Math.round(number * factor) / factor;
};
