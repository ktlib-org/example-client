import classNames from "classnames";
import { ButtonColor } from "core/constants";
import { useState } from "react";
import Icon, { Icons } from "./icon";

interface Props {
  text: string;
  icon?: Icons;
  onClick: () => any;
  color?: ButtonColor;
  autoSpinner?: boolean;
  submitting?: boolean;
  className?: string;
}

const Button = ({ text, icon, onClick, color, autoSpinner, submitting, className }: Props) => {
  const [running, setRunning] = useState(false);
  let c = color || "blue";

  const click = async () => {
    try {
      setRunning(true);
      await onClick();
    } catch (e) {
      throw e;
    } finally {
      setRunning(false);
    }
  };

  return (
    <button
      disabled={running || submitting}
      onClick={click}
      type="button"
      className={classNames(
        "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm py-2 w-full transition duration-150 ease-in",
        c == "gray" && "bg-gray-300 hover:bg-gray-400 focus:ring-gray-200 text-black",
        c == "blue" && "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white",
        c == "red" && "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
        c == "green" && "bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white",
        className,
      )}
    >
      {text}
      {icon && (
        <div className="h-5 w-5 ml-1">
          {submitting || (running && autoSpinner) ? <Icon name="Spinner" /> : <Icon name={icon} />}
        </div>
      )}
    </button>
  );
};

export default Button;
