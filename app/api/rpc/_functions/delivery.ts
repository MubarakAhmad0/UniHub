import { db } from "@/db";
import {
  addresses,
  deliveries,
  deliveryGroups,
  lineItems,
  orders,
  ProvinceCode,
  statusMaster,
  users,
  variants,
} from "@/db/schema";
import {
  arrayAggBuildObject,
  jsonAggBuildObject,
  jsonBuildObject,
} from "@/db/utils";
import { getUserData, hasRole } from "@/lib/auth/utils";
import { format } from "date-fns";
import {
  and,
  eq,
  inArray,
  isNotNull,
  isNull,
  ne,
  notInArray,
  or,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import SuperJSON from "superjson";
import { z } from "zod";
import { getDeliveryGroups } from "../_routers/delivery";

export const DeliveryQuerySchema = z.object({
  date: z.date(),
  status: z.array(z.string()).optional(),
  location: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  session: z.array(z.string()).optional(),
  deliveryType: z.string().optional(),
  itemStatus: z.array(z.string()).optional(),
});

export type DeliveryQueryInput = z.infer<typeof DeliveryQuerySchema>;

export class DeliveryServiceError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = "DeliveryServiceError";
  }
}

export type FullOrderDetails = Awaited<
  ReturnType<typeof getOrdersByDate>
>[number];

export type DeliveryGroup = Awaited<
  ReturnType<typeof getDeliveryGroups>
>["data"];

export async function getOrdersByDate(input: DeliveryQueryInput) {
  const userData = await getUserData();
  const isAdmin = await hasRole("admin");

  if (!userData) {
    throw new DeliveryServiceError("User not found");
  }

  let locationFilter: ProvinceCode = "BTKL";
  switch (userData?.branch?.code) {
    case "BTHQ":
    case "BTKL":
    case "SJMC":
    case "KPJ2":
    case "BTHQR":
      locationFilter = "BTKL";
      break;
    case "BTJ-TEB":
      locationFilter = "BTJB";
      break;
    case "BTPG":
      locationFilter = "BTPG";
      break;
  }

  try {
    const today = format(input.date, "dd-MM-yyyy");

    const deliveryStatus = alias(statusMaster, "deliveryStatus");

    let sessionCondition;
    if (input.session && input.session.length > 0) {
      const sessionConditions = input.session.map((session) => {
        switch (session.toLowerCase()) {
          case "morning":
            return or(
              eq(orders.deliverySession, "Morning"),
              eq(orders.deliverySession, "AM"),
            );
          case "standard":
            return or(
              eq(orders.deliverySession, "Standard"),
              eq(orders.deliverySession, "PM"),
            );
          case "evening":
            return or(
              eq(orders.deliverySession, "Evening"),
              eq(orders.deliverySession, "EM"),
            );
          default:
            return or(
              eq(orders.deliverySession, "Standard"),
              eq(orders.deliverySession, "PM"),
            );
        }
      });
      sessionCondition = or(...sessionConditions);
    }

    const whereConditions = [
      eq(orders.deliveryDate, today),
      ne(orders.deliveryType, "SELF_PICKUP"),
      ne(orders.statusNew, "CANCELLED"),
      or(
        isNull(orders.approvalStatus),
        and(
          ne(orders.approvalStatus, "PENDING_APPROVAL"),
          ne(orders.approvalStatus, "REJECTED"),
        ),
      ),
    ];

    if (input.itemStatus && input.itemStatus.length > 0) {
      whereConditions.push(
        inArray(lineItems.status, input.itemStatus as any[]),
      );
    }

    if (sessionCondition) {
      whereConditions.push(sessionCondition);
    }

    if (input.deliveryType !== undefined && input.deliveryType !== "") {
      if (input.deliveryType.toLowerCase() === "express") {
        whereConditions.push(eq(orders.deliveryType, "EXPRESS_DELIVERY"));
      } else if (input.deliveryType.toLowerCase() === "standard") {
        whereConditions.push(eq(orders.deliveryType, "STANDARD_DELIVERY"));
      }
    }

    if (input.status?.length) {
      whereConditions.push(
        inArray(deliveryStatus.id, input.status.map(Number)),
      );
    }

    if (input.location && input.location !== "ALL" && input.location !== "") {
      if (input.location === "BTKL") {
        whereConditions.push(
          notInArray(addresses.provinceCode, ["PNG", "KDH", "JHR"]),
        );
      } else if (input.location === "BTPG") {
        whereConditions.push(inArray(addresses.provinceCode, ["PNG", "KDH"]));
      } else if (input.location === "BTJB") {
        whereConditions.push(
          or(
            inArray(addresses.provinceCode, ["JHR"]),
            eq(addresses.countryCode, "SG"),
          ),
        );
      }
    }

    const response = await db
      .select({
        id: orders.id,
        remarks: orders.remarks,
        orderNumber: orders.orderNumber,
        statusNew: orders.statusNew,
        note: orders.note,
        deliveryType: orders.deliveryType,
        deliverySession: orders.deliverySession,
        shippingAddress: {
          id: addresses.id,
          company: addresses.company,
          address1: addresses.address1,
          address2: addresses.address2,
          city: addresses.city,
          zip: addresses.zip,
          provinceCode: addresses.provinceCode,
          latitude: addresses.latitude,
          longitude: addresses.longitude,
          firstName: addresses.firstName,
          lastName: addresses.lastName,
          phone: addresses.phone,
        },
        lineItems: jsonAggBuildObject(
          {
            id: lineItems.id,
            variantId: lineItems.variantId,
            quantity: lineItems.quantity,
            title: lineItems.title,
            variantTitle: lineItems.variantTitle,
            status: lineItems.status,
            displayName: variants.displayName,
            variantSize: variants.size,
          },
          { nullish: true },
        ),
        deliveries: arrayAggBuildObject(
          {
            id: deliveries.id,
            deliveryGroupId: deliveries.deliveryGroupId,
            statusId: deliveries.statusId,
            referenceId: deliveryGroups.referenceId,
            driver: jsonBuildObject({
              id: deliveries.driverId,
              name: users.name,
            }),
            status: jsonBuildObject({
              id: deliveryStatus.id,
              code: deliveryStatus.code,
            }),
            deliveryNotes: deliveries.deliveryNotes,
          },
          { where: isNotNull(deliveries.id) },
        ),
      })
      .from(orders)
      .leftJoin(addresses, eq(orders.shippingAddressId, addresses.id))
      .leftJoin(lineItems, eq(orders.id, lineItems.orderId))
      .leftJoin(deliveries, eq(orders.id, deliveries.orderId))
      .leftJoin(users, eq(deliveries.driverId, users.id))
      .leftJoin(statusMaster, eq(orders.statusId, statusMaster.id))
      .leftJoin(deliveryStatus, eq(deliveries.statusId, deliveryStatus.id))
      .leftJoin(variants, eq(lineItems.variantId, variants.shopifyVariantId))
      .leftJoin(
        deliveryGroups,
        eq(deliveries.deliveryGroupId, deliveryGroups.id),
      )
      .where(and(...whereConditions))
      .groupBy(orders.id, addresses.id, statusMaster.id);

    return SuperJSON.serialize(response).json as typeof response;
  } catch (error) {
    console.error("Failed to fetch orders by date:", error);
    throw new DeliveryServiceError("Failed to fetch orders", error);
  }
}
