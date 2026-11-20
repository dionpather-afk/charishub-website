/**
 * Site content service (replaces the old Wix CMS connection).
 *
 * All church content now lives in src/data/cms.json, inside this GitHub repo.
 * To change content (events, team bios, ministries, photos...), edit that file
 * and redeploy. The page code still calls BaseCrudService exactly as before,
 * so every page looks and behaves the same as it did on Wix.
 *
 * The only thing that is sent anywhere is the contact form, which posts to
 * contact.php on our own hosting (Xneelo). Nothing talks to Wix any more.
 */
import cms from '@/data/cms.json';

export interface WixDataItem {
  _id: string;
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
  [key: string]: any;
}

export interface PaginationOptions {
  limit?: number;
  skip?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  hasNext: boolean;
  currentPage: number;
  pageSize: number;
  nextSkip: number | null;
}

// Wix stored dates as { $date: "..." }; give pages plain values like Wix's SDK did.
const unwrap = (value: any): any => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    if (typeof value.$date === 'string') return new Date(value.$date);
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, unwrap(v)]));
  }
  if (Array.isArray(value)) return value.map(unwrap);
  return value;
};

const collections = cms as Record<string, any[]>;

const CONTACT_ENDPOINT = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/contact.php`;

export class BaseCrudService {
  static async getAll<T extends WixDataItem>(
    collectionId: string,
    _includeRefs?: unknown,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    const all = (collections[collectionId] || []).map(unwrap) as T[];
    const limit = Math.min(pagination?.limit ?? 50, 1000);
    const skip = pagination?.skip ?? 0;
    const items = all.slice(skip, skip + limit);
    const hasNext = skip + limit < all.length;
    return {
      items,
      totalCount: all.length,
      hasNext,
      currentPage: Math.floor(skip / limit),
      pageSize: limit,
      nextSkip: hasNext ? skip + limit : null,
    };
  }

  static async getById<T extends WixDataItem>(collectionId: string, itemId: string): Promise<T | null> {
    const found = (collections[collectionId] || []).find((i) => i._id === itemId);
    return found ? (unwrap(found) as T) : null;
  }

  /** Only the contact form writes data: it is emailed by contact.php. */
  static async create<T extends WixDataItem>(
    collectionId: string,
    itemData: Partial<T> | Record<string, unknown>
  ): Promise<T> {
    if (collectionId !== 'contactsubmissions') {
      throw new Error(`Saving to "${collectionId}" is not supported on this site`);
    }
    const res = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || 'The message could not be sent');
    return itemData as T;
  }
}
