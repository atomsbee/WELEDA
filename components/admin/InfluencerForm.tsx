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

interface UploadProgress {
  photo: number
  video: number
}

export default function InfluencerForm({ influencer, onSave, onCancel }: Props) {
  const isEdit = !!influencer
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>(influencer?.photo_url ?? '')
  const [videoPreview, setVideoPreview] = useState<string>(influencer?.video_url ?? '')
  const [progress, setProgress] = useState<UploadProgress>({ photo: 0, video: 0 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    const url = URL.createObjectURL(file)
    setPhotoPreview(url)
    setError(null)
  }

  const handleVideoChange = (file: File | null) => {
    if (!file) return
    if (file.size > 200 * 1024 * 1024) {
      setError('Video must be under 200 MB.')
      return
    }
    setVideoFile(file)
    const url = URL.createObjectURL(file)
    setVideoPreview(url)
    setError(null)
  }

  const onSubmit = async (data: FormFields) => {
    setSaving(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('handle', data.handle.startsWith('@') ? data.handle : `@${data.handle}`)
      formData.append('bio', data.bio ?? '')
      formData.append('hashtags', data.hashtags ?? '')
      formData.append('display_order', String(data.display_order))
      formData.append('is_active', String(data.is_active))

      if (photoFile) {
        formData.append('photo', photoFile)
      } else if (influencer?.photo_url) {
        formData.append('photo_url', influencer.photo_url)
      }

      if (videoFile) {
        formData.append('video', videoFile)
      } else if (influencer?.video_url) {
        formData.append('video_url', influencer.video_url)
      }

      const url = isEdit
        ? `/api/admin/influencers/${influencer.id}`
        : '/api/admin/influencers'
      const method = isEdit ? 'PUT' : 'POST'

      // Simulate upload progress for large files
      if (videoFile) {
        const interval = setInterval(() => {
          setProgress((p) => ({ ...p, video: Math.min(p.video + 10, 90) }))
        }, 300)
        setTimeout(() => clearInterval(interval), 3000)
      }

      const res = await fetch(url, { method, body: formData })
      const json = (await res.json()) as { success: boolean; data?: Influencer; error?: string }

      if (!json.success || !json.data) {
        throw new Error(json.error ?? 'Unknown error')
      }

      setProgress({ photo: 100, video: 100 })
      onSave(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Creator' : 'Add New Creator'}
          </h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-weleda-green focus:ring-1 focus:ring-weleda-green"
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
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-weleda-green focus:ring-1 focus:ring-weleda-green"
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
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-weleda-green focus:ring-1 focus:ring-weleda-green resize-none"
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
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-weleda-green focus:ring-1 focus:ring-weleda-green"
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
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-weleda-green focus:ring-1 focus:ring-weleda-green"
              />
            </div>

            {/* Active toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <label className="flex items-center gap-3 mt-2.5 cursor-pointer">
                <input {...register('is_active')} type="checkbox" className="w-4 h-4 accent-weleda-green" />
                <span className="text-sm text-gray-600">Active / visible</span>
              </label>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Profile Photo {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <div
              onClick={() => photoInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const file = e.dataTransfer.files[0]
                if (file) handlePhotoChange(file)
              }}
              className="border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-weleda-green transition-colors flex items-center gap-4"
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
              <div>
                <p className="text-sm font-medium text-gray-700">Upload photo</p>
                <p className="text-xs text-gray-400">JPG, PNG, WebP · max. 5 MB</p>
                {progress.photo > 0 && progress.photo < 100 && (
                  <div className="mt-2 h-1.5 rounded-full bg-gray-200 w-32">
                    <div className="h-full rounded-full bg-weleda-green" style={{ width: `${progress.photo}%` }} />
                  </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Video {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <div
              onClick={() => videoInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const file = e.dataTransfer.files[0]
                if (file) handleVideoChange(file)
              }}
              className="border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-weleda-green transition-colors"
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
                  <p className="text-xs text-gray-400">MP4, MOV, WebM · max. 200 MB</p>
                </div>
              )}
              {progress.video > 0 && progress.video < 100 && (
                <div className="mt-2 h-1.5 rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-weleda-green transition-all" style={{ width: `${progress.video}%` }} />
                </div>
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
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: '#0b4535' }}
            >
              {saving ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
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
