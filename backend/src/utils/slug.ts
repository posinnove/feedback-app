import { Company } from "../models/company.model.ts";

/**
 * Converts a company name to a URL-safe slug.
 * e.g. "Acme Corp!" → "acme-corp"
 */
export function toSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")  // strip non-alphanumeric (except spaces/hyphens)
        .replace(/\s+/g, "-")           // spaces → hyphens
        .replace(/-+/g, "-");           // collapse consecutive hyphens
}

/**
 * Generates a unique slug for a company.
 * If the base slug already exists, appends a numeric suffix (e.g. "acme-2").
 */
export async function generateUniqueSlug(name: string): Promise<string> {
    const base = toSlug(name);
    let slug = base;
    let counter = 2;

    while (await Company.findOne({ where: { slug } })) {
        slug = `${base}-${counter}`;
        counter++;
    }

    return slug;
}
