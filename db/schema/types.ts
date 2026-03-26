import { OrderTimelineLog } from "@/app/dashboard/cs/whatsapp/missing/_lib/actions";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { addresses, branches, customers, departments, users } from "./core";
import { recipeSizeEnum } from "./enums";
import { stockTransferDetails } from "./inventory";
import { stockTransfers } from "./inventory/stock-transfers";
import { updateItemBalanceLogs } from "./inventory/update-item-balance-logs";
import {
  deliveries,
  deliveryClaims,
  deliveryGroups,
  driverProfiles,
} from "./logistics";
import { peakseasonForecasts } from "./misc/peak-season-forecasts";
import {
  lineItems,
  offlineOrderAuditLogs,
  Order,
  ShippingLines,
  virtualLineItems,
} from "./order-management";
import {
  countries,
  curations,
  items,
  itemsToRecipes,
  products,
  productsToCountries,
  recipeAuditLogs,
  recipes,
  variants,
} from "./productions";
import { StatusMaster } from "./status-master";

export type Department = typeof departments.$inferSelect;

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

export type Branch = typeof branches.$inferSelect;
export type NewBranch = typeof branches.$inferInsert;

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserDetails = User & {
  branch: Branch;
  department: Department;
};
export type Curation = typeof curations.$inferSelect;
export type NewCuration = typeof curations.$inferInsert;
export type FloristWithLineItems = InferSelectModel<typeof users> & {
  lineItems: InferSelectModel<typeof lineItems>[];
};
export type OfflineOrderAuditLogInsert = InferInsertModel<
  typeof offlineOrderAuditLogs
>;
export type OfflineOrderAuditLog = InferSelectModel<
  typeof offlineOrderAuditLogs
>;
export type Peakseasonforecast = typeof peakseasonForecasts.$inferSelect;
export type NewPeakseasonforecast = typeof peakseasonForecasts.$inferInsert;
export type Florist = InferSelectModel<typeof users>;
export type Variant = InferSelectModel<typeof variants>;
export type Recipe = typeof recipes.$inferSelect;
export type RecipeWithItems = Recipe & {
  items: ItemToRecipe[];
  variants: Variant[];
  curation?: Curation | null;
};
export type Item = InferSelectModel<typeof items>;
export type ItemToRecipe = InferSelectModel<typeof itemsToRecipes>;
export type OrderWithDetails = Order & {
  customer: Customer;
  shippingAddress: Address;
  billingAddress: Address;
  status: StatusMaster;
  delivery: Delivery & {
    driver: User | null;
    status: StatusMaster;
    deliveryGroup: DeliveryGroups | null;
  };
  shippingLines: ShippingLines[];
  timelineLogs: OrderTimelineLog[];
  lineItems: (LineItem & {
    variant: Variant;
  })[];
};
export type ProductsWithVariants = Product & {
  variants: Variant[];
};
export type SingleProductWithVariants = Product & {
  variants: Variant[];
};
export type VariantWithRecipe = Variant & {
  recipe: Recipe;
};
export type RecipesWithItems = Recipe & {
  recipesToItems: ItemToRecipe[];
};
export type RecipeWithVariants = Recipe & {
  variants: Variant[];
};
export type RecipeWithCuration = Recipe & {
  variantImage: string | null;
  variants: Variant[];
  curation:
    | (Curation & {
        validator: {
          id: number;
          name: string | null;
          email: string | null;
        } | null;
      })
    | null;
};
export type RecipeInsert = InferInsertModel<typeof recipes>;
export type ItemToRecipeInsert = InferInsertModel<typeof itemsToRecipes>;
export type RecipePayload = RecipeInsert & {
  items: ItemToRecipeInsert[];
  createdBy?: number;
  updatedBy?: number;
};
export type RecipeAuditLogInsert = InferInsertModel<typeof recipeAuditLogs>;
export type RecipeAuditLog = InferSelectModel<typeof recipeAuditLogs>;
export type VirtualOrder = InferSelectModel<typeof virtualLineItems>;
export type LineItem = InferSelectModel<typeof lineItems>;
export type CurationWithRelations = Curation & {
  recipe: {
    id: number;
    name: string | null;
    size: (typeof recipeSizeEnum.enumValues)[number];
  } | null;
  validator: {
    id: number;
    name: string | null;
    email: string | null;
  } | null;
};
export type StockTransfer = typeof stockTransfers.$inferSelect;
export type NewStockTransfer = typeof stockTransfers.$inferInsert;
export type StockTransfersTable = StockTransfer & {
  branch: Branch;
  pendingUser: User | null;
  processingUser: User | null;
  fulfilledUser: User | null;
  rejectedUser: User | null;
};
export type StockTransferDetails = typeof stockTransferDetails.$inferSelect;
export type NewStockTransferDetails = typeof stockTransferDetails.$inferInsert;
export type ProductToCountry = typeof productsToCountries.$inferSelect;
export type Country = typeof countries.$inferSelect;

export type Product = InferSelectModel<typeof products>;
export type ProductWithCountry = Product & {
  productsToCountries: (ProductToCountry & {
    country: Country;
  })[];
};

export type BalanceLog = typeof updateItemBalanceLogs.$inferSelect;
export type NewBalanceLog = typeof updateItemBalanceLogs.$inferInsert;

export type DeliveryGroups = typeof deliveryGroups.$inferSelect;
export type NewDeliveryGroups = typeof deliveryGroups.$inferInsert;
export type Delivery = InferSelectModel<typeof deliveries>;
export type NewDelivery = InferInsertModel<typeof deliveries>;
export type DriverProfile = InferSelectModel<typeof driverProfiles>;
export type NewDriverProfile = InferInsertModel<typeof driverProfiles>;
export type NewClaim = InferInsertModel<typeof deliveryClaims>;
export type Claim = InferSelectModel<typeof deliveryClaims>;
