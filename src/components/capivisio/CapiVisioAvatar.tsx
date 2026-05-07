import type { AvatarGifKey } from "@/lib/capiVisioExpressions";

type Size = "sm" | "md" | "lg";

type Props = {
  gifKey: AvatarGifKey;
  size?: Size;
  className?: string;
};

const SIZE_PX: Record<Size, number> = { sm: 22, md: 52, lg: 96 };

// TODO: trocar pelos GIFs próprios quando subirem (capi_thursday.gif,
// capi_friday.gif, capi_friday_sleuth.gif). Por enquanto reusa o de quarta.
const GIF_BY_KEY: Record<AvatarGifKey, string> = {
  monday: "/capivisio/capi_monday.gif",
  tuesday: "/capivisio/capi_tuesday.gif",
  wednesday: "/capivisio/capi_wednesday.gif",
  thursday: "/capivisio/capi_thursday.gif",
  friday: "/capivisio/capi_thursday.gif",
  friday_sleuth: "/capivisio/capi_monday.gif",
};

export function CapiVisioAvatar({ gifKey, size = "md", className }: Props) {
  const px = SIZE_PX[size];
  const src = GIF_BY_KEY[gifKey];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      width={px}
      height={px}
      className={className}
      draggable={false}
      style={{ objectFit: "contain", imageRendering: "pixelated" }}
    />
  );
}
