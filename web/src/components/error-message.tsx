interface Props {
  children?: any;
  text?: string;
}

const ErrorMessage = ({ children, text }: Props) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">
      {text}
      {children}
    </strong>
  </div>
);

export default ErrorMessage;
