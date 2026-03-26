import Items from "./_components/items";
import { getItems } from "./_lib/queries";
import { AlertCircle } from "lucide-react";

interface ProcessStockTransferPageProps {
  params: Promise<{ id: string }>;
}

const ProcessStockTransferPage = async (
  props: ProcessStockTransferPageProps,
) => {
  const params = await props.params;
  const stockTransferId = parseInt(params.id);
  const res = await getItems(stockTransferId);

  if (res.error) {
    throw new Error(res.error);
  }

  const data = res.data;

  return (
    <>
      <div className="space-y-2">
        <h1 className="px-4">Processing ST{stockTransferId}</h1>
        {!data?.length ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="text-lg">No items found</p>
          </div>
        ) : (
          <Items data={data} />
        )}
      </div>
    </>
  );
};

export default ProcessStockTransferPage;
