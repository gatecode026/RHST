import { revalidatePath } from 'next/cache';

type Handler = (request: Request) => Promise<Response>;

/**
 * Wraps an admin mutation route handler so that a successful change
 * (products, categories, blogs) refreshes the cached home page on its next visit.
 * The home page is statically cached (ISR), so without this, edits would only
 * appear after the revalidate window expires.
 */
export function withHomeRevalidate(handler: Handler): Handler {
  return async (request: Request) => {
    const response = await handler(request);
    if (response.ok) {
      try {
        revalidatePath('/');
      } catch (err) {
        console.error('Failed to revalidate home page:', err);
      }
    }
    return response;
  };
}
