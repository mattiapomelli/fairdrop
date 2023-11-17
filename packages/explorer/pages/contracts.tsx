import Table from "@/components/common/Table";
import { TableData } from "@/types";
import { FC, useEffect, useState } from "react";
import contracts from "@/config/contracts.json";

const Contracts: FC = () => {
  const tableData = Object.entries(contracts).map(([key, value]) => {
    return [key, value.address];
  });

  return (
    <Table
      title="Contracts"
      headers={["Contract Name", "Address"]}
      data={tableData}
      cellColors={["#00ccff"]}
      link={"/contract/"}
    />
  );
};

export default Contracts;
