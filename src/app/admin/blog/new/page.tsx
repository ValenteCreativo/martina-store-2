'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { blogService } from '../../../../lib/blog';
import { Upload } from 'lucide-react';
import RichTextEditor from '../../../../components/ui/RichTextEditor';

export default function NewBlogPostPage() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const [accessReady, setAccessReady] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [published, setPublished] = useState(true); // true = publish now, false = save as draft
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!authenticated || !user) {
      router.push('/login');
      return;
    }
    setAccessReady(true);
  }, [router, ready, authenticated, user]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !title || !content) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      let coverImageUrl = '';

      // Upload cover image if provided
      if (coverImage) {
        const { artworkService } = await import('../../../../lib/services');
        const fileExt = coverImage.name.split('.').pop();
        const fileName = `blog-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await artworkService.uploadImage(coverImage, fileName);
        if (uploadError) throw uploadError;

        coverImageUrl = uploadData?.publicUrl || '';
      }

      const slug = blogService.generateSlug(title);
      const postData = {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 200),
        coverImageUrl: coverImageUrl,
        published,
        authorId: user.id,
        publishedAt: published ? new Date() : null,
      };

      const { error } = await blogService.create(postData);
      if (error) throw error;

      alert('Blog post created successfully!');
      router.push('/admin');
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert(`Error creating blog post: ${error}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (!accessReady) {
    return (
      <main className="min-h-screen pt-32 flex items-center justify-center sacred-minimal">
        <div className="sacred-dot animate-subtle-glow" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-16 sacred-minimal">
      <div className="content-container max-w-4xl">
        <div className="mb-12">
          <div className="flex justify-center gap-2 mb-8">
            <div className="sacred-dot animate-subtle-glow" />
            <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '1s' }} />
            <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '2s' }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-2 text-center tracking-wider">New Journal Entry</h1>
          <div className="divider my-8" />
        </div>

        <form onSubmit={handleSubmit} className="glass-minimal p-8 rounded-lg space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="elegant-text text-xs mb-2 block">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 minimal-border rounded bg-transparent text-white font-light focus:border-[#8b7d7b] transition-colors"
              placeholder="Enter post title"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="elegant-text text-xs mb-2 block">
              Excerpt
            </label>
            <input
              id="excerpt"
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-3 minimal-border rounded bg-transparent text-white font-light focus:border-[#8b7d7b] transition-colors"
              placeholder="Brief summary (optional)"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="elegant-text text-xs mb-2 block">
              Content *
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your journal entry here..."
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="elegant-text text-xs mb-2 block">Cover Image</label>
            <div className="minimal-border rounded p-6 text-center">
              {coverImagePreview ? (
                <div className="space-y-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="max-h-64 mx-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage(null);
                      setCoverImagePreview('');
                    }}
                    className="text-xs elegant-text text-[#8b7d7b] hover:text-white transition-colors"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-3 py-8">
                    <Upload size={32} className="text-[#8b7d7b]" />
                    <p className="elegant-text text-xs text-[#8b7d7b]">Click to upload cover image</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Published Toggle — functional draft support */}
          <div className="flex items-center gap-3">
            <input
              id="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 accent-[#8b7d7b] cursor-pointer"
            />
            <label htmlFor="published" className="elegant-text text-xs cursor-pointer text-[#8b7d7b]">
              Publish immediately (uncheck to save as draft)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="flex-1 px-6 py-3 border border-[#8b7d7b]/30 text-[#8b7d7b] hover:bg-[#8b7d7b]/10 rounded elegant-text text-xs transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-elegant"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : published ? 'Publish' : 'Save as Draft'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
