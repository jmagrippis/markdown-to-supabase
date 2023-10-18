import core from '@actions/core'

import {run} from './main'

try {
	if (
		typeof Bun.env.DOCS_ROOT_PATH !== 'string' ||
		typeof Bun.env.TARGET_TABLE !== 'string' ||
		typeof Bun.env.PUBLIC_SUPABASE_URL !== 'string' ||
		typeof Bun.env.SUPABASE_SERVICE_ROLE_KEY !== 'string'
	) {
		throw new Error('Required variables not set')
	}

	run({
		docsRootPath: Bun.env.DOCS_ROOT_PATH,
		targetTable: Bun.env.TARGET_TABLE,
		supabaseUrl: Bun.env.PUBLIC_SUPABASE_URL,
		supabaseServiceRoleKey: Bun.env.SUPABASE_SERVICE_ROLE_KEY,
	})
} catch (err) {
	core.setFailed(`Action failed with error: ${err}`)
}
