import { forwardRef, type ImgHTMLAttributes, useEffect, useState } from 'react'
import './image.css'
import { cn } from '@/lib/utils';
import { mediaUrl, mediaSize } from '@/lib/media';

// Same fallback picture Wix used, now served from our own hosting.
const FALLBACK_IMAGE_URL = mediaUrl("/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332.png");

type FittingType = 'fill' | 'fit';

type WixImageDataProps = {
  fittingType?: FittingType;
  originWidth?: number;
  originHeight?: number;
  focalPointX?: number;
  focalPointY?: number;
};

export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & WixImageDataProps

/**
 * Drop-in replacement for the old Wix image component. Layout is kept the
 * same: pictures that carried their original size (CMS photos) sit in a sized
 * wrapper and fill it; every other picture is a plain <img>. Files are served
 * from /media on our own hosting instead of Wix's image servers.
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, fittingType = 'fill', originWidth, originHeight, focalPointX, focalPointY, className, style, ...props }, ref) => {
    const [failed, setFailed] = useState(false)
    useEffect(() => setFailed(false), [src])

    if (!src) {
      return <div data-empty-image ref={ref as any} className={className} style={style} {...(props as any)} />
    }

    const resolved = failed ? FALLBACK_IMAGE_URL : mediaUrl(src)
    const size = mediaSize(src) || (originWidth && originHeight ? { width: originWidth, height: originHeight } : undefined)
    const onError = () => setFailed(true)

    if (!size) {
      return <img ref={ref} src={resolved} className={className} style={style} {...props} onError={onError} data-error-image={failed} />
    }

    const objectPosition =
      typeof focalPointX === 'number' && typeof focalPointY === 'number' ? `${focalPointX}% ${focalPointY}%` : undefined

    return (
      <span
        className={cn('inline-block relative', className)}
        style={
          {
            '--img-aspect-ratio': `${size.width} / ${size.height}`,
            '--img-default-width': `${size.width}px`,
            ...style,
          } as React.CSSProperties
        }
      >
        <img
          ref={ref}
          src={resolved}
          className={`w-full h-full inset-0 absolute ${fittingType === 'fit' ? 'object-contain' : 'object-cover'}`}
          style={objectPosition ? { objectPosition } : undefined}
          {...props}
          onError={onError}
        />
      </span>
    )
  }
)
Image.displayName = 'Image'
