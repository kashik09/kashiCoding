'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { Upload, Crop, X, Check } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'

interface Point {
  x: number
  y: number
}

interface Area {
  x: number
  y: number
  width: number
  height: number
}

interface ImageUploadCropProps {
  onImageCropped: (imageUrl: string) => void
  currentImage?: string
  aspectRatio?: number // 1 for square, 16/9 for landscape, etc.
  label?: string
}

// Helper function to create cropped image
const createCroppedImage = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> => {
  const image = new Image()
  image.src = imageSrc
  await new Promise((resolve) => {
    image.onload = resolve
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!)
    }, 'image/jpeg', 0.95)
  })
}

export function ImageUploadCrop({
  onImageCropped,
  currentImage,
  aspectRatio = 1, // Always square for avatars
  label = 'Upload Image'
}: ImageUploadCropProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Image must be less than 10MB')
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)
        setIsOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleOpenModal = () => {
    fileInputRef.current?.click()
  }

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    setUploading(true)

    try {
      // Create cropped image blob
      const croppedBlob = await createCroppedImage(imageSrc, croppedAreaPixels)

      // Upload to server
      const formData = new FormData()
      formData.append('image', croppedBlob, 'avatar.jpg')

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        onImageCropped(data.url)
        setImageSrc(null)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setIsOpen(false)
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setImageSrc(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setIsOpen(false)
  }

  return (
    <>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>

        {/* Current Image Preview */}
        {currentImage && (
          <div className="relative inline-block">
            <img
              src={currentImage}
              alt="Current avatar"
              className="w-32 h-32 rounded-full object-cover border-2 border-border"
            />
          </div>
        )}

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            <Upload size={18} />
            {currentImage ? 'Change Image' : 'Upload Image'}
          </button>
          <p className="text-xs text-muted-foreground mt-2">
            Max size: 10MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>
      </div>

      {/* Modal */}
      {isOpen && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Crop Image</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Adjust the crop area and zoom to get the perfect image
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-muted rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
              {/* Cropper */}
              <div className="relative w-full h-[500px] bg-background rounded-lg overflow-hidden border border-border">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="round"
                />
              </div>

              {/* Zoom Slider */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Zoom: {zoom.toFixed(1)}x</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-border bg-muted/30">
              <button
                type="button"
                onClick={handleCropSave}
                disabled={uploading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 font-medium"
              >
                {uploading ? (
                  <>
                    <Spinner size="sm" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Save Cropped Image
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={uploading}
                className="flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/70 transition disabled:opacity-50 font-medium"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
