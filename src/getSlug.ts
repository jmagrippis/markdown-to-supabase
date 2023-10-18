import {slug} from 'github-slugger'

export const getSlug = (path: string, rootDirectory: string) => {
	const lastDotIndex = path.lastIndexOf('.')
	// +1 accounts for the extra slash
	const subPath = path
		.slice(rootDirectory.length + 1, lastDotIndex)
		.replace('/', ' ')

	return slug(subPath)
}
