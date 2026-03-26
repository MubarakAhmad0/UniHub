const fs = require('fs');
const dirs = [
  'app/(driver-app)', 'app/(mobile)', 'app/bye', 'app/florist', 'app/production-curation-kanban', 'app/print', 'app/tv',
  'app/dashboard/brand', 'app/dashboard/ceo-office', 'app/dashboard/cs', 'app/dashboard/hr', 'app/dashboard/logistic', 'app/dashboard/marketing', 'app/dashboard/production', 'app/dashboard/products', 'app/dashboard/retail', 'app/dashboard/sales', 'app/dashboard/scm', 'app/dashboard/tech',
  'db/schema/inventory', 'db/schema/item-management', 'db/schema/logistics', 'db/schema/misc', 'db/schema/notifications', 'db/schema/order-management', 'db/schema/productions', 'db/schema/products',
  'lib/aws', 'lib/fulfillment', 'lib/lalamove', 'lib/notification', 'lib/tiktok-shop',
  'app/api/bc', 'app/api/cron', 'app/api/curations', 'app/api/events', 'app/api/florist', 'app/api/logistics', 'app/api/manual-order', 'app/api/orders', 'app/api/sales-invoice', 'app/api/stock-tracker', 'app/api/tech', 'app/api/test', 'app/api/tiktok', 'app/api/tiktok-order', 'app/api/virtual-order-tool', 'app/api/webhook', 'app/api/webhooks', 'app/api/whatsapp', 'app/api/wip-post-assembly-ao', 'app/api/wip-production'
];

for (const d of dirs) {
  try {
    fs.rmSync(d, { recursive: true, force: true });
    console.log(`Deleted ${d}`);
  } catch (e) {
    console.error(`Failed to delete ${d}:`, e.message);
  }
}

const files = ['lib/tiktok-session.ts'];
for (const f of files) {
  try {
    fs.rmSync(f, { force: true });
    console.log(`Deleted ${f}`);
  } catch (e) {
    console.error(`Failed to delete ${f}:`, e.message);
  }
}
