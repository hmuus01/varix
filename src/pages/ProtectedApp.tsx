import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'
import { Container, Card, Button, Spinner, Logo } from '@/components'

interface DrawingFile {
  id: string
  name: string
  storage_path: string
  size_bytes: number
  mime_type: string | null
  created_at: string
}

export default function ProtectedApp() {
  const { user, signOut } = useAuth()
  const [files, setFiles] = useState<DrawingFile[]>([])
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewingFileId, setViewingFileId] = useState<string | null>(null)
  const [viewErrors, setViewErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('drawing_files')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (fetchError) {
        console.error('Error fetching files:', fetchError)
        setError('Failed to load your drawings. Please try again.')
      } else {
        setFiles(data || [])
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please refresh the page.')
    }

    setLoading(false)
  }

  const handleViewFile = async (file: DrawingFile) => {
    // Clear any previous error for this file
    setViewErrors((prev) => {
      const updated = { ...prev }
      delete updated[file.id]
      return updated
    })
    setViewingFileId(file.id)

    // Dev mode logging
    if (import.meta.env.DEV) {
      console.log('Viewing file:', { name: file.name, storage_path: file.storage_path })
    }

    try {
      const { data, error: signedUrlError } = await supabase.storage
        .from('drawings')
        .createSignedUrl(file.storage_path, 600) // 10 minute expiry

      if (signedUrlError) {
        if (import.meta.env.DEV) {
          console.error('createSignedUrl failed:', { error: signedUrlError, storage_path: file.storage_path })
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
        console.error('View file error:', { error: err, storage_path: file.storage_path })
      }
      setViewErrors((prev) => ({ ...prev, [file.id]: message }))
    }

    setViewingFileId(null)
  }

  const handleDeleteFile = async (file: DrawingFile) => {
    if (!confirm(`Delete "${file.name}"? This cannot be undone.`)) return

    setError(null)

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('drawings')
      .remove([file.storage_path])

    if (storageError) {
      console.error('Error deleting from storage:', storageError)
      setError('Failed to delete file. Please try again.')
      return
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('drawing_files')
      .delete()
      .eq('id', file.id)

    if (dbError) {
      console.error('Error deleting from database:', dbError)
      setError('Failed to delete file record. Please try again.')
      return
    }

    // Refresh file list
    setFiles((prev) => prev.filter((f) => f.id !== file.id))
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await signOut()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
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
                className="text-[var(--green)] font-medium text-sm"
              >
                Dashboard
              </Link>
              <Link
                to="/app/upload"
                className="text-slate-600 hover:text-slate-900 font-medium text-sm"
              >
                Upload
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 hidden sm:block">{user?.email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                loading={loggingOut}
              >
                Log out
              </Button>
            </div>
          </nav>
        </Container>
      </header>

      <main className="py-8 sm:py-12">
        <Container>
          {/* Welcome Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Your Drawings
              </h1>
              <p className="text-slate-600 mt-1">
                Manage and compare your uploaded drawing files.
              </p>
            </div>
            <Link to="/app/upload">
              <Button size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Upload drawings
              </Button>
            </Link>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-grow">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* File List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : files.length === 0 ? (
            <Card padding="lg">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  No drawings yet
                </h2>
                <p className="text-slate-600 mb-6">
                  Upload your first drawing to get started with version comparison.
                </p>
                <Link to="/app/upload">
                  <Button>Upload your first drawing</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 hidden sm:table-cell">
                        Size
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 hidden md:table-cell">
                        Uploaded
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              {file.mime_type?.includes('pdf') ? (
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 15a.5.5 0 0 1 0-1h2a.5.5 0 0 1 0 1h-2zm0 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zm0 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5z"/>
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                              )}
                            </div>
                            <span className="font-medium text-slate-900 truncate max-w-[200px] sm:max-w-none">
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 hidden sm:table-cell">
                          {formatFileSize(file.size_bytes)}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 hidden md:table-cell">
                          {formatDate(file.created_at)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
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
                              <button
                                onClick={() => handleDeleteFile(file)}
                                className="text-sm font-medium text-red-600 hover:text-red-700 px-2 py-1"
                              >
                                Delete
                              </button>
                            </div>
                            {viewErrors[file.id] && (
                              <span className="text-xs text-red-600 max-w-[200px] truncate" title={viewErrors[file.id]}>
                                View failed: {viewErrors[file.id]}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Quick Tips Section */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick tips</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-[var(--green)] font-semibold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">Upload PDFs or images</p>
                  <p className="text-xs text-slate-500 mt-0.5">We support PDF, PNG, and JPG</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-[var(--green)] font-semibold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">Review highlighted changes</p>
                  <p className="text-xs text-slate-500 mt-0.5">Every difference is marked</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-[var(--green)] font-semibold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">Export your report</p>
                  <p className="text-xs text-slate-500 mt-0.5">PDF or Excel format</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
