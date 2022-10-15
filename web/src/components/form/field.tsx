interface Props {
  error?: string;
  label?: string;
  name: string;
  id?: string;
  children?: JSX.Element | JSX.Element[];
}

const Field = ({ id, name, error, label, children }: Props) => {
  return (
    <div className="field">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="mt-1 relative rounded-md shadow-sm">{children}</div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${id || name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Field;
