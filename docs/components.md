# components/ — Shared UI Components

## Structure
```
components/
  ui/                     # shadcn/ui primitives — DO NOT edit manually
  navigation/             # Sidebar nav section components
  data-table/             # Reusable generic DataTable system (13 files)
  custom/                 # App-specific reusable components
  app-sidebar.tsx         # Root sidebar shell — imports all nav-*.tsx
  nav-main.tsx            # Top-level nav items (non-collapsible)
  nav-user.tsx            # User avatar + profile menu in sidebar footer
  theme-provider.tsx      # next-themes ThemeProvider wrapper
  theme-switcher.tsx      # Light / dark mode toggle button
  credenza.tsx            # Responsive Dialog (desktop) / Drawer (mobile)
  kbd.tsx                 # Keyboard shortcut badge display
  environment-banner.tsx  # Dev/staging environment warning banner
  radio-group.tsx         # Custom radio group component
```

---

## `components/ui/` — shadcn/ui Primitives

**Never edit these files directly.** They are managed by the shadcn CLI.

```bash
# Add a new shadcn component
npx shadcn@latest add <component-name>

# Check if any installed components have upstream updates
npx shadcn@latest diff
```

Configuration lives in `components.json` at the root.

---

## Navigation Components (`components/navigation/`)

Each `nav-*.tsx` corresponds to a sidebar section. They all follow the same pattern:

```tsx
// Pattern used by all nav-*.tsx files
"use client";

const navItems = [
  {
    title: "Section Title",
    url: "#",
    icon: SomeIcon,
    items: [
      { title: "Sub Page", href: "/dashboard/section/page", icon: PageIcon },
    ],
  },
];

export function NavSection() {
  const pathname = usePathname();                         // active route highlighting
  const { isItemOpen, handleOpenChange } = useNavOpenItems("section-key", navItems); // persist open state

  return (
    <SidebarGroup>
      {/* Collapsible menu items */}
    </SidebarGroup>
  );
}
```

| Component | Dashboard section | Key (`useNavOpenItems`) |
|---|---|---|
| `nav-academic.tsx` | Academic | `"academic"` |
| `nav-campus.tsx` | Campus | `"campus"` |
| `nav-community.tsx` | Community | `"community"` |
| `nav-general.tsx` | General (Announcements) | `"general"` |
| `nav-services.tsx` | Services | `"services"` |
| `nav-admin.tsx` | Admin | `"admin"` |

---

## Adding a New Nav Section

1. Create `components/navigation/nav-{section}.tsx` — copy the pattern from `nav-academic.tsx`
2. Register the new component in `components/app-sidebar.tsx`
3. Create the route folder `app/dashboard/{section}/`
4. Add sub-pages as covered in `docs/routes.md`

---

## DataTable System (`components/data-table/`)

A full-featured, composable DataTable with sorting, filtering, pagination, CSV export, and skeleton loading.

### Files
| File | Purpose |
|---|---|
| `data-table.tsx` | Core `<DataTable>` component |
| `data-table-toolbar.tsx` | Search + filter bar |
| `data-table-advanced-toolbar.tsx` | Multi-filter toolbar variant |
| `data-table-pagination.tsx` | Page controls |
| `data-table-column-header.tsx` | Sortable column header |
| `data-table-faceted-filter.tsx` | Dropdown faceted filter |
| `data-table-filter-list.tsx` | Active filter chip list |
| `data-table-date-filter.tsx` | Date range filter |
| `data-table-sort-list.tsx` | Active sort indicator |
| `data-table-view-options.tsx` | Column visibility toggle |
| `data-table-skeleton.tsx` | Loading skeleton |
| `feature-flags-provider.tsx` | Feature flag context for DataTable |
| `feature-flags.tsx` | Feature flag definitions |

**Use the scaffolder** to generate a full module — don't copy-paste manually:
```bash
pnpm artisan:plop
# Enter: module name (e.g. "course"), route prefix (e.g. "dashboard/academic")
# Generates: _lib/ + _components/ + DataTable wired together
```

---

## Custom Hooks (`hooks/`)

| Hook | Purpose |
|---|---|
| `use-data-table.ts` | Manages DataTable state (sort, filter, pagination, URL sync) |
| `use-nav-open-items.ts` | Persist sidebar section open/closed state per key |
| `use-dialog.ts` | Boolean open/close state for dialogs |
| `use-debounce.ts` | Debounce a value (e.g. search input) |
| `use-debounced-callback.ts` | Debounce a callback function |
| `use-mobile.tsx` | Returns `true` if viewport is mobile |
| `use-media-query.tsx` | Generic CSS media query hook |
| `use-loading.tsx` | Loading state helper |
| `use-navigation-loading.tsx` | Shows loading state during Next.js route transitions |
| `use-query-string.ts` | Build/parse URL query strings |
| `use-callback-ref.ts` | Stable callback ref (avoids stale closures) |

---

## Special Components

### `Credenza` — Responsive Modal
Renders as a `Dialog` on desktop, `Drawer` (bottom sheet) on mobile.
**Always prefer `Credenza` over raw `Dialog`** for user-facing forms and detail views.

```tsx
import { Credenza, CredenzaContent, CredenzaHeader, CredenzaTitle } from "@/components/credenza";

<Credenza open={open} onOpenChange={setOpen}>
  <CredenzaContent>
    <CredenzaHeader>
      <CredenzaTitle>Edit Course</CredenzaTitle>
    </CredenzaHeader>
    {/* form content */}
  </CredenzaContent>
</Credenza>
```

### `Kbd` — Keyboard Shortcut
```tsx
import { Kbd } from "@/components/kbd";
<Kbd>⌘K</Kbd>
```
