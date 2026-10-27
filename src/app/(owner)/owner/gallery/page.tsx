'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DEMO_SALONS } from '@/lib/demo-data';
import { getLimit } from '@/features/billing/plans';
import { Plus, Trash2, Upload, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerGalleryPage() {
  const salon = DEMO_SALONS[0];
  const [images, setImages] = React.useState<string[]>(salon.galleryImages);

  const maxGalleryLimit = getLimit(salon, 'maxGalleryImages');
  const isAtLimit = images.length >= maxGalleryLimit;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isAtLimit) {
        toast.error(`You have reached the ${maxGalleryLimit} photos limit. Upgrade to Pro to upload up to 30 photos.`);
        return;
      }
      const fakeUrl = URL.createObjectURL(file);
      setImages([...images, fakeUrl]);
      toast.success('Photo uploaded to gallery');
    }
  };

  const handleDelete = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    toast.success('Photo removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">Gallery Showcase</h1>
          <p className="text-xs text-muted">
            Showcase your salon interior, styling stations, and aesthetic treatments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted">
            {images.length} / {maxGalleryLimit} photos uploaded
          </span>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <span className="inline-flex items-center justify-center font-medium rounded-2xl bg-primary text-white text-sm h-10 px-5 gap-2 shadow-glow-sm hover:bg-primary-hover">
              <Upload className="w-4 h-4" /> Upload Photo
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="group relative h-48 rounded-2xl overflow-hidden border border-muted-border bg-white shadow-subtle"
          >
            <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => handleDelete(idx)}
              className="absolute top-2 right-2 p-1.5 rounded-xl bg-white/90 text-ruby-600 hover:bg-ruby-50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
