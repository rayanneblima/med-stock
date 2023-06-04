# Estudos Quasar (quasar-project)

A Quasar Project

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Quasar Upgrade packages
```bash
quasar upgrade -i
```

### Lint the files
```bash
yarn lint
# or
npm run lint
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).


### Supabase Configuration
1. Start a Supabase Project
2. Create 3 buckets: "store-brand-img", "store-parallax-img" and "products-img"
3. Copy and paste in SQL Editor page to create project tables:
```
create table categories (
    id bigint generated by default as identity primary key,
    name text NOT NULL,
    created_at timestamp with time zone default now() not null,
    user_id uuid references auth.users(id) on delete cascade
);

create table laboratories (
    id bigint generated by default as identity primary key,
    name text NOT NULL,
    created_at timestamp with time zone default now() not null,
    user_id uuid references auth.users(id) on delete cascade
);

create table presentations (
    id bigint generated by default as identity primary key,
    name text NOT NULL,
    created_at timestamp with time zone default now() not null,
    user_id uuid references auth.users(id) on delete cascade
);

create table products (
    id bigint generated by default as identity primary key,
    name text NOT NULL,
    img_url text,
    composition text,
    dosage text,
    indication text,
    contraindication text,
    price text,
    quantity integer,
    note text,
    laboratory_id bigint REFERENCES laboratories(id),
    category_id bigint REFERENCES categories(id),
    presentation_id bigint REFERENCES presentations(id),
    created_at timestamp with time zone default now() not null,
    user_id uuid references auth.users(id) on delete cascade
);

create table stores_config (
    id bigint generated by default as identity primary key,
    name text NOT NULL,
    logo_url text,
    parallax_url text,
    whatsapp_number text,
    primary_color text,
    secondary_color text,
    created_at timestamp with time zone default now() not null,
    user_id uuid references auth.users(id) on delete cascade
);
```