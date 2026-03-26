import { Layout, LayoutBody } from "@/components/ui/layout";
import { getBranches, getDepartments, getUsers } from "./_lib/actions";
import { searchParamsCache } from "./_lib/validations";
import UsersTable from "./_components/users-table";
import { getValidFilters } from "@/lib/data-table";
import { SearchParams } from "@/types";
import { getRoles } from "../roles/_lib/actions";

interface UsersPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function UsersPage(props: UsersPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);
  const validFilters = getValidFilters(search.filters);

  const [users, departments, branches, roles] = await Promise.all([
    getUsers({
      ...search,
      filters: validFilters,
    }),
    getDepartments(),
    getBranches(),
    getRoles(),
  ]);

  const promises = Promise.resolve({ users, departments, branches, roles });

  return (
    <Layout>
      <LayoutBody>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground text-sm">Manage system users</p>
          </div>
          <UsersTable promises={promises} />
        </div>
      </LayoutBody>
    </Layout>
  );
}
