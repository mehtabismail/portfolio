-- Tighten public blog reads: only published posts on published portfolios.
DROP POLICY IF EXISTS "public_read_published_blogs" ON blogs;

CREATE POLICY "public_read_published_blogs"
  ON blogs FOR SELECT
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM platform_users u
      WHERE u.id = blogs.user_id AND u.is_published = true
    )
  );
