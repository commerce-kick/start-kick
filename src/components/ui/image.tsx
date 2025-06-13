import { ImageProps, Image as UnPic } from "@unpic/react";

export default function Image({ ...props }: ImageProps) {
  return <UnPic {...props} />;
}
