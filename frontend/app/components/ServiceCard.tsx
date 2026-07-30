export interface ServiceCardProps {
  name: string;
  description: string;
}

export function ServiceCard({ name, description }: ServiceCardProps) {
  return (
    <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-white via-amber-50/70 to-lime-50/70 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(245,158,11,0.45)] dark:border-amber-400/30 dark:from-[#34240d] dark:via-[#24170b] dark:to-[#1d1408]">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-amber-50">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-amber-100/85">{description}</p>
    </div>
  );
}
