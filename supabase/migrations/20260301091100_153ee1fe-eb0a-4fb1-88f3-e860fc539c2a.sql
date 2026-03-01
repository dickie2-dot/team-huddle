CREATE OR REPLACE FUNCTION public.ensure_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN
    RETURN false;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext('ensure_first_admin'));

  IF EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE role = 'admin'
  ) THEN
    RETURN EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _uid
        AND role = 'admin'
    );
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _uid
      AND role = 'admin'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_first_admin() TO authenticated;