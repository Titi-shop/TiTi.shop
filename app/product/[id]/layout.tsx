import type { Metadata } from "next";

import {
  getProductMetadata,
} from "@/lib/db/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================================================
   DEFAULT METADATA
========================================================= */

const DEFAULT_TITLE = "TiTi Shop";

const DEFAULT_DESCRIPTION =
  "Sàn thương mại điện tử Pi Network";

const DEFAULT_IMAGE = "/banners/3D035BE4-0822-403D-9631-6C4CF674A519.png";

function defaultMetadata(): Metadata {
  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,

    openGraph: {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      type: "website",
      images: [
        {
          url: DEFAULT_IMAGE,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: [DEFAULT_IMAGE],
    },
  };
}

/* =========================================================
   GENERATE METADATA
========================================================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;

    if (!id) {
      return defaultMetadata();
    }

    const product =
      await getProductMetadata(id);

    if (!product) {
      return defaultMetadata();
    }

    const title =
      product.name?.trim() ||
      DEFAULT_TITLE;

    const description =
      product.short_description?.trim() ||
      product.description
        ?.replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 160) ||
      DEFAULT_DESCRIPTION;

    const image =
      product.thumbnail?.trim() ||
      DEFAULT_IMAGE;

    return {
      title,
      description,

      openGraph: {
        title,
        description,
        type: "website",
        images: [
          {
            url: image,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    console.error(
      "[PRODUCT_METADATA_ERROR]",
      error
    );

    return defaultMetadata();
  }
}

/* =========================================================
   LAYOUT
========================================================= */

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
