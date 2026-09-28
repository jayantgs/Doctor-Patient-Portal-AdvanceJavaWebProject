import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Format an ISO date string as a human-readable date.
 * @param date  ISO date string or `Date` object.
 * @param format  Optional dayjs format token (default `DD MMM YYYY`).
 */
export const formatDate = (date: string | Date, format = 'DD MMM YYYY'): string => {
  return dayjs(date).format(format);
};

/**
 * Format an ISO date-time string with time included.
 */
export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format('DD MMM YYYY, hh:mm A');
};

/**
 * Return a relative time string (e.g. "2 hours ago").
 */
export const formatRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

/**
 * Return a short relative time suitable for tables (e.g. "2h ago").
 */
export const formatTimeAgo = (date: string | Date): string => {
  const d = dayjs(date);
  const now = dayjs();
  const diffMinutes = now.diff(d, 'minute');

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = now.diff(d, 'hour');
  if (diffHours < 24) return `${diffHours}h ago`;
  return d.format('DD MMM');
};

/**
 * Parse a date string into a dayjs instance (exported for chaining).
 */
export const parseDate = (date: string | Date): dayjs.Dayjs => dayjs(date);
