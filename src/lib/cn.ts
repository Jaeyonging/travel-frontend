type ClassValue = string | number | false | null | undefined

/** 조건부 className 결합 헬퍼 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
