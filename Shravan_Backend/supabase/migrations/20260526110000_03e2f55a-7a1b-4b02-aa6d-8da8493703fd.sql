-- Create user_profiles table to mirror auth users for admin account management
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view user profiles" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user profiles" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert user profiles" ON public.user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user profiles" ON public.user_profiles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.sync_user_profile_on_auth_insert()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, phone, role)
  VALUES (NEW.id, NEW.email, NEW.phone, 'user')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_profile_on_auth_insert();

CREATE OR REPLACE FUNCTION public.sync_user_profile_on_auth_update()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.user_profiles
  SET email = NEW.email,
      phone = NEW.phone,
      updated_at = now()
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER auth_user_updated_profile
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_profile_on_auth_update();

CREATE OR REPLACE FUNCTION public.sync_user_profile_role()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE public.user_profiles
    SET role = 'user', updated_at = now()
    WHERE user_id = OLD.user_id;
  ELSE
    UPDATE public.user_profiles
    SET role = NEW.role, updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER user_roles_changed_profile
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_profile_role();
