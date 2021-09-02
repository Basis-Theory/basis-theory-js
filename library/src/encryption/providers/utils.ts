const arrayBufferToBase64String = (arrayBuffer: ArrayBuffer): string =>
  window.btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

const base64StringToArrayBuffer = (b64str: string): ArrayBuffer => {
  const binary = window.atob(b64str);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
};

export { arrayBufferToBase64String, base64StringToArrayBuffer };
