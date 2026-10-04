/** vite-imagetools `as=picture` output. */
interface ImagetoolsPicture {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
}

declare module '*as=picture' {
  const picture: ImagetoolsPicture;
  export default picture;
}

declare module '*as=url' {
  const url: string;
  export default url;
}
