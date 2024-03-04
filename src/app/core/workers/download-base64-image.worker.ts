/// <reference lib="webworker" />

addEventListener('message', (event) => {
  const { dataUrl, filename } = event.data;
  const blob = processDataUrlToBlob(dataUrl);
  postMessage({ blob, filename });
});

function processDataUrlToBlob(dataUrl: string) {
  const data = dataUrl.split(',')[1];
  const mimeType = dataUrl.split(';')[0].slice(5);

  const bytes = atob(data);
  const size = bytes.length;
  const buffer = new ArrayBuffer(size);
  const view = new Uint8Array(buffer);

  for (let i = 0; i < size; i++) {
    view[i] = bytes.charCodeAt(i);
  }

  return new Blob([buffer], { type: mimeType });
}
