import { useGetStudyMaterials } from '../../hooks/useQueries';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import MaterialCard from '../../components/shared/MaterialCard';

export default function MaterialsPage() {
  const { data: materials, isLoading } = useGetStudyMaterials();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Loading materials..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Study Materials</h1>
      </div>

      {materials && materials.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => (
            <MaterialCard key={material.id.toString()} material={material} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No materials available"
          description="Your teachers haven't uploaded any study materials yet"
        />
      )}
    </div>
  );
}
