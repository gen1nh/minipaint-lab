import type { ReactNode } from 'react';

export type StudioIconName =
  'drop' | 'search' | 'layers' | 'folder' | 'home' | 'book' | 'palette';

const shapes: Record<StudioIconName, ReactNode> = {
  drop: (
    <path d="M12 2.4c2.7 4.7 7.1 8.3 7.1 13a7.1 7.1 0 1 1-14.2 0c0-4.7 4.4-8.3 7.1-13Zm-3.4 13a3.4 3.4 0 0 0 2.4 3.3v-1.8a1.8 1.8 0 0 1-.8-1.5c0-1 .5-2 1.1-3l-1.4-.8c-.8 1.3-1.3 2.5-1.3 3.8Z" />
  ),
  search: (
    <path d="M10.5 3a7.5 7.5 0 1 0 4.6 13.4l4.2 4.2a1.2 1.2 0 0 0 1.7-1.7l-4.2-4.2A7.5 7.5 0 0 0 10.5 3Zm0 2.4a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2Z" />
  ),
  layers: (
    <path d="m12 2 9.5 5-9.5 5-9.5-5L12 2Zm-7.9 8.4L12 14.5l7.9-4.1 1.6.8-9.5 5-9.5-5 1.6-.8Zm0 4.3 7.9 4.1 7.9-4.1 1.6.8-9.5 5-9.5-5 1.6-.8Z" />
  ),
  folder: (
    <path d="M3.5 4.5h5l2 2h9A2.5 2.5 0 0 1 22 9v8a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17V6a1.5 1.5 0 0 1 1.5-1.5Z" />
  ),
  home: (
    <path d="M10.6 3.5a2 2 0 0 1 2.8 0l7.1 6.4a1.5 1.5 0 0 1 .5 1.1v8a2 2 0 0 1-2 2h-4v-5.5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V21H5a2 2 0 0 1-2-2v-8a1.5 1.5 0 0 1 .5-1.1l7.1-6.4Z" />
  ),
  book: (
    <path d="M2.5 5.8c3.3-1.5 6.2-1.1 8.5.5v14c-2.4-1.6-5.2-2-8.5-.5V5.8Zm10.5.5c2.3-1.6 5.2-2 8.5-.5v14c-3.3-1.5-6.1-1.1-8.5.5v-14Z" />
  ),
  palette: (
    <path d="M12 2.5a9.5 9.5 0 0 0 0 19h1.5a2.5 2.5 0 0 0 1.9-4.1 1.1 1.1 0 0 1 .8-1.8H18a3.5 3.5 0 0 0 3.5-3.5A9.5 9.5 0 0 0 12 2.5ZM7 12a1.3 1.3 0 1 1 0-2.6A1.3 1.3 0 0 1 7 12Zm3-3.6a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm4 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm3 3.6a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Z" />
  ),
};

export function StudioIcon({
  name,
  size = 24,
}: {
  name: StudioIconName;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
    >
      {shapes[name]}
    </svg>
  );
}
