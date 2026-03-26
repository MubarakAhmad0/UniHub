import { NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";
import { Product } from "../_lib/types";
import { db } from "@/db";
import { products, variants } from "@/db/schema";
import { extractShopifyId, extractSize } from "@/lib/utils";
import { sendGChatMessage } from "@/lib/notification/gchat";
import { eq } from "drizzle-orm";

export const POST = createApiHandler<unknown>(async (req) => {
  const body = (await req.json()) as Product;
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("country");

  const shopifyProductId = extractShopifyId(body.admin_graphql_api_id);

  // First check if product exists
  let product = await db.query.products.findFirst({
    where: eq(products.shopifyProductId, shopifyProductId),
  });

  // Insert or update product
  if (product) {
    // Update existing product
    [product] = await db
      .update(products)
      .set({
        title: body.title,
        type: body.product_type,
        status: body.status === "active" ? "ACTIVE" : "ARCHIVED",
        country: query === "SG" ? "SG" : "MY",
      })
      .where(eq(products.shopifyProductId, shopifyProductId))
      .returning();
    await sendGChatMessage({
      groupChat: {
        name: "GOOGLE_CHAT_SHOPIFY_VARIANT_PRODUCT_UPDATE",
      },
      message: `Product ${product.title} updated`,
    });
  } else {
    // Insert new product
    [product] = await db
      .insert(products)
      .values({
        title: body.title,
        type: body.product_type,
        status: body.status === "active" ? "ACTIVE" : "ARCHIVED",
        shopifyProductId: shopifyProductId,
        country: query === "SG" ? "SG" : "MY",
      })
      .returning();

    await sendGChatMessage({
      groupChat: {
        name: "GOOGLE_CHAT_SHOPIFY_VARIANT_PRODUCT_UPDATE",
      },
      message: `Product ${product.title} created`,
    });
  }

  // Process variants
  for (const variant of body.variants) {
    const shopifyVariantId = extractShopifyId(variant.admin_graphql_api_id);
    const variantImage = variant.image_id
      ? body.images.find((img) => img.id === variant.image_id)
      : null;

    // Check if variant exists
    const existingVariant = await db.query.variants.findFirst({
      where: eq(variants.shopifyVariantId, BigInt(shopifyVariantId)),
    });

    let updatedVariant;
    if (existingVariant) {
      // Update existing variant
      [updatedVariant] = await db
        .update(variants)
        .set({
          displayName: `${product.title} - ${variant.title}`,
          cleanName: product.title,
          size: extractSize(variant.title),
          image: variantImage?.src || null,
        })
        .where(eq(variants.shopifyVariantId, BigInt(shopifyVariantId)))
        .returning();
    } else {
      // Insert new variant
      [updatedVariant] = await db
        .insert(variants)
        .values({
          shopifyProductId: BigInt(shopifyProductId),
          shopifyVariantId: BigInt(shopifyVariantId),
          productId: product.id,
          displayName: `${product.title} - ${variant.title}`,
          cleanName: product.title,
          size: extractSize(variant.title),
          image: variantImage?.src || null,
        })
        .returning();
    }

    await sendGChatMessage({
      groupChat: {
        name: "GOOGLE_CHAT_SHOPIFY_VARIANT_PRODUCT_UPDATE",
      },
      message: `[${query === "SG" ? "SINGAPORE" : "MY"}] Variant ${updatedVariant.displayName} ${existingVariant ? "updated" : "created"}`,
    });
  }

  return NextResponse.json({
    success: true,
    message: `Product ${product ? "updated" : "created"} successfully`,
    data: product,
  });
});
