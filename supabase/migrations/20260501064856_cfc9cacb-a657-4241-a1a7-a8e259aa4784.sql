
-- Set search_path on tg_updated_at
create or replace function public.tg_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin new.updated_at = now(); return new; end;
$$;

-- Revoke execute from public roles on internal functions
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.tg_updated_at() from anon, authenticated, public;
revoke execute on function public.has_role(uuid, public.app_role) from anon, public;
-- has_role still needs to be callable from RLS as authenticated; it's invoked in policy expressions which run as the policy owner, so revoking from authenticated is fine
revoke execute on function public.has_role(uuid, public.app_role) from authenticated;
