'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { blogService } from '../../lib/blog';
import type { BlogPost } from '../../types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const { data, error } = await blogService.getAll(true);
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading journal:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-16 bg-[#050505] text-[#e5e5e5]">
      <div className="content-container max-w-4xl"> {/* Reduced width for reading focus */}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <div className="mb-24 text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-2 tracking-[0.2em] uppercase text-white">Bitácora</h1>
            <div className="w-px h-12 bg-gradient-to-b from-[#8a1c1c] to-transparent mx-auto mt-8 opacity-50" />
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#9a9a9a] font-light italic">The pages are blank.</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-16">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group flex flex-col md:flex-row gap-8 items-start md:items-center p-8 border border-transparent hover:border-[#1a1a1a] transition-all duration-500 rounded-sm bg-gradient-to-r from-transparent to-transparent hover:to-[#0a0a0a]">

                    {/* Small Elegant Image Thumbnail */}
                    <div className="flex-shrink-0 w-full md:w-32 h-32 relative overflow-hidden bg-[#0a0a0a] border border-[#1a1a1a] group-hover:border-[#8a1c1c]/30 transition-colors">
                      {post.coverImageUrl ? (
                        <Image
                          src={post.coverImageUrl}
                          alt={post.title}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#111]">
                          <div className="w-1 h-1 bg-[#8a1c1c] opacity-50" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] text-[#8a1c1c] tracking-widest uppercase">{new Date(post.createdAt!).toLocaleDateString()}</span>
                        <span className="h-px w-8 bg-[#1a1a1a]" />
                      </div>

                      <h2 className="text-2xl font-light mb-3 tracking-wide text-[#e5e5e5] group-hover:text-white transition-colors">{post.title}</h2>

                      <p className="text-sm text-[#c8bfba] leading-relaxed line-clamp-2 md:line-clamp-2 font-light">
                        {post.excerpt || 'Leer la entrada completa…'}
                      </p>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="hidden md:block text-[#9a9a9a] group-hover:text-[#8a1c1c] transition-colors transform group-hover:translate-x-2 duration-500">
                      →
                    </div>

                  </Link>

                  {/* Divider */}
                  {index !== posts.length - 1 && (
                    <div className="w-full h-px bg-[#1a1a1a] mt-16 opacity-50" />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
