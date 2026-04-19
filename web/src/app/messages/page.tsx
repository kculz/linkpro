import ComingSoon from '@/components/shared/ComingSoon';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function MessagesPage() {
  return (
    <DashboardLayout>
      <ComingSoon 
        title="Communications Hub" 
        description="Unified messaging for tenants, vendors, and property managers. Real-time notifications and chat systems are on the horizon."
      />
    </DashboardLayout>
  );
}
