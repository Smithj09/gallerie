-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read comments
CREATE POLICY "Anyone can read comments" ON comments
  FOR SELECT USING (true);

-- Create policy to allow anyone to insert comments
CREATE POLICY "Anyone can insert comments" ON comments
  FOR INSERT WITH CHECK (true);

-- Create policy to allow deletion with passkey (you'll need to implement this in your app logic)
CREATE POLICY "Anyone can delete comments" ON comments
  FOR DELETE USING (true);