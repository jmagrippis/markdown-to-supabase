import {glob} from 'glob'

export const getMdPaths = async (rootDir: string) => {
	const mdFilePaths = await glob(`${rootDir}/**/*.{md,mdx}`, {
		ignore: 'node_modules/**',
	})

	return mdFilePaths
}
