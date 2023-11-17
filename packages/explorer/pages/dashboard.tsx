import Table from "@/components/common/Table";
import { TableData } from "@/types";
import { FC, useEffect, useState } from "react";

const Dashboard: FC = () => {
  const [lbData, setLbData] = useState<TableData>([]);
  const [ltData, setLtData] = useState<TableData>([]);

  const updateData = () => {
    const sessionBlocks = sessionStorage.getItem("blocks");
    if (sessionBlocks) setLbData(JSON.parse(sessionBlocks).slice(0, 5));

    const sessionTransactions = sessionStorage.getItem("transactions");
    if (sessionTransactions)
      setLtData(JSON.parse(sessionTransactions).slice(0, 5));
  };

  useEffect(() => {
    updateData();
    const intervalId = setInterval(updateData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Table
        title="Latest Blocks"
        headers={[
          "Height",
          "Timestamp",
          "Transactions",
          "Block Hash",
          "Block Reward (ΞTH)",
        ]}
        data={lbData}
        cellColors={["#00ccff", "", "", "#00ccff", ""]}
        link={"/block/"}
        viewMore={"blocks"}
      />

      <Table
        title="Latest Transactions"
        headers={["Transaction ID", "From", "To", "Value (ΞTH)", "Timestamp"]}
        data={ltData}
        cellColors={["#00ccff"]}
        link={"/tx/"}
        viewMore={"transactions"}
      />
    </>
  );
};

export default Dashboard;
