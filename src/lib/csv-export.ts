/**
 * CSV Export Utility
 * Generates CSV content from structured data and triggers a browser download.
 */

export interface ExportColumn {
  key: string;
  label: string;
}

/**
 * Converts an array of objects to a CSV string.
 */
export function generateCSV(
  data: Record<string, unknown>[],
  columns: ExportColumn[]
): string {
  if (data.length === 0) return '';

  const header = columns.map((col) => escapeCSVValue(col.label)).join(',');
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = row[col.key];
        return escapeCSVValue(String(value ?? ''));
      })
      .join(',')
  );

  return [header, ...rows].join('\n');
}

/**
 * Converts an array of objects to tab-separated values for clipboard.
 */
export function generateTSV(
  data: Record<string, unknown>[],
  columns: ExportColumn[]
): string {
  if (data.length === 0) return '';

  const header = columns.map((col) => col.label).join('\t');
  const rows = data.map((row) =>
    columns.map((col) => String(row[col.key] ?? '')).join('\t')
  );

  return [header, ...rows].join('\n');
}

/**
 * Escapes a value for safe inclusion in CSV format.
 */
function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Triggers a file download in the browser.
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies content to the clipboard.
 */
export async function copyToClipboard(content: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}
