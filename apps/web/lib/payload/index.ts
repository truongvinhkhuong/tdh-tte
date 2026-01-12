/**
 * Payload CMS Integration
 * 
 * Re-exports all data fetching utilities.
 * Import from '@/lib/payload' for CMS integration.
 */

// Direct CMS client (for when you need full control)
export * as payloadClient from './client';

// Data adapter (CMS with static fallback - recommended for most uses)
export * from './adapter';
