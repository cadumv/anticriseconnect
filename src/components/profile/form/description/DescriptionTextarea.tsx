
import { Textarea } from "@/components/ui/textarea";
import { CharacterCounter } from "../../CharacterCounter";

interface DescriptionTextareaProps {
  description: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  rows?: number;
}

export const DescriptionTextarea = ({
  description,
  onChange,
  maxLength = 250,
  placeholder = "Descreva brevemente sua experiência e atuação profissional",
  rows = 3
}: DescriptionTextareaProps) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Limit to maxLength characters
    if (value.length <= maxLength) {
      onChange(value);
    }
  };

  return (
    <div className="grid gap-2">
      <Textarea
        value={description}
        onChange={handleTextChange}
        placeholder={`${placeholder} (máximo ${maxLength} caracteres)`}
        rows={rows}
        maxLength={maxLength}
      />
      <div className="flex justify-end">
        <CharacterCounter current={description.length} max={maxLength} />
      </div>
    </div>
  );
};
