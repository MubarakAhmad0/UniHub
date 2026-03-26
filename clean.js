const fs = require('fs');
const dirs = [
  'app/(driver-app)', 'app/(mobile)', 'app/bye', 'app/florist', 'app/production-curation-kanban', 'app/print', 'app/tv',
  'app/dashboard/brand', 'app/dashboard/ceo-office', 'app/dashboard/cs', 'app/dashboard/hr', 'app/dashboard/logistic', 'app/dashboard/marketing', 'app/dashboard/production', 'app/dashboard/products', 'app/dashboard/retail', 'app/dashboard/sales', 'app/dashboard/scm', 'app/dashboard/tech',
];

for (const d of dirs) {
  try {
    if (fs.existsSync(d)) {
      fs.rmSync(d, { recursive: true, force: true });
      console.log(`Deleted ${d}`);
    }
  } catch (e) {
    console.error(`Failed to delete ${d}:`, e.message);
  }
}
