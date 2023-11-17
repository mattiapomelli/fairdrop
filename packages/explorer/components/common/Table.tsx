import { TableData } from "@/types";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC } from "react";
import Container from "./Container";

interface Props {
  title: string;
  headers: string[];
  data: TableData | [];
  link: string;
  cellColors?: string[];
  viewMore?: string;
  loadMore?: () => void;
}

const Table: FC<Props> = ({
  title,
  headers,
  data,
  link,
  cellColors = [],
  viewMore,
  loadMore,
}) => {
  const router = useRouter();

  const handleRowClick = (link: string) => router.push(link);

  return (
    <Container title={title}>
      <div className="w-full">
        <table className="w-full">
          <thead className="text-left text-outline">
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((rowData, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-t border-outline border-opacity-20 transition-all duration-300 hover:bg-white hover:bg-opacity-5 cursor-pointer`}
                onClick={() => handleRowClick(`${link}${rowData[0]}`)}
              >
                {rowData.map((cellData, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cellColors[cellIndex] ? "text-lightaccent" : ""}
                  >
                    {cellData.toString().length > 40
                      ? `${
                          cellData.toString().slice(0, 8) +
                          "..." +
                          cellData.toString().slice(-8)
                        }`
                      : cellData}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {viewMore && (
          <div
            className="w-full flex items-center justify-center mt-4 text-lightaccent cursor-pointer gap-1"
            onClick={() => handleRowClick(`/${viewMore}`)}
          >
            View more {viewMore}
            <Image
              src={"/icons/arrow.svg"}
              alt={"arrow-icon"}
              width={24}
              height={24}
            />
          </div>
        )}

        {loadMore && (
          <div
            className="w-full flex items-center justify-center mt-4 text-lightaccent cursor-pointer gap-1"
            onClick={loadMore}
          >
            Load more
            <Image
              src={"/icons/arrow.svg"}
              alt={"arrow-icon"}
              width={24}
              height={24}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default Table;
