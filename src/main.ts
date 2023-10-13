type ActionInput = {
	docsRootPath: string
	supabaseUrl: string
	supabaseServiceRoleKey: string
}

export const run = async ({
	docsRootPath,
	supabaseUrl,
	supabaseServiceRoleKey,
}: ActionInput): Promise<void> => {
	if (!docsRootPath || !supabaseUrl || !supabaseServiceRoleKey) {
		throw new Error('invalid arguments')
	}
	console.log({docsRootPath, supabaseUrl, supabaseServiceRoleKey})
}
