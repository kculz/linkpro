import ComingSoon from '@/components/shared/ComingSoon';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function MaintenancePage() {
  return (
    <DashboardLayout>
      <ComingSoon 
        title="Maintenance & Operations" 
        description="Automated maintenance scheduling and vendor management. We're finalizing the ticket assignment logic for a 2026 launch."
      />
    </DashboardLayout>
  );
}
