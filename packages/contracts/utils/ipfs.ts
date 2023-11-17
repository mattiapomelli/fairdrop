import { create } from "ipfs-http-client";

const ipfsUrl = process.env.IPFS_URL;

export async function uploadToIPFS(data: Record<string, unknown>) {
  const url = ipfsUrl || "https://ipfs.infura.io:5001";

  try {
    const ipfs = create({
      url,
      headers: {
        authorization: ipfsUrl
          ? ""
          : "Basic " +
            btoa(process.env.INFURA_ID + ":" + process.env.INFURA_SECRET),
      },
    });

    const result = await ipfs.add(JSON.stringify(data));
    return result.path;
  } catch (error) {
    console.error("IPFS error ", error);
  }
}
