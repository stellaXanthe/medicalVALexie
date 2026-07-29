export interface ServiceCardProps {
  name: string;
  description: string;
}

export function ServiceCard({ name, description }: ServiceCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}
