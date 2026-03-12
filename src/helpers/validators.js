export function validateName(name) {
  if (!name || name.trim().length < 3) {
    return 'El nombre debe tener al menos 3 caracteres';
  }
  return null;
}

export function validatePhone(phone) {
  if (!phone) return 'El telefono es obligatorio';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 10) {
    return 'El telefono debe tener al menos 10 digitos';
  }
  return null;
}

export function validateFile(file) {
  if (!file) return 'Debes adjuntar el comprobante';
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    return 'Solo se aceptan imagenes (JPG, PNG, WEBP)';
  }
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return 'El archivo no puede superar 5MB';
  }
  return null;
}
