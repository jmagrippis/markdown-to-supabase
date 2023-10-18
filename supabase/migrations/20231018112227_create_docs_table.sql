create table "public"."docs" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "slug" text not null,
    "content" text not null,
    "front_matter" jsonb not null default '{}'::jsonb,
    "checksum" text not null,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."docs" enable row level security;

CREATE UNIQUE INDEX docs_pkey ON public.docs USING btree (id);

CREATE UNIQUE INDEX docs_slug_key ON public.docs USING btree (slug);

alter table "public"."docs" add constraint "docs_pkey" PRIMARY KEY using index "docs_pkey";

alter table "public"."docs" add constraint "docs_slug_key" UNIQUE using index "docs_slug_key";

create policy "Enable read access for all users"
on "public"."docs"
as permissive
for select
to public
using (true);



