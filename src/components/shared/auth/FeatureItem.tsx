export function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0">{icon}</div>
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-700">{title}</span> {description}
      </p>
    </div>
  );
}
