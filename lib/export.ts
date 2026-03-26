import { type Table } from "@tanstack/react-table";

export function exportTableToCSV<TData>(
  /**
   * The table to export.
   * @type Table<TData>
   */
  table: Table<TData>,
  opts: {
    /**
     * The filename for the CSV file.
     * @default "table"
     * @example "tasks"
     */
    filename?: string;
    /**
     * The columns to exclude from the CSV file.
     * @default []
     * @example ["select", "actions"]
     */
    excludeColumns?: (keyof TData | "select" | "actions")[];

    /**
     * Whether to export only the selected rows.
     * @default false
     */
    onlySelected?: boolean;
  } = {},
): void {
  const {
    filename = "table",
    excludeColumns = [],
    onlySelected = false,
  } = opts;

  // Retrieve headers (column names)
  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter(
      (id) =>
        !excludeColumns.includes(id as keyof TData | "select" | "actions"),
    );

  // Build CSV content
  const csvContent = [
    headers.join(","),
    ...(onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
    ).map((row) =>
      headers
        .map((header) => {
          const cellValue = row.getValue(header);
          // Handle values that might contain commas or newlines
          return typeof cellValue === "string"
            ? `"${cellValue.replace(/"/g, '""')}"`
            : cellValue;
        })
        .join(","),
    ),
  ].join("\n");

  // Create a Blob with CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAllDataToCSV<TData>(
  data: TData[],
  opts: {
    filename?: string;
    excludeColumns?: string[];
  } = {},
) {
  const { filename = "table", excludeColumns = [] } = opts;

  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Get headers from the first row, excluding specified columns
  const firstRow = data[0] as Record<string, unknown>;
  const headers = Object.keys(firstRow).filter(
    (key) => !excludeColumns.includes(key),
  );

  // Build CSV content with headers
  const csvContent = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = (row as Record<string, unknown>)[header];
          // Handle null/undefined
          if (value === null || value === undefined) return "";
          // Handle dates
          if (value instanceof Date) {
            return `"${value.toISOString()}"`;
          }
          // Handle strings with commas, quotes, or newlines
          if (typeof value === "string") {
            return `"${value.replace(/"/g, '""')}"`;
          }
          // Handle numbers and booleans
          return value;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
