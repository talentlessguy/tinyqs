// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const stringify = (obj: any) => {
	const params = new URLSearchParams()

	if (typeof obj !== 'object' || obj == null) return ''

	if (typeof obj === 'symbol') return obj.toString()

	const keys = Object.keys(obj)

	for (const key of keys.sort()) {
		let value = obj[key]
		if (value) {
			if (typeof value === 'symbol') value = value.toString()
			if (value instanceof Date) value = value.toISOString()
			if (!(Array.isArray(value) && value.length === 0)) params.set(key, value)
		}
	}

	return params.toString()
}
