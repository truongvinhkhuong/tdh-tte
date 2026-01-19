"use client"

import Image, { ImageProps } from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Media {
    id: string
    url?: string | null
    alt: string
    width?: number | null
    height?: number | null
    filename?: string | null
    mimeType?: string | null
    filesize?: number | null
    externalURL?: string | null
}

interface PayloadImageProps extends Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> {
    media: Media | string
    width?: number
    height?: number
    alt?: string
    fallbackSrc?: string
}

export function PayloadImage({
    media,
    width,
    height,
    alt,
    fallbackSrc,
    className,
    ...props
}: PayloadImageProps) {
    const [error, setError] = useState(false)

    // Handle case where media is just an ID (string)
    if (typeof media === 'string') {
        if (fallbackSrc) {
            return (
                <Image
                    src={fallbackSrc}
                    alt={alt || "Fallback image"}
                    width={width || 800}
                    height={height || 600}
                    className={className}
                    {...props}
                />
            )
        }
        return null
    }

    // Determine the source URL
    // Priority: externalURL > url > fallbackSrc
    let src = media?.externalURL || media?.url || fallbackSrc || ""

    // If no src, return null or fallback wrapper
    if (!src) return null

    // If source is relative (from Payload), prepend server URL if needed
    // However, in this setup, we assume Next.js image optimization handles relative paths 
    // or the URL is already absolute if it's from a cloud storage
    // If it's a local file in dev, it might be relative.

    const finalAlt = alt || media?.alt || "Image"
    const finalWidth = width || media?.width || 800 // Default width if missing
    const finalHeight = height || media?.height || 600 // Default height if missing

    if (error && fallbackSrc) {
        return (
            <Image
                src={fallbackSrc}
                alt={finalAlt}
                width={finalWidth}
                height={finalHeight}
                className={className}
                {...props}
            />
        )
    }

    return (
        <Image
            src={src}
            alt={finalAlt}
            width={finalWidth!}
            height={finalHeight!}
            className={cn("transition-opacity duration-300", error ? "opacity-0" : "opacity-100", className)}
            onError={() => setError(true)}
            {...props}
        />
    )
}
