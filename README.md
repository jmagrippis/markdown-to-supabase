# Markdown to Supabase

A Github action which syncs your markdown files with your Supabase database!

This is under active development and not well-tested! You are NOT meant to use
this... yet 🙏

## Usage

In whichever repository you wish to sync your markdown files with your Supabase database, create a new action called `.github/workflows/markdown-to-supabase.yml` with the following content:

```yml
name: 'Sync Markdown with Supabase'
on: # run on main branch changes
  push:
    branches:
      - main

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/embeddings-generator@v0.x.x # Find the latest version in the Marketplace
        with:
          supabase-url: ${{ vars.PUBLIC_SUPABASE_URL }}
          supabase-service-role-key: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          docs-root-path: 'docs' # optional: defaults to "docs". Where the md you want to sync lives
```

Make sure to set the `SUPABASE_SERVICE_ROLE_KEY` as a Github repository secret, and the `PUBLIC_SUPABASE_URL` as a repository variable in your repo settings (settings > secrets > actions).

## License

[MIT](https://github.com/supabase/embeddings-generator/blob/main/LICENSE)
