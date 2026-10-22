/**
 * Compresses an image file (JPG, PNG, WebP) to a lightweight Data URL
 * suitable for Firestore and fast mobile loading.
 */
export async function compressImageFile(file: File, maxDimension = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate type
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) {
      reject(new Error('Formato no soportado. Por favor, selecciona un archivo JPG, PNG o WebP.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo procesar la imagen seleccionada.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize down proportionally if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context no disponible.'));
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG data URL for optimal size
        const isPngWithTransparency = file.type === 'image/png';
        const outputMime = isPngWithTransparency ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputMime, isPngWithTransparency ? undefined : quality);

        resolve(dataUrl);
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
