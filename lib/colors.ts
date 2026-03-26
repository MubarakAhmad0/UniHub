export const getSessionColor = (session: string) => {
  if (!session) return "bg-gray-500 text-white";

  switch (session.toLowerCase()) {
    case "morning":
    case "am":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "standard":
    case "pm":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "evening":
    case "em":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-gray-500 text-white";
  }
};
