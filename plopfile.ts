import { NodePlopAPI } from "plop";

/**
 * Converts a string to camel case.
 * @param {string} str - The input string to convert.
 * @returns {string} The camel case version of the input string.
 * @example
 * // returns 'myVariableName'
 * toCamelCase('my variable name');
 */
const toCamelCase = (str: string): string => {
  return str
    .split(" ")
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");
};

/**
 * Converts a string to pascal case.
 * @param {string} str - The input string to convert.
 * @returns {string} The pascal case version of the input string.
 * @example
 * // returns 'MyVariableName'
 * toPascalCase('my variable name');
 */
const toPascalCase = (str: string): string => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

/**
 * Converts a string to kebab case.
 * @param {string} str - The input string to convert.
 * @returns {string} The kebab case version of the input string.
 * @example
 * // returns 'my-variable-name'
 * toKebabCase('my variable name');
 */
const toKebabCase = (str: string): string => {
  return str.toLowerCase().replace(/ /g, "-");
};

export default function (plop: NodePlopAPI) {
  // Register all the case helpers
  plop.setHelper("toCamelCase", (text) => toCamelCase(text));
  plop.setHelper("toPascalCase", (text) => toPascalCase(text));
  plop.setHelper("toKebabCase", (text) => toKebabCase(text));

  plop.setGenerator("datatable", {
    description: "generate datatable components",
    prompts: [
      {
        type: "input",
        name: "module",
        message:
          "module name (lowercase, singular, eg: stock, stock transfer): ",
        validate: (value) => {
          // Allow lowercase letters and spaces
          if (!/^[a-z ]+$/.test(value)) {
            return "module name must be lowercase and can contain spaces";
          }
          // Ensure it doesn't start or end with space
          if (value.startsWith(" ") || value.endsWith(" ")) {
            return "module name cannot start or end with spaces";
          }
          // Ensure no consecutive spaces
          if (value.includes("  ")) {
            return "module name cannot contain consecutive spaces";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "departmentType",
        message: "choose department type:",
        choices: ["select from predefined list", "enter custom route prefix"],
      },
      {
        type: "list",
        name: "department",
        message: "choose a department:",
        choices: [
          { name: "Customer Service", value: "cs" },
          { name: "Human Resources", value: "hr" },
          { name: "Marketing", value: "marketing" },
          { name: "Production", value: "production" },
          { name: "Products", value: "products" },
          { name: "Supply Chain Management", value: "scm" },
          { name: "Logistics", value: "logistics" },
          { name: "Technology", value: "tech" },
        ],
        when: (answers) =>
          answers.departmentType === "select from predefined list",
      },
      {
        type: "input",
        name: "department",
        message: "enter department name/route prefix (lowercase, no spaces):",
        validate: (value) =>
          /^[a-z]+$/.test(value)
            ? true
            : "department name/route prefix must be lowercase and without spaces.",
        when: (answers) =>
          answers.departmentType === "enter custom route prefix",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination:
          "app/dashboard/{{department}}/{{toKebabCase module}}s/_components",
        templateFiles: "utils/datatable/templates/components/*.hbs",
        base: "utils/datatable/templates/components",
      },
      {
        type: "addMany",
        destination:
          "app/dashboard/{{department}}/{{toKebabCase module}}s/_lib",
        templateFiles: "utils/datatable/templates/lib/*.hbs",
        base: "utils/datatable/templates/lib",
      },
      {
        type: "addMany",
        destination: "app/dashboard/{{department}}/{{toKebabCase module}}s",
        templateFiles: "utils/datatable/templates/pages/*.hbs",
        base: "utils/datatable/templates/pages",
      },
    ],
  });
}
