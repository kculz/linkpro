import ComingSoon from '@/components/shared/ComingSoon';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <ComingSoon 
        title="Settings & Configuration" 
        description="Personalize your LinkPro experience. Manage notifications, API keys, and platform preferences."
      />
    </DashboardLayout>
  );
}
