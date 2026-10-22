'use server';

import { db, artworks, categories, blogPosts } from '../db';
import { eq, asc, desc } from 'drizzle-orm';
import { put, del } from '@vercel/blob';
import type { NewArtwork, NewCategory, NewBlogPost } from '../db/schema';
import { assertServerAdmin } from '../lib/admin-auth';

// --- Artwork Actions ---

export async function getAllArtworks(featured?: boolean) {
    try {
        if (featured !== undefined) {
            const data = await db.select().from(artworks).where(eq(artworks.featured, featured)).orderBy(asc(artworks.orderIndex));
            return { data, error: null };
        }
        const data = await db.select().from(artworks).orderBy(asc(artworks.orderIndex));
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getArtworkById(id: string) {
    try {
        const [data] = await db.select().from(artworks).where(eq(artworks.id, id));
        return { data: data || null, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getArtworksByCategory(category: string) {
    try {
        const data = await db.select().from(artworks).where(eq(artworks.category, category)).orderBy(asc(artworks.orderIndex));
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function createArtwork(artwork: NewArtwork) {
    try {
        await assertServerAdmin();
        const [data] = await db.insert(artworks).values(artwork).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function updateArtwork(id: string, artwork: Partial<NewArtwork>) {
    try {
        await assertServerAdmin();
        const [data] = await db.update(artworks).set({ ...artwork, updatedAt: new Date() }).where(eq(artworks.id, id)).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function deleteArtwork(id: string) {
    try {
        await assertServerAdmin();
        await db.delete(artworks).where(eq(artworks.id, id));
        return { error: null };
    } catch (error) {
        return { error };
    }
}

// --- Category Actions ---

export async function getAllCategories() {
    try {
        const data = await db.select().from(categories).orderBy(asc(categories.orderIndex));
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function createCategory(category: NewCategory) {
    try {
        await assertServerAdmin();
        const [data] = await db.insert(categories).values(category).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function updateCategory(id: string, category: Partial<NewCategory>) {
    try {
        await assertServerAdmin();
        const [data] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function deleteCategory(id: string) {
    try {
        await assertServerAdmin();
        await db.delete(categories).where(eq(categories.id, id));
        return { error: null };
    } catch (error) {
        return { error };
    }
}

// --- Blog Post Actions ---

export async function getAllBlogPosts(published?: boolean) {
    try {
        if (published !== undefined) {
            const data = await db.select().from(blogPosts).where(eq(blogPosts.published, published)).orderBy(desc(blogPosts.createdAt));
            return { data, error: null };
        }
        const data = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getBlogPostBySlug(slug: string) {
    try {
        const [data] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
        return { data: data || null, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getBlogPostById(id: string) {
    try {
        const [data] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
        return { data: data || null, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function createBlogPost(post: Omit<NewBlogPost, 'authorId'>) {
    try {
        const admin = await assertServerAdmin();
        const [data] = await db.insert(blogPosts).values({ ...post, authorId: admin.userId }).returning();
        return { data, error: null };
    } catch (error) {
        console.error('Create Blog Post Error:', error);
        return { data: null, error: (error as Error).message };
    }
}

export async function updateBlogPost(id: string, post: Partial<NewBlogPost>) {
    try {
        await assertServerAdmin();
        const [data] = await db.update(blogPosts).set({ ...post, updatedAt: new Date() }).where(eq(blogPosts.id, id)).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function deleteBlogPost(id: string) {
    try {
        await assertServerAdmin();
        await db.delete(blogPosts).where(eq(blogPosts.id, id));
        return { error: null };
    } catch (error) {
        return { error };
    }
}

// --- File Storage Actions ---

export async function uploadFile(file: File, pathname: string) {
    try {
        await assertServerAdmin();
        const blob = await put(pathname, file, { access: 'public' });
        return { url: blob.url, error: null };
    } catch (error) {
        return { url: null, error };
    }
}

export async function deleteFile(url: string) {
    try {
        await assertServerAdmin();
        await del(url);
        return { error: null };
    } catch (error) {
        return { error };
    }
}
