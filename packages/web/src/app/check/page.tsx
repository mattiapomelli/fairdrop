import { findMostRecentSparkLendTx } from "@/lib/axiom/parse-recent-tx";

interface PageProps {
  params: Params;
  searchParams: SearchParams;
}

interface Params {
  slug: string;
}

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export default async function Check({ searchParams }: PageProps) {
  const connected = (searchParams?.connected as string) ?? "";

  // Find the user's uniswap transaction with the `Swap` event
  // const uniswapTx = await findMostRecentUniswapTx(connected);
  const uniswapTx = await findMostRecentSparkLendTx(connected);
  console.log("txns: ", uniswapTx);

  const renderNotEligible = () => {
    return (
      <>
        <div className="text-center">You are not eligible :(</div>
      </>
    );
  };

  const renderEligible = () => {
    const log = uniswapTx?.log;
    const txHash = log?.transactionHash;
    const blockNumber = log?.blockNumber;
    const logIdx = uniswapTx?.logIdx;

    if (txHash === undefined || blockNumber === undefined || logIdx === undefined) {
      return renderNotEligible();
    }

    return <div className="text-center">{"Congratulations! You're eligible for the airdrop."}</div>;
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Check eligibility</h1>
      {uniswapTx !== null ? renderEligible() : renderNotEligible()}
    </>
  );
}
