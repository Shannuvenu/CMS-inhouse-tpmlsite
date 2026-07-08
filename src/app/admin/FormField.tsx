const INPUT_CLASS = "mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-zinc-700">{children}</label>;
}

export function TextField({
  label,
  className,
  ...props
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input {...props} className={className ? `${INPUT_CLASS} ${className}` : INPUT_CLASS} />
    </div>
  );
}

export function TextAreaField({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <textarea {...props} className={INPUT_CLASS} />
    </div>
  );
}

export function SelectField({
  label,
  className,
  children,
  ...props
}: { label: string; className?: string; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select {...props} className={className ? `${INPUT_CLASS} ${className}` : INPUT_CLASS}>
        {children}
      </select>
    </div>
  );
}
