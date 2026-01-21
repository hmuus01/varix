-- =============================================
-- DRAWING FILES TABLE + RLS POLICIES
-- =============================================
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- =============================================

-- Create the drawing_files table
CREATE TABLE IF NOT EXISTS public.drawing_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  size_bytes BIGINT NOT NULL,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_drawing_files_user_id ON public.drawing_files(user_id);

-- Enable Row Level Security
ALTER TABLE public.drawing_files ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own files
CREATE POLICY "Users can view own files"
  ON public.drawing_files
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own files
CREATE POLICY "Users can insert own files"
  ON public.drawing_files
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own files
CREATE POLICY "Users can update own files"
  ON public.drawing_files
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own files
CREATE POLICY "Users can delete own files"
  ON public.drawing_files
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_drawing_files_updated_at ON public.drawing_files;
CREATE TRIGGER set_drawing_files_updated_at
  BEFORE UPDATE ON public.drawing_files
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- STORAGE BUCKET SETUP
-- =============================================
-- This part sets up the storage bucket. Run these in SQL Editor.
-- NOTE: You may need to create the bucket manually in Dashboard → Storage
-- if the below doesn't work due to permissions.

-- Create the 'drawings' bucket (private by default)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'drawings',
  'drawings',
  false,  -- Private bucket (files require signed URLs)
  52428800,  -- 50MB max file size
  ARRAY['application/pdf', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STORAGE ACCESS POLICIES
-- =============================================
-- These policies ensure users can only access their own files in storage.

-- Policy: Users can upload to their own folder
CREATE POLICY "Users can upload to own folder"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'drawings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can view their own files
CREATE POLICY "Users can view own files in storage"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'drawings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can update their own files
CREATE POLICY "Users can update own files in storage"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'drawings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files in storage"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'drawings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
