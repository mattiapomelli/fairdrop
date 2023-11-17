import Link from "next/link";
import { FC } from "react";
import Subheading from "../common/Subheading";

interface Props {
  title: string;
  outputs: string[] | string;
}

const Outputs: FC<Props> = ({ title, outputs }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Subheading title={`${title}`} />
      <div className="flex flex-col gap-2">
        {Array.isArray(outputs) ? (
          outputs.map((output, index) => (
            <input
              key={index}
              className="w-full bg-background p-2 rounded-md"
              type="text"
              defaultValue={output}
            />
          ))
        ) : title !== "Output" ? (
          <Link href={`/tx/${outputs}`}>
            <input
              className="w-full bg-background p-2 rounded-md"
              type="text"
              defaultValue={outputs}
            />
          </Link>
        ) : (
          <input
            className="w-full bg-background p-2 rounded-md"
            type="text"
            defaultValue={outputs}
          />
        )}
      </div>
    </div>
  );
};

export default Outputs;
