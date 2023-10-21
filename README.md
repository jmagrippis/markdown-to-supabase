# Markdown to Supabase

![Action Smoke Test](https://github.com/jmagrippis/markdown-to-supabase/actions/workflows/ci.yaml/badge.svg)

A Github action which syncs your [markdown](https://daringfireball.net/projects/markdown/) files with your [Supabase](https://supabase.com/) database!

## Usage

In whichever repository you have markdown files you'd like to sync with your Supabase database, create a new action definition `yaml`, such as a `.github/workflows/markdown-to-supabase.yaml` with the following content:

```yaml
name: 'Sync Markdown with Supabase'
on: # run only on main branch changes
  push:
    branches:
      - main

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: jmagrippis/markdown-to-supabase@v0.2.0
        with:
          supabase-url: ${{ vars.PUBLIC_SUPABASE_URL }}
          supabase-service-role-key: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          docs-root-path: 'docs' # optional: defaults to "docs". Where the md files you want to sync are located
          target-table: 'docs' # optional: defaults to "docs". The target Supabase DB table
```

Make sure to set the `SUPABASE_SERVICE_ROLE_KEY` as a Github repository secret, and the `PUBLIC_SUPABASE_URL` as a repository variable in your repo settings (settings > secrets > actions). [Read more about Action Secrets and Variables](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository).

## Required DB Schema + Sample Migration

This action assumes you have a `docs` table in the public schema, with a few required fields. There is a sample migration you can get inspired by in the `supabase/migrations` directory.

You may change the target table with the `target-table` action input.

You should have a look at the example migration, which includes creating unique columns and indexes, but a quick overview of the necessary columns is:

| _column_     | _type_      |
| ------------ | ----------- |
| slug         | text        |
| checksum     | text        |
| content      | text        |
| front_matter | jsonb       |
| updated_at   | timestamptz |
| published_at | timestamptz |

`published_at` gets derived when you've got a `publishedAt` in your front-matter. It's handy because you'll probably have at least one page where you need to order your docs by recency. Also allows you to implement a "draft" state, or rudimentary scheduling functionality, by setting `publishedAt` to a future date.

You may have additional columns, such as an `id` and a `created_at`, which are included in the example migration.

You may add any other column really, but I'd advise against it, since nothing else will sync based on the markdown file and you'll end up with two sources of truth. If you want extra data, I'd suggest putting it in the front-matter!

## No file deletions!

This action does not do anything to confirm whether there still is a corresponding markdown file for an existing record. So if you delete a markdown file from the repository, that record will still persist in the database even after this action runs.

Also, if you change a filename in a way that results in a different `slug`, or put it in a different subdirectory, this action would create an additional record in the DB for it.

All of this is done to ensure we don't delete records by accident! ... And it's also less work in the business logic.

## Why `markdown-to-supabase`?!

[Next.js has some first-party support for rendering markdown & MDX](https://nextjs.org/docs/app/building-your-application/configuring/mdx), and there are plugins that can help you import markdown with Vite, for other projects such as SvelteKit.

However, while I find Markdown extremely easy & breezy to write in, keeping my docs just in the filesystem makes my life harder in other ways. Having my docs in Supabase means I can more easily have guaranteed foreign relationships between my docs and user likes, reactions and comments for example. "Cleverer" fuzzy search is more efficient & generative vector search possible. "Related docs" is simpler to implement!

This action aims to get the best of both worlds, by keeping the writing and version experience in markdown files under github version control, while automatically syncing those markdown docs to your Supabase database! It's crazy enough to work.

You can [how it's working out for me in a real project under active development](https://johnnify.com/)!

## License

[MIT](https://github.com/jmagrippis/markdown-to-supabase/blob/main/LICENSE)
