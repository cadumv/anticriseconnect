
interface DescriptionHelperTextProps {
  hasEngType: boolean;
}

export const DescriptionHelperText = ({ hasEngType }: DescriptionHelperTextProps) => {
  if (hasEngType) return null;
  
  return (
    <p className="text-xs text-muted-foreground">
      Selecione um tipo de engenharia para usar a assistência de IA
    </p>
  );
};
