import { useState, useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Button, Card, CardBody, Spinner, Logo } from '@/components'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

interface UploadedFile {
  id: string
  name: string
  path: string
  size: number
  uploaded_at: string
}

export default function Upload() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [recentUploads, setRecentUploads] = useState<UploadedFile[]>([])
  const [viewingFileId, setViewingFileId] = useState<string | null>(null)
  const [viewErrors, setViewErrors] = useState<Record<string, string>>({})

  // Generate storage path: {user_id}/{yyyy-mm}/{timestamp}_{originalName}
  const generateStoragePath = (fileName: string): string => {
    const now = new Date()
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const timestamp = now.getTime()
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    return `${user!.id}/${yearMonth}/${timestamp}_${sanitizedName}`
  }

  const uploadFile = async (file: File) => {
    if (!user) return

    const path = generateStoragePath(file.name)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('drawings')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    // Insert record into drawing_files table
    const { data: insertData, error: insertError } = await supabase
      .from('drawing_files')
      .insert({
        user_id: user.id,
        name: file.name,
        storage_path: path,
        size_bytes: file.size,
        mime_type: file.type,
      })
      .select()
      .single()

    if (insertError) {
      // If DB insert fails, try to clean up the uploaded file
      await supabase.storage.from('drawings').remove([path])
      throw new Error(insertError.message)
    }

    return insertData
  }

  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)

    // Filter by file type
    const validTypeFiles = fileArray.filter((file) => {
      const ext = file.name.toLowerCase()
      return ext.endsWith('.pdf') || ext.endsWith('.png') || ext.endsWith('.jpg') || ext.endsWith('.jpeg')
    })

    if (validTypeFiles.length === 0) {
      setError('Please upload PDF, PNG, or JPG files only.')
      return
    }

    // Check file sizes
    const oversizedFiles = validTypeFiles.filter((file) => file.size > MAX_FILE_SIZE)
    if (oversizedFiles.length > 0) {
      const names = oversizedFiles.map((f) => f.name).join(', ')
      setError(`Files exceed 50MB limit: ${names}`)
      return
    }

    const validFiles = validTypeFiles

    setError(null)
    setUploading(true)
    setUploadProgress(`Uploading 0/${validFiles.length}...`)

    const uploaded: UploadedFile[] = []

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i]
      setUploadProgress(`Uploading ${i + 1}/${validFiles.length}: ${file.name}`)

      try {
        const result = await uploadFile(file)
        if (result) {
          uploaded.push({
            id: result.id,
            name: result.name,
            path: result.storage_path,
            size: result.size_bytes,
            uploaded_at: result.created_at,
          })
        }
      } catch (err) {
        console.error('Upload error:', err)
        setError(`Failed to upload ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    setRecentUploads((prev) => [...uploaded, ...prev])
    setUploading(false)
    setUploadProgress('')
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleViewFile = async (file: UploadedFile) => {
    // Clear any previous error for this file
    setViewErrors((prev) => {
      const updated = { ...prev }
      delete updated[file.id]
      return updated
    })
    setViewingFileId(file.id)

    // Dev mode logging
    if (import.meta.env.DEV) {
      console.log('Viewing file:', { name: file.name, storage_path: file.path })
    }

    try {
      const { data, error: signedUrlError } = await supabase.storage
        .from('drawings')
        .createSignedUrl(file.path, 600) // 10 minute expiry

      if (signedUrlError) {
        if (import.meta.env.DEV) {
          console.error('createSignedUrl failed:', { error: signedUrlError, storage_path: file.path })
        }
        setViewErrors((prev) => ({ ...prev, [file.id]: signedUrlError.message }))
        setViewingFileId(null)
        return
      }

      // Handle both possible property names (signedUrl vs signedURL)
      const signedUrl = (data as { signedUrl?: string; signedURL?: string })?.signedUrl ??
                        (data as { signedUrl?: string; signedURL?: string })?.signedURL

      if (!signedUrl) {
        setViewErrors((prev) => ({ ...prev, [file.id]: 'No signed URL returned' }))
        setViewingFileId(null)
        return
      }

      // Use anchor element approach (more reliable than window.open with noopener)
      const link = document.createElement('a')
      link.href = signedUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (import.meta.env.DEV) {
        console.error('View file error:', { error: err, storage_path: file.path })
      }
      setViewErrors((prev) => ({ ...prev, [file.id]: message }))
    }

    setViewingFileId(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* App Header */}
      <header className="bg-white border-b border-slate-200">
        <Container>
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Logo />
              <Link
                to="/app"
                className="text-slate-600 hover:text-slate-900 font-medium text-sm"
              >
                Dashboard
              </Link>
              <Link
                to="/app/upload"
                className="text-[var(--green)] font-medium text-sm"
              >
                Upload
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Log out
              </Button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Main Content */}
      <Container size="md" className="py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Upload Drawings</h1>
          <p className="mt-2 text-slate-600">
            Upload your construction drawings to compare revisions.
          </p>
        </div>

        {/* Upload Zone */}
        <Card className="mb-8">
          <CardBody padding="lg">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
                ${isDragging
                  ? 'border-[var(--green)] bg-green-50'
                  : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                }
                ${uploading ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
              />

              {uploading ? (
                <div className="flex flex-col items-center gap-4">
                  <Spinner size="lg" />
                  <p className="text-slate-600 font-medium">{uploadProgress}</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-slate-900 mb-1">
                    {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                  </p>
                  <p className="text-slate-500 mb-4">or click to browse</p>
                  <p className="text-sm text-slate-400">
                    Supports PDF, PNG, JPG (max 50MB each)
                  </p>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Recent Uploads */}
        {recentUploads.length > 0 && (
          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Recently Uploaded
              </h2>
              <ul className="divide-y divide-slate-100">
                {recentUploads.map((file) => (
                  <li key={file.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{file.name}</p>
                        <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                        {viewErrors[file.id] && (
                          <p className="text-xs text-red-600 mt-0.5">View failed: {viewErrors[file.id]}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-green-600 font-medium">Uploaded</span>
                      <button
                        onClick={() => handleViewFile(file)}
                        disabled={viewingFileId === file.id}
                        className="text-sm font-medium text-[var(--green)] hover:text-[var(--green-dark)] disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 flex items-center gap-1"
                      >
                        {viewingFileId === file.id ? (
                          <>
                            <Spinner size="sm" />
                            <span>Opening...</span>
                          </>
                        ) : (
                          'View'
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}
      </Container>
    </div>
  )
}
