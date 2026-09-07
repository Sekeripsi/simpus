import { Breadcrumbs } from "../breadcrumbs";

export interface HeaderProps {
  title: string;
  description: string;
}

export const Header = ({ title, description }: HeaderProps) => {
  return (
    <div className="mb-6">
      <Breadcrumbs />
      <h1 className="text-4xl font-semibold text-slate-800">{title}</h1>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
  );
};
