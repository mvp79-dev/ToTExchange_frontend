import BigNumber from "bignumber.js";

export function convertToDecimal(n: number, decimal: number): string {
  const convertedValue = new BigNumber(n).dividedBy(
    new BigNumber(10).pow(decimal)
  );
  return convertedValue.toString();
}

export function convertToOriginal(n: number, decimal: number) {
  const originalValue = new BigNumber(n).multipliedBy(
    new BigNumber(10).pow(decimal)
  );
  return originalValue.toFixed(0);
}

export const expandExponential = (str: string) => {
  return str.replace(
    /^([+-])?(\d+).?(\d*)[eE]([-+]?\d+)$/,
    (matchpart, s, n, f, c) => {
      const l = +c < 0,
        x = (l ? n : f).length;
      const absC = Math.abs(c);
      const t = absC >= x ? absC - x + Number(l) : 0;
      let i = n.length + +c;
      const z = new Array(t + 1).join("0");
      let r = n + f;
      return (
        (s || "") +
        (l ? (r = z + r) : (r += z)).substr(0, (i += l ? z.length : 0)) +
        (i < r.length ? "." + r.substr(i) : "")
      );
    }
  );
};
