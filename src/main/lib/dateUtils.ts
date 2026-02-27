import { parse, parseISO, format } from 'date-fns'

/**
 * Devuelve el nombre corto del día (p.ej. 'Mon', 'Tue') para una cadena
 * de fecha. Acepta tanto 'YYYY-MM-DD' como ISO completo con hora.
 *
 * - Para cadenas en formato 'YYYY-MM-DD' se usa `parse` para construir
 *   la fecha en la zona local (evita el desplazamiento por UTC).
 * - Para fechas con hora/offset se usa `parseISO`.
 */
export function weekdayShortFromString(dateStr: string): string {
  let d: Date
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
  try {
    d = isDateOnly ? parse(dateStr, 'yyyy-MM-dd', new Date()) : parseISO(dateStr)
  } catch (e) {
    // Fallback: parseISO (may still fail)
    d = parseISO(dateStr)
  }

  return format(d, 'eee')
}

export function toLocalDateFromYYYYMMDD(dateStr: string): Date {
  return parse(dateStr, 'yyyy-MM-dd', new Date())
}

export default { weekdayShortFromString, toLocalDateFromYYYYMMDD }
