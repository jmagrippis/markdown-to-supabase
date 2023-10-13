import core from '@actions/core'

import {run} from './main'

try {
	const [, , docsRootPath, supabaseUrl, supabaseServiceRoleKey] = Bun.argv

	run({
		docsRootPath,
		supabaseUrl,
		supabaseServiceRoleKey,
	})
} catch (err) {
	core.setFailed(`Action failed with error: ${err}`)
}
