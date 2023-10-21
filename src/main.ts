import {createClient} from '@supabase/supabase-js'

import {getMdPaths} from './getMdPaths'
import {getSlug} from './getSlug'
import {parseMdFile} from './parseMdFile'

type ActionInput = {
	docsRootPath: string
	targetTable: string
	supabaseUrl: string
	supabaseServiceRoleKey: string
}

type DbDoc = {
	slug: string
	checksum: string
	content: string
	front_matter: Record<string, unknown>
	published_at?: string
	updated_at?: string
}

export const run = async ({
	docsRootPath,
	targetTable,
	supabaseUrl,
	supabaseServiceRoleKey,
}: ActionInput): Promise<void> => {
	const mdPaths = await getMdPaths(docsRootPath)

	if (!mdPaths.length) {
		console.log(`🧐 did not find any files in ${docsRootPath}!`)
		return
	}

	console.log(`🔎 found ${mdPaths.length} markdown files to process`)

	const stats = {updates: 0, inserts: 0, skips: 0}

	const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	})

	for (const path of mdPaths) {
		const slug = getSlug(path, docsRootPath)

		const doc = await parseMdFile(path)

		// Check for existing page in DB and compare checksums
		const {error: fetchError, data: existingDoc} = await supabase
			.from(targetTable)
			.select('checksum')
			.match({slug})
			.limit(1)
			.maybeSingle()

		if (fetchError) {
			throw fetchError
		}

		if (!existingDoc) {
			console.log(`👶 new file ${path}, inserting into DB...`)

			const insertedDoc: DbDoc = {
				slug,
				checksum: doc.checksum,
				content: doc.content,
				front_matter: doc.frontMatter,
			}
			if (doc.publishedAt) {
				insertedDoc.published_at = doc.publishedAt
			}

			const {error: insertError} = await supabase
				.from(targetTable)
				.insert(insertedDoc)

			if (insertError) {
				throw insertError
			}

			stats.inserts++
			console.log(`inserted new file with slug ${slug}!`)
		} else {
			console.log(`found matching slug ${slug} for ${path} in the DB`)

			if (existingDoc.checksum === doc.checksum) {
				stats.skips++
				console.log(`⏭️ checksums match, skipping ${slug}...`)
			} else {
				console.log(`checksums do not match, updating ${slug}...`)

				const updatedDoc: DbDoc = {
					slug,
					checksum: doc.checksum,
					content: doc.content,
					front_matter: doc.frontMatter,
					updated_at: new Date().toISOString(),
				}
				if (doc.publishedAt) {
					updatedDoc.published_at = doc.publishedAt
				}

				const {error: updateError} = await supabase
					.from(targetTable)
					.update(updatedDoc)
					.match({slug})
					.limit(1)

				if (updateError) {
					throw updateError
				}

				stats.updates++
				console.log(`📝 updated file with slug ${slug}!`)
			}
		}
	}

	console.log('🎉 done 🎉')

	console.log(
		`inserts: ${stats.inserts}, updates: ${stats.updates}, skips (unchanged): ${stats.skips}`,
	)

	console.log('👋 have a lovely time 👋')
}
