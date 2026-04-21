import { Link } from 'react-router-dom';

interface LgpdCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

const LgpdCheckbox = ({ checked, onChange, error }: LgpdCheckboxProps) => {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 shrink-0 accent-primary cursor-pointer"
        />
        <span className="text-sm text-muted-foreground leading-relaxed">
          Li e concordo com a{' '}
          <Link
            to="/politica-de-privacidade"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Política de Privacidade
          </Link>{' '}
          da CNB e autorizo o uso dos meus dados para contato comercial.
        </span>
      </label>
      {error && (
        <p className="text-destructive text-xs mt-1 ml-7">{error}</p>
      )}
    </div>
  );
};

export default LgpdCheckbox;
