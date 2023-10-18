import {expect, it} from 'bun:test'
import {getMdPaths} from './getMdPaths'

it('returns all markdown files in the specified directory', async () => {
	const paths = await getMdPaths('docs')

	expect(paths).toHaveLength(4)
	expect(paths.sort()).toEqual(
		[
			'docs/sample.md',
			'docs/supports-react-etc.mdx',
			'docs/with-front-matter.md',
			'docs/2023/nested.md',
		].sort(),
	)
})

it('works with different rootPaths', async () => {
	const paths = await getMdPaths('video/transcripts')

	expect(paths).toHaveLength(1)
	expect(paths).toEqual(['video/transcripts/custom-docs-root-path.md'])
})
