/**
 * Data transformation utilities
 * Converts between snake_case (backend) and camelCase (frontend)
 */

type AnyObject = Record<string, any>;

/**
 * Convert snake_case string to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase string to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Recursively transform object keys from snake_case to camelCase
 */
export function transformKeysToCamel<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(transformKeysToCamel) as T;
  }
  
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = snakeToCamel(key);
    const value = obj[key];
    
    acc[camelKey] = transformKeysToCamel(value);
    return acc;
  }, {} as AnyObject) as T;
}

/**
 * Recursively transform object keys from camelCase to snake_case
 */
export function transformKeysToSnake<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(transformKeysToSnake) as T;
  }
  
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = camelToSnake(key);
    const value = obj[key];
    
    acc[snakeKey] = transformKeysToSnake(value);
    return acc;
  }, {} as AnyObject) as T;
}

