import Dropdown from "@/components/address/Dropdown";
import Inputs from "@/components/address/Inputs";
import Outputs from "@/components/address/Outputs";
import Container from "@/components/common/Container";
import GridItem from "@/components/common/GridItem";
import Subheading from "@/components/common/Subheading";
import { Address } from "@/types";
import { Abi, InitAbi } from "@/types/abi";
import { ParamInputs } from "@/types/input";
import { copyToClipboard } from "@/utils/copy";
import {
  generateSuccess,
  isError,
  throwNotification,
} from "@/utils/notification";
import { parseNewAbi } from "@/utils/parse";
import { prettyPrint } from "@/utils/pretty";
import { transact } from "@/utils/transact";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";

const Address: FC = () => {
  const router = useRouter();
  const { address } = router.query;

  const [selected, setSelected] = useState<Abi>(InitAbi);
  const [paramInput, setInputs] = useState<ParamInputs | []>([]);
  const [value, setValue] = useState("");
  const [outputs, setOutputs] = useState<string[] | string | undefined>();

  const [addr, setAddr] = useState<Address>();
  const [abi, setAbi] = useState("");
  const [abiPanel, setAbiPanel] = useState(true);
  const [parsedAbi, setParsedAbi] = useState<Abi[]>();

  useEffect(() => setParsedAbi(undefined), []);

  useEffect(() => {
    if (address) {
      const sessionAbi = sessionStorage.getItem(address as string);
      if (sessionAbi) {
        const parsedAbi = JSON.parse(sessionAbi) as Abi[];

        setParsedAbi(parsedAbi);
        setAbi(prettyPrint(JSON.stringify(parsedAbi)));
        setAbiPanel(false);
      }
      // if (sessionAbi) setParsedAbi(sessionAbi as unknown as Abi[])

      fetch(`/api/address?address=${address}`)
        .then((response) => response.json())
        .then((data: Address) => {
          setAddr(data);
        })
        .catch((error) => console.error(error));
    }
  }, [address]);

  useEffect(() => {
    setInputs([]);
    setValue("");
    setOutputs(undefined);
  }, [selected]);

  const canSubmit = useMemo(() => {
    if (
      selected.inputs?.length !== Object.keys(paramInput).length ||
      Object.values(paramInput).some((value) => value === "") ||
      (selected.stateMutability === "payable" && value === "")
    )
      return false;
    return true;
  }, [paramInput, selected, value]);

  const onAbiChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const parsed = parseNewAbi(e.target.value);
    if (parsed) {
      const sessionAbi = sessionStorage.getItem(address as string);

      if (!sessionAbi)
        sessionStorage.setItem(address as string, JSON.stringify(parsed));
    }
    setParsedAbi(parsed);
    setAbi(prettyPrint(e.target.value));
  };

  const toggleAbiPanel = () => setAbiPanel(!abiPanel);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs({
      ...(paramInput as { [key: string]: string }),
      [name]: value,
    });
  };

  // const parseEther = (index: string) => {
  //   if (Array.isArray(paramInput)) return

  //   const value = paramInput[index]
  //   setInputs({
  //     ...(paramInput as ParamInputs),
  //     [index]: value + '0'.repeat(18),
  //   })
  // }

  const submit = async () => {
    const res = await transact(
      paramInput,
      selected,
      address as string,
      abi,
      value
    );

    if (isError(res)) return throwNotification(res);

    throwNotification(generateSuccess("Transaction completed successfully!"));
    return setOutputs(res);
  };

  return (
    <Container
      title={`${
        addr && addr.bytecode.length > 2 ? "Contract" : "Address"
      } Details`}
    >
      {addr && (
        <div className="grid grid-cols-[auto,minmax(0px,1fr)] gap-x-8 gap-y-3 mx-10">
          <GridItem title={"Address"}>
            <div className="flex items-center gap-2">
              <p>{addr.address}</p>
              <Image
                className="cursor-pointer"
                src={"/icons/copy.svg"}
                alt={"copy-icon"}
                height={20}
                width={20}
                onClick={() => copyToClipboard(address as string)}
              />
            </div>
          </GridItem>
          <GridItem title={"Balance"}>
            <div className="flex items-center gap-2">
              <p>{addr.balance} ETH</p>
            </div>
          </GridItem>
          <GridItem title={"Transactions"}>
            <div className="flex items-center gap-2">
              <p>{addr.transactionCount}</p>
            </div>
          </GridItem>
        </div>
      )}
      {addr && addr.bytecode.length > 2 && (
        <div className="mx-10 mt-6 flex flex-col gap-2">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={toggleAbiPanel}
          >
            <Subheading title={"Contract ABI"} />
            <p className="border-b border-dotted text-lightaccent">
              {!abiPanel ? "Edit" : "Close"}
            </p>
          </div>
          <textarea
            className={`w-full resize-none bg-background rounded-md transition-all duration-300 ${
              abiPanel ? "p-2 h-[300px]" : "p-0 h-0"
            }`}
            value={abi}
            onChange={onAbiChange}
          />
        </div>
      )}
      {parsedAbi && (
        <div className="mx-10 mt-6 flex flex-col gap-2">
          <Subheading title={"Contract Functions"} />
          <Dropdown
            selected={selected}
            parsedAbi={parsedAbi}
            setSelected={setSelected}
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
                className={`w-full bg-lightaccent text-black p-2 font-bold rounded-md transition-all duration-300 ${
                  canSubmit
                    ? "cursor-pointer"
                    : "cursor-not-allowed bg-opacity-50"
                }`}
                onClick={canSubmit ? submit : undefined}
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
      )}
    </Container>
  );
};

export default Address;
