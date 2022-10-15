import classNames from "classnames";
import { ButtonColor } from "core/constants";
import { useState } from "react";
import Spinner from "./spinner";

interface Props {
  text: string;
  Icon?: React.ElementType;
  onClick: () => any;
  color?: ButtonColor;
  autoSpinner?: boolean;
  submitting?: boolean;
}

const Button = ({ text, Icon, onClick, color, autoSpinner, submitting }: Props) => {
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
        "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm",
        c == "gray" && "bg-gray-300 hover:bg-gray-400 focus:ring-gray-200 text-black",
        c == "blue" && "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white",
        c == "red" && "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
        c == "green" && "bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white",
      )}
    >
      {text}
      {Icon &&
        (submitting || (running && autoSpinner) ? (
          <div className="h-5 w-5 ml-1">
            <Spinner />
          </div>
        ) : (
          <Icon className="ml-0.5 -mr-1 h-5 w-5" aria-hidden="true" />
        ))}
    </button>
  );
};

export default Button;
