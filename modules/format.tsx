const EXTRA_DIGITS = 5

export function formatNumber(v?: number, digits?: number): string {
  return (v || 0).toLocaleString('en', {
    minimumFractionDigits: digits ?? calcDigits(v ?? 0),
  })
}

export function calcDigits(value: number): number {
  const v = Math.abs(value)
  let digits = 2
  if (value === 0) {
    return digits
  }
  if (v < 10 && v !== 0) {
    digits = -Math.floor(Math.log(v) / Math.log(10) + 1) + EXTRA_DIGITS
  } else if (value < 100) {
    digits = 4
  }
  return Math.min(digits, 20)
}

export function formatPrice(
  v?: number,
  prefix = '$',
  suffix = '',
): string {
  const f = (v || 0).toLocaleString('en', {
    minimumFractionDigits: calcDigits(v ?? 0),
  })
  return `${prefix}${f} ${suffix}`
}
