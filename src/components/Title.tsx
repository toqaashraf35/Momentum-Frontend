// Title.tsx
interface TitleProps {
  title: string;
  subtitle?: string;
}

const Title = ({ title, subtitle }: TitleProps) => {
  return (
    <div className="flex flex-col mb-4">
      <h1 className="text-2xl font-bold mb-1 text-[var(--main)]">{title}</h1>
      {subtitle && (
        <span className="text-sm text-[var(--dim)]">{subtitle}</span>
      )}
    </div>
  );
};

export default Title;
