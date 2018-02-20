/**
 * Interface for JSON-friendly object which keys are string and values are strings, numbers or booleans.
 * Note it cannot be nested like JSON object.
 */
export interface FlatObject {
	[key: string]: string | number | boolean
}