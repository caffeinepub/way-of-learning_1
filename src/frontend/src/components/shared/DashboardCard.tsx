import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  description,
  variant = 'default',
}: DashboardCardProps) {
  const variantColors = {
    default: 'text-primary',
    success: 'text-green-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  };

  const variantBg = {
    default: 'bg-primary/10',
    success: 'bg-green-50 dark:bg-green-950',
    warning: 'bg-amber-50 dark:bg-amber-950',
    info: 'bg-blue-50 dark:bg-blue-950',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-full p-2 ${variantBg[variant]}`}>
          <Icon className={`h-4 w-4 ${variantColors[variant]}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
