
-- Roles enum
create type public.app_role as enum ('admin', 'team', 'user');

-- Order status enum
create type public.order_status as enum ('pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- has_role security definer
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null,
  phone text not null,
  address text not null,
  items jsonb not null,
  subtotal integer not null,
  discount integer not null default 0,
  total integer not null,
  status public.order_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;

-- Profiles policies
create policy "Profiles: own select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Profiles: admin select all" on public.profiles for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Profiles: team select all" on public.profiles for select to authenticated using (public.has_role(auth.uid(), 'team'));
create policy "Profiles: own insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Profiles: own update" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "Profiles: admin update" on public.profiles for update to authenticated using (public.has_role(auth.uid(), 'admin'));

-- user_roles policies
create policy "Roles: own select" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "Roles: admin select all" on public.user_roles for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Roles: admin insert" on public.user_roles for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Roles: admin delete" on public.user_roles for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Orders policies
create policy "Orders: own select" on public.orders for select to authenticated using (auth.uid() = user_id);
create policy "Orders: admin select all" on public.orders for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Orders: team select all" on public.orders for select to authenticated using (public.has_role(auth.uid(), 'team'));
create policy "Orders: own insert" on public.orders for insert to authenticated with check (auth.uid() = user_id);
create policy "Orders: admin update" on public.orders for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Orders: team update" on public.orders for update to authenticated using (public.has_role(auth.uid(), 'team'));
create policy "Orders: admin delete" on public.orders for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Trigger: create profile + default 'user' role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), coalesce(new.raw_user_meta_data->>'phone', ''));
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger
create or replace function public.tg_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated before update on public.profiles for each row execute function public.tg_updated_at();
create trigger orders_updated before update on public.orders for each row execute function public.tg_updated_at();
