import { Layout, LayoutBody } from "@/components/ui/layout";
import { RolesTable } from "./_components/roles-table";
import { getRoles } from "./_lib/queries";
import { searchParamsCache } from "./_lib/validations";
import { getValidFilters } from "@/lib/data-table";
import { SearchParams } from "@/types";

interface RolesPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function RolesPage(props: RolesPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);
  const validFilters = getValidFilters(search.filters);

  const roles = await getRoles({
    ...search,
    filters: validFilters,
  });

  const promises = Promise.resolve(roles);

  return (
    <Layout>
      <LayoutBody>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Roles Management</h1>
            <p className="text-muted-foreground text-sm">
              Manage system roles and their permissions
            </p>
          </div>
          <RolesTable promises={promises} />
        </div>
      </LayoutBody>
    </Layout>
  );
}
