import { Layout, LayoutBody } from "@/components/ui/layout";
import { PermissionsTable } from "./_components/permissions-table";
import { getPermissions } from "./_lib/queries";
import { searchParamsCache } from "./_lib/validations";
import { getValidFilters } from "@/lib/data-table";
import { SearchParams } from "@/types";

export const dynamic = "force-dynamic";

interface PermissionsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function PermissionsPage(props: PermissionsPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);
  const validFilters = getValidFilters(search.filters);

  const permissions = await getPermissions({
    ...search,
    filters: validFilters,
  });

  const data = Promise.resolve(permissions);

  return (
    <Layout>
      <LayoutBody>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Permissions Management</h1>
            <p className="text-muted-foreground text-sm">
              Manage system permissions and access controls
            </p>
          </div>
          <PermissionsTable data={data} />
        </div>
      </LayoutBody>
    </Layout>
  );
}
