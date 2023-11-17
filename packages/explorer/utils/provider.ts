import { ethers } from "ethers";

export const getLocalProvider = () =>
  new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
