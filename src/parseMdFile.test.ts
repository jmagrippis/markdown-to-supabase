import {expect, it} from 'bun:test'

import {parseMdFile} from './parseMdFile'

it('returns the content of the specified markdown file', async () => {
	const mdxParsed = await parseMdFile('docs/supports-react-etc.mdx')
	expect(mdxParsed.content).toBeTruthy()

	const mdParsed = await parseMdFile('docs/sample.md')
	expect(mdParsed.content).not.toBe(mdxParsed.content)
	expect(mdParsed.content).toBe(
		'# Sample\n\nThis is the most vanilla Markdown file in the world.\n',
	)
})

it('returns the front-matter of the specified markdown file', async () => {
	const {frontMatter} = await parseMdFile('docs/with-front-matter.md')

	expect(frontMatter).toEqual({
		title: 'Works with front-matter!',
		snippet: 'It’s true, this GitHub action works with front-matter',
		publishedAt: 'Oct 18, 2023',
	})
})

it('returns an empty object for frontMatter, when the specified markdown file has none', async () => {
	const {frontMatter} = await parseMdFile('docs/sample.md')

	expect(frontMatter).toEqual({})
})

it('strips any front-matter from the content of the specified markdown file', async () => {
	const {content} = await parseMdFile('docs/with-front-matter.md')

	expect(content).not.toInclude('publishedAt')
})

it('returns a checkSum', async () => {
	const {checksum} = await parseMdFile('docs/sample.md')

	expect(checksum).toBe('sjRTLllxsxHX7gsmNEv7xsfVUL4xVOAJLi5b9XloiSU=')
})
