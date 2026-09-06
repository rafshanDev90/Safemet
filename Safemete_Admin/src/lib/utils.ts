import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')       // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')           // Trim - from start of text
    .replace(/-+$/, '');          // Trim - from end of text
}

export function formatCategory(cat: string): string {
  const map: Record<string, string> = {
    'fire-protection-system': 'Fire Protection System',
    'fire-detection-alarm-system': 'Fire Detection & Alarm System',
    'fire-suppression-system': 'Fire Suppression System',
    'fire-extinguisher': 'Fire Extinguisher',
    'ms-seamless-pipe': 'MS Seamless Pipe',
  };
  return map[cat] || cat;
}

export function formatDate(isoDateString: string): string {
  try {
    const d = new Date(isoDateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoDateString;
  }
}

export function formatRelativeTime(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    return formatDate(isoDateString);
  } catch {
    return isoDateString;
  }
}
