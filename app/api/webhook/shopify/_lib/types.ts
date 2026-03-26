export interface Product {
  admin_graphql_api_id: string;
  body_html: string;
  created_at: string;
  handle: string;
  id: number;
  product_type: string;
  published_at: string;
  template_suffix: string;
  title: string;
  updated_at: string;
  vendor: string;
  status: string;
  published_scope: string;
  tags: string;
  variants: ProductVariant[];
  options: ProductOption[];
  images: ProductImage[];
  image: ProductImage | null;
  media: ProductMedia[];
  variant_gids: VariantGid[];
  has_variants_that_requires_components: boolean;
  category: ProductCategory;
}

interface ProductVariant {
  admin_graphql_api_id: string;
  barcode: string;
  compare_at_price: string | null;
  created_at: string;
  id: number;
  inventory_policy: string;
  position: number;
  price: string;
  product_id: number;
  sku: string;
  taxable: boolean;
  title: string;
  updated_at: string;
  option1: string;
  option2: string;
  option3: string;
  image_id: number | null;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
}

interface ProductOption {
  name: string;
  id: number;
  product_id: number;
  position: number;
  values: string[]; // Array of option values like ['Pink', 'Purple', 'White']
}

interface ProductImage {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string | null;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
  admin_graphql_api_id: string;
}

interface ProductMedia {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string | null;
  status: string;
  media_content_type: string;
  preview_image: {
    [key: string]: any; // Preview image object structure
  };
  variant_ids: number[];
  admin_graphql_api_id: string;
}

interface VariantGid {
  admin_graphql_api_id: string;
  updated_at: string;
}

interface ProductCategory {
  admin_graphql_api_id: string;
  name: string;
  full_name: string;
}
