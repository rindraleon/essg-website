import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  OutlinedInput,
} from "@mui/material";

interface DynamicListFieldProps {
  label: string;
  itemPlaceholder: string;
  items: string[];
  error?: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
}

const DynamicListField = ({
  label,
  itemPlaceholder,
  items,
  error,
  onAdd,
  onRemove,
  onChange,
}: DynamicListFieldProps) => {
  return (
    <FormControl fullWidth error={!!error}>
      <div className="mb-2 flex items-center justify-between">
        <FormLabel className="!text-sm !font-medium !text-slate-700">
          {label}
        </FormLabel>

        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={onAdd}
          className="!normal-case"
        >
          Ajouter
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex items-start gap-2">
            <OutlinedInput
              fullWidth
              size="small"
              value={item}
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={`${itemPlaceholder} ${index + 1}`}
              className="!rounded-xl bg-white"
            />

            {items.length > 1 && (
              <IconButton
                size="small"
                color="error"
                onClick={() => onRemove(index)}
                className="!mt-1"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        ))}
      </div>

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
export default DynamicListField;