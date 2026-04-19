import ComingSoon from '@/components/shared/ComingSoon';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function TenantsPage() {
  return (
    <DashboardLayout>
      <ComingSoon 
        title="Tenant Management" 
        description="Streamline lease agreements, tenant onboarding, and communication portals with our automated tenant system."
      />
    </DashboardLayout>
  );
}
