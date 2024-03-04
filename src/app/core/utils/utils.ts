export function downloadImage(dataUrl: string, filename: string) {
  const data = dataUrl.split(',')[1];
  const mimeType = dataUrl.split(';')[0].slice(5);

  const bytes = atob(data);
  const size = bytes.length;
  const buffer = new ArrayBuffer(size);
  const view = new Uint8Array(buffer);

  for (let i = 0; i < size; i++) {
    view[i] = bytes.charCodeAt(i);
  }

  const blob = new Blob([buffer], { type: mimeType });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function formatCurrency(value?: number | string | null) {
  if (!value) {
    return '£0';
  }
  let nValue: number | string | undefined;
  nValue = value;
  if (typeof value === 'string') {
    nValue = !isNaN(Number(value)) ? Number(value) : undefined;
  }
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  });

  return `${formatter.format(nValue as number)}`;
}
