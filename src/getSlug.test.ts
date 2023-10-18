import {expect, it} from 'bun:test'

import {getSlug} from './getSlug'

it('ignores the root path when creating the slug', () => {
	const slugA = getSlug('docs/sample.md', 'docs')

	expect(slugA).not.toInclude('docs')

	const slugB = getSlug('another-dir/sample.md', 'another-dir')

	expect(slugB).not.toInclude('another-dir')
})

it('strips the file extension when creating the slug', () => {
	const slug = getSlug('docs/sample.md', 'docs')

	expect(slug).not.toInclude('md')
})

it('returns the given path sluggified', () => {
	const slug = getSlug('docs/with-front-matter.md', 'docs')

	expect(slug).toBe('with-front-matter')
})

it('works with filenames with spaces', () => {
	const slug = getSlug('docs/ChatGPT-4 with SvelteKit!.md', 'docs')

	expect(slug).toBe('chatgpt-4-with-sveltekit')
})

it('adds spaces for nested directories', () => {
	const slug = getSlug('docs/2023/nested.md', 'docs')

	expect(slug).toBe('2023-nested')
})
