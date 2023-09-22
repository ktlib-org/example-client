import { useInitialEffect } from "core/react-utils";
import { observer } from "mobx-react-lite";
import { setPageInfo } from "../utils/web-utils";

interface Props {
  name: string;
  title: string;
  children: JSX.Element | JSX.Element[];
}

const Page = observer(({ name, title, children }: Props) => {
  useInitialEffect(() => setPageInfo(name, title));

  return <div className="page">{children}</div>;
});

export default Page;
