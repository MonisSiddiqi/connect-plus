
export function getFileUrl(file: string) {
  return import.meta.env.VITE_API_URL + "/" + file;
}

export function getInitials(name: string) {
  if (!name) {
    return ""
  }
  const words = name.split(' ');
  let initials = '';
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i].charAt(0);
  }
  return initials.toUpperCase();
};