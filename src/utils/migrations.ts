/**
 * Migrates data from an old resource type name to a new one
 * @param data Object containing resource data
 * @param oldName Old resource name
 * @param newName New resource name
 */
export function migrateResourceType<T extends Record<string, any>>(
  data: T,
  oldName: string,
  newName: string,
): T {
  if (!data || typeof data !== 'object') return data

  const result = { ...data }
  if (oldName in result) {
    const oldValue = result[oldName as keyof T]
    const existingValue = result[newName as keyof T] || 0
    result[newName as keyof typeof result] = existingValue + oldValue
    delete (result as any)[oldName]
  }

  return result
}