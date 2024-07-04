const td = new TextDecoder()

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const stringify = (obj: any) => {
	const params = new URLSearchParams()

	if (obj === true) return 'true'
	if (typeof obj !== 'object' || obj == null) return ''

	if (typeof obj === 'symbol') return obj.toString()

	for (const key of Object.keys(obj)) {
		let value = obj[key]
		if (value != null) {
			if (typeof value === 'symbol') value = value.toString()
			else if (value instanceof Date) value = value.toISOString()
			else if (ArrayBuffer.isView(value)) value = td.decode(value)
			else if (typeof value === 'boolean') value = value ? 'true' : 'false'
			if (!(Array.isArray(value) && value.length === 0)) {
				params.set(key, value)
			}
		}
	}

	// sort alphabetically
	params.sort()

	let qs = params.toString()

	while (qs.includes('%7E')) {
		qs = qs.replace('%7E', '~')
	}

	while (qs.includes('+')) {
		qs = qs.replace('+', '%20')
	}

	return qs
}
