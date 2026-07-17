// lib/products.ts
export const PRODUCT_CATEGORY_LABEL: Record<string, string> = {
  TEMPLATE: "Starter Template",
  THEME: "Theme",
  UI_KIT: "UI Kit",
  TOOL: "Developer Tool",
  SDK: "SDK / Library",
  CODE_SNIPPET: "Code Snippet",
  DOCUMENTATION: "Documentation",
  ASSET: "Asset Pack",
  LICENSE: "License",
  OTHER: "Other",
}

export function prettyCategory(category?: string | null) {
  if (!category) return "Other"
  return PRODUCT_CATEGORY_LABEL[category] ?? "Other"
}
