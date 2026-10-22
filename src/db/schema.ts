import { pgTable, uuid, varchar, text, integer, boolean, timestamp, decimal } from 'drizzle-orm/pg-core';

// Users table - Admin users with password hashes
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }),
    isAdmin: boolean('is_admin').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

// Categories table - Artwork categories with ordering
export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    description: text('description'),
    orderIndex: integer('order_index').default(0),
});

// Artworks table - Portfolio pieces with images, pricing, and metadata
export const artworks = pgTable('artworks', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    imageUrl: text('image_url').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    category: varchar('category', { length: 255 }).notNull(),
    year: integer('year'),
    medium: varchar('medium', { length: 255 }),
    technique: varchar('technique', { length: 255 }),
    dimensions: varchar('dimensions', { length: 255 }),
    price: decimal('price', { precision: 10, scale: 2 }),
    available: boolean('available').default(true),
    featured: boolean('featured').default(false),
    orderIndex: integer('order_index').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Blog posts table - Blog content with publishing workflow
export const blogPosts = pgTable('blog_posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    content: text('content').notNull(),
    excerpt: text('excerpt'),
    coverImageUrl: text('cover_image_url'),
    published: boolean('published').default(false),
    authorId: uuid('author_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    publishedAt: timestamp('published_at'),
});

// Legacy wallet purchasers retained only for historical order records.
export const walletUsers = pgTable('wallet_users', {
    id: uuid('id').primaryKey().defaultRandom(),
    privyId: varchar('privy_id', { length: 255 }).unique().notNull(),
    walletAddress: varchar('wallet_address', { length: 42 }),
    email: varchar('email', { length: 255 }),
    isWhitelisted: boolean('is_whitelisted').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Shipping addresses for physical artwork delivery
export const shippingAddresses = pgTable('shipping_addresses', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => walletUsers.id),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    address: text('address').notNull(),
    city: varchar('city', { length: 255 }).notNull(),
    state: varchar('state', { length: 255 }),
    postalCode: varchar('postal_code', { length: 50 }).notNull(),
    country: varchar('country', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    isDefault: boolean('is_default').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

// Crypto orders - Tracks stablecoin payments and NFT certificates
export const cryptoOrders = pgTable('crypto_orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    artworkId: uuid('artwork_id').references(() => artworks.id),
    buyerId: uuid('buyer_id').references(() => walletUsers.id),
    shippingAddressId: uuid('shipping_address_id').references(() => shippingAddresses.id),

    // Payment details
    txHash: varchar('tx_hash', { length: 66 }),
    chainId: integer('chain_id').notNull(),
    tokenAddress: varchar('token_address', { length: 42 }).notNull(),
    amount: decimal('amount', { precision: 18, scale: 6 }).notNull(),
    amountUsd: decimal('amount_usd', { precision: 10, scale: 2 }).notNull(),

    // NFT Certificate of Authenticity
    nftTokenId: varchar('nft_token_id', { length: 78 }),
    nftContractAddress: varchar('nft_contract_address', { length: 42 }),
    nftTxHash: varchar('nft_tx_hash', { length: 66 }),

    // Order status: pending, paid, shipped, delivered
    status: varchar('status', { length: 50 }).default('pending'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// MercadoPago orders — Tracks card/transfer payments via MercadoPago
export const mercadoPagoOrders = pgTable('mercadopago_orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    artworkId: uuid('artwork_id').references(() => artworks.id),

    // MercadoPago data
    preferenceId: varchar('preference_id', { length: 255 }),
    paymentId: varchar('payment_id', { length: 255 }),
    externalReference: varchar('external_reference', { length: 255 }),

    // Buyer info (from MercadoPago callback or webhook)
    buyerEmail: varchar('buyer_email', { length: 255 }),
    buyerName: varchar('buyer_name', { length: 255 }),

    // Amount
    amountArs: decimal('amount_ars', { precision: 12, scale: 2 }),
    amountUsd: decimal('amount_usd', { precision: 10, scale: 2 }),

    // Order status: pending, approved, rejected, cancelled
    status: varchar('status', { length: 50 }).default('pending'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Reservations — Tattoo appointment booking
export const reservations = pgTable('reservations', {
    id: uuid('id').primaryKey().defaultRandom(),

    // Client info
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    instagram: varchar('instagram', { length: 255 }),

    // Session details
    sessionType: varchar('session_type', { length: 100 }).notNull(), // 'tattoo' | 'consultation'
    description: text('description').notNull(),
    placement: varchar('placement', { length: 255 }),   // body placement
    sizeApprox: varchar('size_approx', { length: 100 }), // small / medium / large

    // References / inspiration
    referenceImageUrl: text('reference_image_url'),
    additionalNotes: text('additional_notes'),

    // Preferred date/time (informational — Martina confirms)
    preferredDate: varchar('preferred_date', { length: 100 }),
    preferredTime: varchar('preferred_time', { length: 100 }),

    // Appointment set by Martina from the admin agenda
    scheduledAt: timestamp('scheduled_at'),
    durationMinutes: integer('duration_minutes').default(120),

    // Status: pending, contacted, confirmed, completed, cancelled
    status: varchar('status', { length: 50 }).default('pending'),

    // Admin notes
    adminNotes: text('admin_notes'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Availability blocks are managed by Martina and sit alongside confirmed sessions.
export const availabilitySlots = pgTable('availability_slots', {
    id: uuid('id').primaryKey().defaultRandom(),
    startsAt: timestamp('starts_at').notNull(),
    endsAt: timestamp('ends_at').notNull(),
    note: varchar('note', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
});

// Type exports for use in application code
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Artwork = typeof artworks.$inferSelect;
export type NewArtwork = typeof artworks.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type WalletUser = typeof walletUsers.$inferSelect;
export type NewWalletUser = typeof walletUsers.$inferInsert;

export type ShippingAddress = typeof shippingAddresses.$inferSelect;
export type NewShippingAddress = typeof shippingAddresses.$inferInsert;

export type CryptoOrder = typeof cryptoOrders.$inferSelect;
export type NewCryptoOrder = typeof cryptoOrders.$inferInsert;

export type MercadoPagoOrder = typeof mercadoPagoOrders.$inferSelect;
export type NewMercadoPagoOrder = typeof mercadoPagoOrders.$inferInsert;

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
export type AvailabilitySlot = typeof availabilitySlots.$inferSelect;
export type NewAvailabilitySlot = typeof availabilitySlots.$inferInsert;
