-- Books table schema
create table if not exists books (
  id text primary key,
  title text not null,
  author text,
  slug text unique,
  cover_base64 text,
  code text not null,
  format text not null default 'react',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_books_updated_at on books (updated_at desc);
create index if not exists idx_books_title on books (title);

