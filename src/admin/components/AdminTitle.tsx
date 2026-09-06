interface Props {
  title: string;
  description: string;
}
export const AdminTitle = ({ title, description }: Props) => {
  return (
    <div>
      <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
