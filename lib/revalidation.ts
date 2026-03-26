/**
 * Utility functions for triggering revalidation
 */

export async function triggerRevalidation(topic: string) {
  try {
    const response = await fetch("/api/revalidate", {
      method: "GET",
      headers: {
        "x-app-revalidate-topic": topic,
      },
    });

    if (!response.ok) {
      console.error("Failed to trigger revalidation:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error triggering revalidation:", error);
    return false;
  }
}


