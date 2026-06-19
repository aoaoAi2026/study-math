export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export function isPhone(value: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(value)
}

export function isUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

export function isInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value)
}

export function isPositiveInteger(value: unknown): value is number {
  return isInteger(value) && value > 0
}

export function isValidGrade(grade: unknown): grade is 1 | 2 | 3 | 4 | 5 | 6 {
  return isInteger(grade) && grade >= 1 && grade <= 6
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function isValidDifficulty(difficulty: unknown): boolean {
  return isInteger(difficulty) && difficulty >= 1 && difficulty <= 5
}

export function isValidPercentage(value: number): boolean {
  return value >= 0 && value <= 100
}

export function validateAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normalize = (s: string) => s.trim().replace(/\s+/g, '').toLowerCase()

  const userNorm = normalize(userAnswer)
  const correctNorm = normalize(correctAnswer)

  if (userNorm === correctNorm) return true

  const userNum = parseFloat(userNorm)
  const correctNum = parseFloat(correctNorm)
  if (!isNaN(userNum) && !isNaN(correctNum)) {
    return Math.abs(userNum - correctNum) < 0.0001
  }

  return false
}

export function validateChineseChars(value: string, minLen = 1, maxLen = 1000): boolean {
  const chineseRegex = /^[\u4e00-\u9fa5]+$/
  const len = value.replace(/[^\u4e00-\u9fa5]/g, '').length
  return len >= minLen && len <= maxLen
}

export function validateNickname(nickname: string): string | null {
  if (!nickname || nickname.trim().length === 0) {
    return '昵称不能为空'
  }
  if (nickname.length < 2) {
    return '昵称至少2个字符'
  }
  if (nickname.length > 20) {
    return '昵称最多20个字符'
  }
  return null
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim()
}
