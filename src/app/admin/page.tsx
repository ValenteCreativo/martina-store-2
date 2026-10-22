'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { artworkService } from '../../lib/services';
import { blogService } from '../../lib/blog';
import ArtworkForm from '../../components/admin/ArtworkForm';
import ArtworkList from '../../components/admin/ArtworkList';
import SalesDashboard from '../../components/admin/SalesDashboard';
import ReservationsDashboard from '../../components/admin/ReservationsDashboard';
import type { Artwork, ArtworkFormData, BlogPost } from '../../types';

export default function AdminPage() {
  const router = useRouter();
  const { ready, authenticated, user, getAccessToken, logout } = usePrivy();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'artworks' | 'tattoos' | 'blog' | 'sales' | 'reservations'>('artworks');

  useEffect(() => {
    if (!ready) return;
    if (!authenticated || !user) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router, ready, authenticated, user]);

  async function loadData() {
    try {
      const [artworksRes, blogsRes] = await Promise.all([
        artworkService.getAll(),
        blogService.getAll(),
      ]);
      setArtworks(artworksRes.data || []);
      setBlogs(blogsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleArtworkSubmit(formData: ArtworkFormData, file: File | null) {
    if (!file) {
      alert('Please select an image');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await artworkService.uploadImage(file, fileName);
      if (uploadError) throw uploadError;

      const imageUrl = uploadData?.publicUrl || '';

      const { error } = await artworkService.create({
        ...formData,
        price: formData.price?.toString(),
        imageUrl,
        thumbnailUrl: imageUrl,
        orderIndex: artworks.length,
      });

      if (error) throw error;
      alert('Artwork added successfully!');
      loadData();
    } catch (error) {
      console.error('Error adding artwork:', error);
      alert('Error adding artwork. Please try again.');
    }
  }

  async function handleArtworkDelete(id: string) {
    try {
      const { error } = await artworkService.delete(id);
      if (error) throw error;
      alert('Artwork deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error deleting artwork:', error);
      alert('Error deleting artwork. Please try again.');
    }
  }

  async function handleBlogDelete(id: string) {
    try {
      const { error } = await blogService.delete(id);
      if (error) throw error;
      alert('Blog post deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Error deleting blog post. Please try again.');
    }
  }

  function handleLogout() {
    logout();
    router.push('/login');
  }

  if (loading || !ready || !authenticated || !user) {
    return (
      <main className="min-h-screen pt-32 flex items-center justify-center sacred-minimal">
        <div className="sacred-dot animate-subtle-glow" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080706] pt-28 pb-16 text-[#e5e5e5]">
      <div className="content-container max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[.32em] text-[#a51f2d]">Administración</p>
            <h1 className="mt-2 text-4xl text-white md:text-5xl">Estudio Martina</h1>
            <p className="mt-2 text-sm text-white/50">Obra, ventas, agenda y contenido en un mismo espacio.</p>
          </div>
          <div className="text-left md:text-right"><p className="text-xs text-white/45">Sesión de Privy</p><button onClick={handleLogout} className="mt-2 text-[10px] uppercase tracking-[.18em] text-[#d8a0a5] hover:text-white">Cerrar sesión</button></div>
        </div>

        <div className="mb-10 flex flex-wrap gap-2 border-b border-white/10 pb-5">
          <button
            onClick={() => setTab('artworks')}
            className={`px-4 py-2 text-[10px] uppercase tracking-[.16em] transition ${tab === 'artworks'
              ? 'border border-[#a51f2d] bg-[#a51f2d]/10 text-white'
              : 'border border-transparent text-white/55 hover:border-white/20 hover:text-white'
              }`}
          >
            Obra
          </button>
          <button
            onClick={() => setTab('tattoos')}
            className={`px-4 py-2 text-[10px] uppercase tracking-[.16em] transition ${tab === 'tattoos'
              ? 'border border-[#a51f2d] bg-[#a51f2d]/10 text-white'
              : 'border border-transparent text-white/55 hover:border-white/20 hover:text-white'
              }`}
          >
            Tattoos
          </button>
          <button
            onClick={() => setTab('blog')}
            className={`px-4 py-2 text-[10px] uppercase tracking-[.16em] transition ${tab === 'blog'
              ? 'border border-[#a51f2d] bg-[#a51f2d]/10 text-white'
              : 'border border-transparent text-white/55 hover:border-white/20 hover:text-white'
              }`}
          >
            Contenido
          </button>
          <button
            onClick={() => setTab('sales')}
            className={`px-4 py-2 text-[10px] uppercase tracking-[.16em] transition ${tab === 'sales'
              ? 'border border-[#a51f2d] bg-[#a51f2d]/10 text-white'
              : 'border border-transparent text-white/55 hover:border-white/20 hover:text-white'
              }`}
          >
            Ventas
          </button>
          <button
            onClick={() => setTab('reservations')}
            className={`px-4 py-2 text-[10px] uppercase tracking-[.16em] transition ${tab === 'reservations'
              ? 'border border-[#a51f2d] bg-[#a51f2d]/10 text-white'
              : 'border border-transparent text-white/55 hover:border-white/20 hover:text-white'
              }`}
          >
            Agenda
          </button>
        </div>

        {tab === 'artworks' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-minimal p-6 rounded-lg sticky top-24">
                <h2 className="text-[10px] uppercase tracking-[.18em] text-[#d8a0a5] mb-6">Agregar obra</h2>
                <ArtworkForm onSubmit={handleArtworkSubmit} />
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-[10px] uppercase tracking-[.18em] text-[#d8a0a5] mb-6">Colección</h2>
              <ArtworkList
                artworks={artworks.filter(a => a.category !== 'tattoo')}
                onDelete={handleArtworkDelete}
              />
            </div>
          </div>
        )}

        {tab === 'tattoos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-minimal p-6 rounded-lg sticky top-24">
                <h2 className="text-[10px] uppercase tracking-[.18em] text-[#d8a0a5] mb-6">Agregar tatuaje</h2>
                <ArtworkForm onSubmit={handleArtworkSubmit} defaultCategory="tattoo" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-[10px] uppercase tracking-[.18em] text-[#d8a0a5] mb-6">Tatuajes</h2>
              <ArtworkList
                artworks={artworks.filter(a => a.category === 'tattoo')}
                onDelete={handleArtworkDelete}
              />
            </div>
          </div>
        )}

        {tab === 'blog' && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <Link href="/admin/blog/new" className="btn-elegant">
                Crear entrada
              </Link>
            </div>
            <div className="space-y-4">
              {blogs.length === 0 ? (
                <div className="text-center py-12 glass-minimal rounded-lg">
                  <p className="text-[#8b7d7b] font-light">
                    No hay entradas todavía. Crea la primera cuando quieras publicarla.
                  </p>
                </div>
              ) : (
                blogs.map((post) => (
                  <div
                    key={post.id}
                    className="glass-minimal p-6 rounded-lg flex items-center justify-between hover-lift"
                  >
                    <div>
                      <h3 className="text-lg font-light mb-1">{post.title}</h3>
                      <p className="text-sm text-[#8b7d7b] font-light">
                        {post.published ? 'Publicado' : 'Borrador'} ·{' '}
                        {new Date(post.createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/admin/blog/${post.id}`} className="btn-elegant text-xs px-4 py-2">
                        Editar
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Delete this post?')) handleBlogDelete(post.id);
                        }}
                        className="px-4 py-2 border border-[#4a3434] text-[#4a3434] hover:bg-[#4a3434]/10 rounded elegant-text text-xs transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'sales' && (
          <div className="max-w-6xl mx-auto">
            <SalesDashboard getAccessToken={getAccessToken} />
          </div>
        )}

        {tab === 'reservations' && (
          <div className="max-w-6xl mx-auto">
            <ReservationsDashboard getAccessToken={getAccessToken} />
          </div>
        )}
      </div>
    </main>
  );
}
