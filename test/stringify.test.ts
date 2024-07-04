import * as assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import * as qs from '../src/stringify.js'

describe('stringify', () => {
	it('stringifies a querystring object', () => {
		assert.strictEqual(qs.stringify({ a: 'b' }), 'a=b')
		assert.strictEqual(qs.stringify({ a: 1 }), 'a=1')
		assert.strictEqual(qs.stringify({ a: 1, b: 2 }), 'a=1&b=2')
		assert.strictEqual(qs.stringify({ a: 'A_Z' }), 'a=A_Z')
		assert.strictEqual(qs.stringify({ a: '€' }), 'a=%E2%82%AC')
		assert.strictEqual(qs.stringify({ a: '' }), 'a=%EE%80%80')
		assert.strictEqual(qs.stringify({ a: 'א' }), 'a=%D7%90')
		assert.strictEqual(qs.stringify({ a: '𐐷' }), 'a=%F0%90%90%B7')
	})

	it('stringifies falsy values', () => {
		assert.strictEqual(qs.stringify(undefined), '')
		assert.strictEqual(qs.stringify(null), '')
		assert.strictEqual(qs.stringify(false), '')
		assert.strictEqual(qs.stringify(0), '')
	})

	it('stringifies symbols', () => {
		assert.strictEqual(qs.stringify(Symbol.iterator), '')
		assert.strictEqual(
			qs.stringify([Symbol.iterator]),
			'0=Symbol%28Symbol.iterator%29',
		)
		assert.strictEqual(
			qs.stringify({ a: Symbol.iterator }),
			'a=Symbol%28Symbol.iterator%29',
		)
	})

	it('stringifies bigints', () => {
		const three = BigInt(3)

		assert.strictEqual(qs.stringify(three), '')
		assert.strictEqual(qs.stringify([three]), '0=3')
		assert.strictEqual(qs.stringify({ a: three }), 'a=3')
	})

	it('omits object key/value pair when value is empty array', () => {
		assert.strictEqual(qs.stringify({ a: [], b: 'zz' }), 'b=zz')
	})

	it('stringifies a null object', { skip: !Object.create }, () => {
		const obj = Object.create(null)
		obj.a = 'b'
		assert.strictEqual(qs.stringify(obj), 'a=b')
	})

	it('drops keys with a value of undefined', () => {
		assert.strictEqual(qs.stringify({ a: undefined }), '')
	})

	it('url encodes values', () => {
		assert.strictEqual(qs.stringify({ a: 'b c' }), 'a=b%20c')
	})

	it('stringifies a date', () => {
		const now = new Date()
		const expected = `a=${encodeURIComponent(now.toISOString())}`
		assert.strictEqual(qs.stringify({ a: now }), expected)
	})

	it('stringifies the weird object from qs', () => {
		assert.strictEqual(
			qs.stringify({ 'my weird field': '~q1!2"\'w$5&7/z8)?' }),
			'my%20weird%20field=~q1%212%22%27w%245%267%2Fz8%29%3F',
		)
	})

	it('stringifies boolean values', () => {
		assert.strictEqual(qs.stringify({ a: true }), 'a=true')
		assert.strictEqual(qs.stringify({ b: false }), 'b=false')
	})

	it('stringifies buffer values', () => {
		assert.strictEqual(qs.stringify({ a: Buffer.from('test') }), 'a=test')
	})
})
