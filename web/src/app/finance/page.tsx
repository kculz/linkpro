import ComingSoon from '@/components/shared/ComingSoon';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function FinancePage() {
  return (
    <DashboardLayout>
      <ComingSoon 
        title="Financial Intelligence" 
        description="Track cash flow, property yields, and automated expense reporting. Your financial command center is currently being refined."
      />
    </DashboardLayout>
  );
}
