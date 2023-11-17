import Dropdown from "@/components/address/Dropdown";
import Inputs from "@/components/address/Inputs";
import Outputs from "@/components/address/Outputs";
import Container from "@/components/common/Container";

import Subheading from "@/components/common/Subheading";
import { Abi, InitAbi } from "@/types/abi";
import { ParamInputs } from "@/types/input";

import {
  generateSuccess,
  isError,
  throwNotification,
} from "@/utils/notification";
import { transact } from "@/utils/transact";
import { useRouter } from "next/router";
import { FC, useState } from "react";

import contracts from "@/config/contracts.json";

const ContractPage: FC = () => {
  const router = useRouter();
  const { name } = router.query;

  const contractEntry = Object.entries(contracts).find(
    ([key, value]) => key === name
  );
  const contract = {
    name: contractEntry?.[0] || "Not Found",
    address: contractEntry?.[1].address || "0x",
    abi: contractEntry?.[1].abi || [],
  };

  const functions = contract.abi.filter(
    (item) => item.type === "function"
  ) as Abi[];

  const [selected, setSelected] = useState<Abi>(InitAbi);
  const [paramInput, setInputs] = useState<ParamInputs | []>([]);
  const [value, setValue] = useState("");
  const [outputs, setOutputs] = useState<string[] | string | undefined>();

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs({
      ...(paramInput as { [key: string]: string }),
      [name]: value,
    });
  };

  const submit = async () => {
    const res = await transact(
      paramInput,
      selected,
      contract.address,
      JSON.stringify(contract.abi),
      value
    );

    if (isError(res)) return throwNotification(res);

    throwNotification(generateSuccess("Transaction completed successfully!"));
    return setOutputs(res);
  };

  return (
    <Container title={contract.name}>
      <div className="mx-10 mt-6 flex flex-col gap-2">
        <Subheading title={"Contract Functions"} />
        <Dropdown
          selected={selected}
          parsedAbi={functions}
          setSelected={(selected) => {
            setOutputs([]);
            setInputs({});
            setSelected(selected);
          }}
        />
        {selected.stateMutability && (
          <div className="flex flex-col items-center gap-2 w-full">
            {selected.stateMutability === "payable" && (
              <input
                className="w-full bg-background p-2 rounded-md"
                type="number"
                placeholder={`Value (uint256)`}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValue(e.target.value)
                }
              />
            )}
            <Inputs
              title={"Inputs"}
              inputs={selected.inputs || []}
              handleInput={handleInput}
            />
            <button
              className={`w-full bg-lightaccent text-black p-2 font-bold rounded-md transition-all duration-300 cursor-pointer`}
              onClick={submit}
            >
              Submit
            </button>
            {outputs && (
              <Outputs
                title={
                  selected.stateMutability === "view"
                    ? "Output"
                    : "Transaction Hash"
                }
                outputs={outputs}
              />
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default ContractPage;
