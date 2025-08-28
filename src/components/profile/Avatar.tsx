"use client";

import Image, { StaticImageData } from "next/image";

export type AvatarSrc = string | StaticImageData | null | undefined;

function cn(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export default function Avatar({
  src,
  alt,
  size = 96,
  className,
}: {
  src: AvatarSrc;
  alt: string;
  size?: number;
  className?: string;
}) {
  const ring = "ring-2 ring-offset-2 ring-offset-white ring-primary/70";
  if (!src || typeof src === "string") {
    return (
      <Image
        src={(src as string) || "/placeholder-avatar.png"}
        alt={alt}
        width={size}
        height={size}
        className={cn("rounded-full object-cover shadow-sm", ring, className)}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-full object-cover shadow-sm", ring, className)}
    />
  );
}
