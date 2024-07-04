import * as assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import * as qs from './index'

describe('parse', () => {
	it('parses a simple string', () => {
		assert.deepStrictEqual(qs.parse('0=foo'), { 0: 'foo' })
		assert.deepStrictEqual(qs.parse('foo=c++'), { foo: 'c  ' })
		assert.deepStrictEqual(qs.parse('foo'), { foo: '' })
		assert.deepStrictEqual(qs.parse('foo='), { foo: '' })
		assert.deepStrictEqual(qs.parse('foo=bar'), { foo: 'bar' })
		assert.deepStrictEqual(qs.parse(' foo = bar = baz '), {
			' foo ': ' bar = baz ',
		})
		assert.deepStrictEqual(qs.parse('foo=bar=baz'), { foo: 'bar=baz' })
		assert.deepStrictEqual(qs.parse('foo=bar&bar=baz'), {
			foo: 'bar',
			bar: 'baz',
		})
		assert.deepStrictEqual(qs.parse('foo2=bar2&baz2='), {
			foo2: 'bar2',
			baz2: '',
		})
		assert.deepStrictEqual(qs.parse('foo=bar&baz'), { foo: 'bar', baz: '' })
		assert.deepStrictEqual(
			qs.parse('cht=p3&chd=t:60,40&chs=250x100&chl=Hello|World'),
			{
				cht: 'p3',
				chd: 't:60,40',
				chs: '250x100',
				chl: 'Hello|World',
			},
		)
	})

	it('parses strings with encoded = signs', () => {
		assert.deepStrictEqual(qs.parse('he%3Dllo=th%3Dere'), {
			'he=llo': 'th=ere',
		})
	})
	it('parses strings with brackets in the value', () => {
		assert.deepStrictEqual(qs.parse('pets=["tobi"]'), { pets: '["tobi"]' })
		assert.deepStrictEqual(qs.parse('operators=[">=", "<="]'), {
			operators: '[">=", "<="]',
		})
	})

	it('parses empty values', () => {
		assert.deepStrictEqual(qs.parse(''), {})
		// @ts-expect-error only for test
		assert.deepStrictEqual(qs.parse(null), {})
		assert.deepStrictEqual(qs.parse(undefined), {})
	})

	it('supports malformed uri characters', () => {
		assert.deepStrictEqual(qs.parse('{%:%}='), { '{%:%}': '' })
		assert.deepStrictEqual(qs.parse('foo=%:%}'), { foo: '%:%}' })
	})

	it("doesn't produce empty keys", () => {
		assert.deepStrictEqual(qs.parse('_r=1&'), { _r: '1' })
	})
})
