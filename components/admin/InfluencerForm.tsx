'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Influencer } from '@/types'

const influencerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  handle: z.string().min(1, 'Handle is required').max(100),
  bio: z.string().max(500).optional(),
  hashtags: z.string().optional(),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

type FormFields = z.infer<typeof influencerSchema>

interface Props {
  influencer: Influencer | null
  onSave: (saved: Influencer) => void
  onCancel: () => void
}

type StorageBadge = 's3' | 'supabase' | null

// ── XHR upload with real progress ────────────────────────────────────────────

function xhrUpload(
  file: File,
  endpoint: string,
  onProgress: (pct: number) => void
): Promise<{ url: string; storage: 's3' | 'supabase' }> {
  return new Promise((resolve, reject) => {
    const fd = new FormData()
    fd.append('file', file)

    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 95)) // cap at 95 until server responds
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText) as {
            success: boolean
            url?: string
            storage?: 's3' | 'supabase'
            error?: string
          }
          if (json.success && json.url) {
            onProgress(100)
            resolve({ url: json.url, storage: json.storage ?? 'supabase' })
          } else {
            reject(new Error(json.error ?? 'Upload failed'))
          }
        } catch {
          reject(new Error('Invalid server response'))
        }
      } else {
        reject(new Error(`Upload failed (HTTP ${xhr.status})`))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.open('POST', endpoint)
    // Cookies sent automatically (same-origin)
    xhr.send(fd)
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function InfluencerForm({ influencer, onSave, onCancel }: Props) {
  const isEdit = !!influencer

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>(influencer?.photo_url ?? '')
  const [videoPreview, setVideoPreview] = useState<string>(influencer?.video_url ?? '')

  const [photoProgress, setPhotoProgress] = useState(0)
  const [videoProgress, setVideoProgress] = useState(0)
  const [photoStorage, setPhotoStorage] = useState<StorageBadge>(null)
  const [videoStorage, setVideoStorage] = useState<StorageBadge>(null)

  const [saving, setSaving] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'uploading' | 'saving'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [largeFileWarning, setLargeFileWarning] = useState(false)

  const photoInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(influencerSchema),
    defaultValues: {
      name: influencer?.name ?? '',
      handle: influencer?.handle?.replace(/^@/, '') ?? '',
      bio: influencer?.bio ?? '',
      hashtags: (influencer?.hashtags ?? []).join(', '),
      display_order: influencer?.display_order ?? 0,
      is_active: influencer?.is_active ?? true,
    },
  })

  const handlePhotoChange = (file: File | null) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be under 5 MB.')
      return
    }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setPhotoStorage(null)
    setPhotoProgress(0)
    setError(null)
  }

  const handleVideoChange = (file: File | null) => {
    if (!file) return
    if (file.size > 500 * 1024 * 1024) {
      setError('Video must be under 500 MB.')
      return
    }
    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
    setVideoStorage(null)
    setVideoProgress(0)
    setLargeFileWarning(file.size > 100 * 1024 * 1024)
    setError(null)
  }

  const onSubmit = async (data: FormFields) => {
    setSaving(true)
    setError(null)

    try {
      let photoUrl = influencer?.photo_url ?? ''
      let videoUrl = influencer?.video_url ?? ''

      // ── Phase 1: upload files (XHR with real progress) ──────────────────────
      if (photoFile || videoFile) {
        setPhase('uploading')

        if (photoFile) {
          const result = await xhrUpload(photoFile, '/api/admin/upload/photo', setPhotoProgress)
          photoUrl = result.url
          setPhotoStorage(result.storage)
        }

        if (videoFile) {
          const result = await xhrUpload(videoFile, '/api/admin/upload/video', setVideoProgress)
          videoUrl = result.url
          setVideoStorage(result.storage)
        }
      }

      if (!photoUrl || !videoUrl) {
        throw new Error('Photo and video are required.')
      }

      // ── Phase 2: save influencer record ─────────────────────────────────────
      setPhase('saving')

      const handle = data.handle.startsWith('@') ? data.handle : `@${data.handle}`
      const hashtags = data.hashtags
        ? data.hashtags.split(',').map((t) => t.trim()).filter(Boolean)
        : []

      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('handle', handle)
      formData.append('bio', data.bio ?? '')
      formData.append('hashtags', hashtags.join(','))
      formData.append('display_order', String(data.display_order))
      formData.append('is_active', String(data.is_active))
      formData.append('photo_url', photoUrl)
      formData.append('video_url', videoUrl)
      // No file blobs — already uploaded above

      const endpoint = isEdit ? `/api/admin/influencers/${influencer.id}` : '/api/admin/influencers'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(endpoint, { method, body: formData })
      const json = (await res.json()) as { success: boolean; data?: Influencer; error?: string }

      if (!json.success || !json.data) {
        throw new Error(json.error ?? 'Unknown error')
      }

      onSave(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving changes.')
      setPhase('idle')
    } finally {
      setSaving(false)
    }
  }

  const isBusy = saving

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Creator' : 'Add New Creator'}
          </h2>
          <button
            onClick={onCancel}
            disabled={isBusy}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Phase indicator */}
          {isBusy && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm flex items-center gap-2">
              <svg className="animate-spin w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {phase === 'uploading' ? 'Uploading media files…' : 'Saving creator…'}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                disabled={isBusy}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-weleda-green focus:ring-1 focus:ring-weleda-green disabled:opacity-60"
                placeholder="Influencer name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Handle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Handle <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                <input
                  {...register('handle')}
                  disabled={isBusy}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-weleda-green focus:ring-1 focus:ring-weleda-green disabled:opacity-60"
                  placeholder="username"
                />
              </div>
              {errors.handle && <p className="text-red-500 text-xs mt-1">{errors.handle.message}</p>}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea
              {...register('bio')}
              rows={3}
              disabled={isBusy}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-weleda-green focus:ring-1 focus:ring-weleda-green resize-none disabled:opacity-60"
              placeholder="Short description..."
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Hashtags{' '}
              <span className="text-gray-400 font-normal">(comma-separated)</span>
            </label>
            <input
              {...register('hashtags')}
              disabled={isBusy}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-weleda-green focus:ring-1 focus:ring-weleda-green disabled:opacity-60"
              placeholder="#NaturalBeauty, #WELEDALove"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Display order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
              <input
                {...register('display_order', { valueAsNumber: true })}
                type="number"
                min={0}
                disabled={isBusy}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-weleda-green focus:ring-1 focus:ring-weleda-green disabled:opacity-60"
              />
            </div>

            {/* Active toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <label className="flex items-center gap-3 mt-2.5 cursor-pointer">
                <input {...register('is_active')} type="checkbox" disabled={isBusy} className="w-4 h-4 accent-weleda-green" />
                <span className="text-sm text-gray-600">Active / visible</span>
              </label>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Profile Photo {!isEdit && <span className="text-red-500">*</span>}
              </label>
              {photoStorage && (
                <StoragePill storage={photoStorage} />
              )}
            </div>
            <div
              onClick={() => !isBusy && photoInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (!isBusy) handlePhotoChange(e.dataTransfer.files[0] ?? null)
              }}
              className={`border-2 border-dashed rounded-xl p-4 flex items-center gap-4 transition-colors ${
                isBusy ? 'opacity-60 cursor-not-allowed border-gray-200' : 'cursor-pointer hover:border-weleda-green border-gray-200'
              }`}
            >
              {photoPreview ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">
                  {photoFile ? photoFile.name : 'Upload photo'}
                </p>
                <p className="text-xs text-gray-400">JPG, PNG, WebP · max. 5 MB</p>
                {photoProgress > 0 && photoProgress < 100 && (
                  <ProgressBar pct={photoProgress} className="mt-2" />
                )}
              </div>
            </div>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Video Upload */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Video {!isEdit && <span className="text-red-500">*</span>}
              </label>
              {videoStorage && (
                <StoragePill storage={videoStorage} />
              )}
            </div>

            {largeFileWarning && (
              <p className="text-amber-600 text-xs mb-1.5 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                Large file (&gt;100 MB) — upload may take a while.
              </p>
            )}

            <div
              onClick={() => !isBusy && videoInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (!isBusy) handleVideoChange(e.dataTransfer.files[0] ?? null)
              }}
              className={`border-2 border-dashed rounded-xl p-4 transition-colors ${
                isBusy ? 'opacity-60 cursor-not-allowed border-gray-200' : 'cursor-pointer hover:border-weleda-green border-gray-200'
              }`}
            >
              {videoPreview && videoFile ? (
                <div className="space-y-2">
                  <video src={videoPreview} className="w-full max-h-32 rounded-lg object-cover" />
                  <p className="text-xs text-gray-500">{videoFile.name}</p>
                </div>
              ) : videoPreview ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-weleda-green" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Video exists · Click to replace</span>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4 text-center">
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700">Upload video</p>
                  <p className="text-xs text-gray-400">MP4, MOV, WebM · max. 500 MB</p>
                </div>
              )}
              {videoProgress > 0 && videoProgress < 100 && (
                <ProgressBar pct={videoProgress} className="mt-2" />
              )}
            </div>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
              onChange={(e) => handleVideoChange(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isBusy}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="flex-1 py-3 rounded-xl text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: '#0b4535' }}
            >
              {isBusy ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {phase === 'uploading' ? 'Uploading…' : 'Saving…'}
                </>
              ) : (
                isEdit ? 'Save Changes' : 'Add Creator'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ProgressBar({ pct, className = '' }: { pct: number; className?: string }) {
  return (
    <div className={`h-1.5 rounded-full bg-gray-200 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-weleda-green transition-all duration-200"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function StoragePill({ storage }: { storage: 's3' | 'supabase' }) {
  const isS3 = storage === 's3'
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        isS3
          ? 'bg-amber-50 text-amber-700 border border-amber-200'
          : 'bg-blue-50 text-blue-700 border border-blue-200'
      }`}
    >
      {isS3 ? 'AWS S3' : 'Supabase'}
    </span>
  )
}
