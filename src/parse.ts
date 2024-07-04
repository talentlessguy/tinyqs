export const parse = (
	q: string | string[][] | Record<string, string> | URLSearchParams | undefined,
) => {
	const urlSearchParams = new URLSearchParams(q)

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const obj: Record<string, any> = {}

	urlSearchParams.forEach((value, key) => {
		obj[key] = value
	})
	return obj
}
