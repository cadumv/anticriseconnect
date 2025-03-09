
interface CharacterCounterProps {
  current: number;
  max: number;
}

export const CharacterCounter = ({ current, max }: CharacterCounterProps) => {
  return (
    <p className="text-xs text-muted-foreground">
      {current}/{max} caracteres
    </p>
  );
};
