export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFloat(min: number, max: number, decimals = 2): number {
  const value = Math.random() * (max - min) + min
  return Number(value.toFixed(decimals))
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function pick<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array)
  return shuffled.slice(0, count)
}

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b > 0) {
    ;[a, b] = [b, a % b]
  }
  return a
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

export function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false
  }
  return true
}

export function factorize(n: number): number[] {
  const factors: number[] = []
  let num = Math.abs(Math.round(n))
  for (let i = 2; i <= num; i++) {
    while (num % i === 0) {
      factors.push(i)
      num /= i
    }
  }
  return factors
}

export function vectorAdd(a: number[], b: number[]): number[] {
  return a.map((v, i) => v + (b[i] || 0))
}

export function vectorSub(a: number[], b: number[]): number[] {
  return a.map((v, i) => v - (b[i] || 0))
}

export function vectorScale(v: number[], scalar: number): number[] {
  return v.map(x => x * scalar)
}

export function vectorDot(a: number[], b: number[]): number {
  return a.reduce((sum, x, i) => sum + x * (b[i] || 0), 0)
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function inverseLerp(a: number, b: number, v: number): number {
  return (v - a) / (b - a)
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return lerp(outMin, outMax, inverseLerp(inMin, inMax, value))
}
