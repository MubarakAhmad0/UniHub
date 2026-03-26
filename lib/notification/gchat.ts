import { getSecret } from "@/lib/aws/get-secret";
import { getGMT8Time } from "@/scripts/helper";
import { logger } from "../logger/logger";

type GroupChat = {
  name:
    | "GOOGLE_CHAT_MISSING_DATE_V2"
    | "GOOGLE_CHAT_BLACKMARK"
    | "GOOGLE_CHAT_SHOPIFY_VARIANT_PRODUCT_UPDATE"
    | "GOOGLE_CHAT_SEASON_PRODUCT_COUNTER"
    | "GOOGLE_CHAT_FLORIST_APP_NOTIFICATIONS"
    | "GOOGLE_CHAT_ORDERS_API_MONITORING"
    | "GOOGLE_CHAT_OFFLINE_ORDERS"
    | "GOOGLE_CHAT_TIKTOK_ORDER_UPDATES"
    | "GOOGLE_CHAT_COORDINATOR_PICKPACKER"
    | "GOOGLE_CHAT_RETURN_ORDER_NOTIFY"
    | "BC_API_MONITORING"
    | "BC_API_MONITORING_FAILS"
    | "GOOGLE_CHAT_ORDERS_DETAILS_MONITORING"
    | "GOOGLE_CHAT_LALAMOVE_WEBHOOKS";
};

export const sendGChatMessage = async ({
  message,
  groupChat,
}: {
  message: string;
  groupChat: GroupChat;
}) => {
  const secret = await getSecret();

  if (groupChat.name === "GOOGLE_CHAT_MISSING_DATE_V2") {
    const chatRes = await fetch(secret.GOOGLE_CHAT_MISSING_DATE_V2, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text: `[${
          process.env.APP_ENV === "production" ? "PROD" : "TESTING|STAGING"
        }][${getGMT8Time()}] ${message}`,
      }),
    });
    const chatResult = await chatRes.json();

    logger.info({
      message: "Gchat message sent",
      function: "sendGChatMessage",
    });

    return chatResult;
  } else if (groupChat.name === "GOOGLE_CHAT_BLACKMARK") {
    const chatRes = await fetch(secret.GOOGLE_CHAT_BLACKMARK, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text: `[${
          process.env.APP_ENV === "production" ? "PROD" : "TESTING|STAGING"
        }][${getGMT8Time()}] ${message}`,
      }),
    });
    const chatResult = await chatRes.json();

    logger.info({
      message: "Gchat message sent to GOOGLE_CHAT_BLACKMARK",
      function: "sendGChatMessage",
    });

    return chatResult;
  } else if (groupChat.name === "GOOGLE_CHAT_SHOPIFY_VARIANT_PRODUCT_UPDATE") {
    if (process.env.APP_ENV !== "production") return;
    const chatRes = await fetch(
      secret.GOOGLE_CHAT_SHOPIFY_VARIANT_PRODUCT_UPDATE,
      {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          text: `[${
            process.env.APP_ENV === "production" ? "PROD" : "TESTING|STAGING"
          }][${getGMT8Time()}] ${message}`,
        }),
      },
    );
    const chatResult = await chatRes.json();

    logger.info({
      message:
        "Gchat message sent to GOOGLE_CHAT_SHOPIFY_VARIANT_PRODUCT_UPDATE",
      function: "sendGChatMessage",
    });

    return chatResult;
  } else if (groupChat.name === "GOOGLE_CHAT_SEASON_PRODUCT_COUNTER") {
    if (process.env.APP_ENV !== "production") return;
    const chatRes = await fetch(secret.GOOGLE_CHAT_SEASON_PRODUCT_COUNTER, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text: `[${
          process.env.APP_ENV === "production" ? "PROD" : "TESTING|STAGING"
        }][${getGMT8Time()}] ${message}`,
      }),
    });
    const chatResult = await chatRes.json();

    logger.info({
      message: "Gchat message sent to GOOGLE_CHAT_SEASON_PRODUCT_COUNTER",
      function: "sendGChatMessage",
    });

    return chatResult;
  } else if (groupChat.name === "GOOGLE_CHAT_FLORIST_APP_NOTIFICATIONS") {
    const chatRes = await fetch(secret.GOOGLE_CHAT_FLORIST_APP_NOTIFICATIONS, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text: `[${
          process.env.APP_ENV === "production" ? "PROD" : "TESTING|STAGING"
        }][${getGMT8Time()}] ${message}`,
      }),
    });
    const chatResult = await chatRes.json();

    logger.info({
      message: "Gchat message sent to GOOGLE_CHAT_FLORIST_APP_NOTIFICATIONS",
      function: "sendGChatMessage",
    });

    return chatResult;
  } else if (groupChat.name === "GOOGLE_CHAT_ORDERS_API_MONITORING") {
    const chatRes = await fetch(secret.GOOGLE_CHAT_ORDERS_API_MONITORING, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text: `[${
          process.env.APP_ENV === "production" ? "PROD" : "TESTING|STAGING"
        }][${getGMT8Time()}] ${message}`,
      }),
    });
    const chatResult = await chatRes.json();

    logger.info({
      message: "Gchat message sent to GOOGLE_CHAT_ORDERS_API_MONITORING",
      function: "sendGChatMessage",
    });

    return chatResult;
  } else if (groupChat.name === "GOOGLE_CHAT_OFFLINE_ORDERS") {
    // Check if the secret exists, if not, log a warning and return
    const webhookUrl = (secret as any).GOOGLE_CHAT_OFFLINE_ORDERS;
    if (!webhookUrl) {
      logger.warn({
        message: "GOOGLE_CHAT_OFFLINE_ORDERS webhook URL not configured",
        function: "sendGChatMessage",
      });
      return { warning: "Webhook URL not configured" };
    }

    const chatRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text: `[${
          process.env.APP_ENV === "production" ? "PROD" : "TESTING|STAGING"
        }][${getGMT8Time()}] ${message}`,
      }),
    });
    const chatResult = await chatRes.json();

    logger.info({
      message: "Gchat message sent to GOOGLE_CHAT_OFFLINE_ORDERS",
      function: "sendGChatMessage",
    });

    return chatResult;
  } else if (groupChat.name === "GOOGLE_CHAT_TIKTOK_ORDER_UPDATES") {
    // Check if the secret exists, if not, log a warning and return
    const webhookUrl = (secret as any).GOOGLE_CHAT_TIKTOK_ORDER_UPDATES;
    if (!webhookUrl) {
      logger.warn({
        message: "GOOGLE_CHAT_TIKTOK_ORDER_UPDATES webhook URL not configured",
        function: "sendGChatMessage",
      });
      return { warning: "Webhook URL not configured" };
    }

    const chatRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text: `[${
          process.env.APP_ENV === "production" ? "PROD" : "TESTING|STAGING"
        }][${getGMT8Time()}] ${message}`,
      }),
    });
    const chatResult = await chatRes.json();

    logger.info({
      message: "Gchat message sent to GOOGLE_CHAT_TIKTOK_ORDER_UPDATES",
      function: "sendGChatMessage",
    });

    return chatResult;
  } else if (groupChat.name === "GOOGLE_CHAT_COORDINATOR_PICKPACKER") {
    // Check if the secret exists, if not, log a warning and return
    const webhookUrl = (secret as any).GOOGLE_CHAT_COORDINATOR_PICKPACKER;
    if (!webhookUrl) {
      logger.warn({
        message:
          "GOOGLE_CHAT_COORDINATOR_PICKPACKER webhook URL not configured",
        function: "sendGChatMessage",
      });
      return { warning: "Webhook URL not configured" };
    }

    const chatRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text: `[${
          process.env.APP_ENV === "production" ? "PROD" : "TESTING|STAGING"
        }][${getGMT8Time()}] ${message}`,
      }),
    });
    const chatResult = await chatRes.json();

    logger.info({
      message: "Gchat message sent to GOOGLE_CHAT_COORDINATOR_PICKPACKER",
      function: "sendGChatMessage",
    });

    return chatResult;
  } else if (groupChat.name === "GOOGLE_CHAT_RETURN_ORDER_NOTIFY") {
    const chatRes = await fetch(secret.GOOGLE_CHAT_RETURN_ORDER_NOTIFY, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text: `[${process.env.APP_ENV === "production" ? "PROD" : "TESTING|STAGING"}] ${message}`,
      }),
    });
    const chatResult = await chatRes.json();

    logger.info({
      message: "Gchat message sent to GOOGLE_CHAT_RETURN_ORDER_NOTIFY",
      function: "sendGChatMessage",
    });

    return chatResult;
  } else if (groupChat.name === "BC_API_MONITORING") {
    // Check if the secret exists, if not, log a warning and return
    const webhookUrl = (secret as any).BC_API_MONITORING;
    if (!webhookUrl) {
      logger.warn({
        message: "BC_API_MONITORING webhook URL not configured",
        function: "sendGChatMessage",
      });
      return { warning: "Webhook URL not configured" };
    }

    const chatRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text: `[${
          process.env.APP_ENV === "production" ? "PROD|BC" : "STAGING|BC 🧪"
        }][${getGMT8Time()}] ${message}`,
      }),
    });
    const chatResult = await chatRes.json();

    logger.info({
      message: "Gchat message sent to BC_API_MONITORING",
      function: "sendGChatMessage",
    });

    return chatResult;
  } else if (groupChat.name === "BC_API_MONITORING_FAILS") {
    // Check if the secret exists, if not, log a warning and return
    const webhookUrl = (secret as any).BC_API_MONITORING_FAILS;
    if (!webhookUrl) {
      logger.warn({
        message: "BC_API_MONITORING webhook URL not configured",
        function: "sendGChatMessage",
      });
      return { warning: "Webhook URL not configured" };
    }

    const chatRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text: `[${
          process.env.APP_ENV === "production" ? "PROD|BC" : "STAGING|BC 🧪"
        }][${getGMT8Time()}] ${message}`,
      }),
    });
    const chatResult = await chatRes.json();

    logger.info({
      message: "Gchat message sent to BC_API_MONITORING_FAILS",
      function: "sendGChatMessage",
    });
  } else if (groupChat.name === "GOOGLE_CHAT_ORDERS_DETAILS_MONITORING") {
    const chatRes = await fetch(secret.GOOGLE_CHAT_ORDERS_DETAILS_MONITORING, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text: `[${process.env.APP_ENV === "production" ? "PROD" : "TESTING|STAGING"}] ${message}`,
      }),
    });
    const chatResult = await chatRes.json();

    if (chatResult.ok) {
      logger.info({
        message: "Gchat message sent to GOOGLE_CHAT_ORDERS_DETAILS_MONITORING",
        function: "sendGChatMessage",
      });
    }
  }
};
