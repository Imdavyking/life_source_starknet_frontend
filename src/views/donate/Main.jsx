/** @format */

import DarkModeSwitcher from "@/components/dark-mode-switcher/Main";
import { Link } from "react-router-dom";
import dom from "@left4code/tw-starter/dist/js/dom";
import logoUrl from "@/assets/images/logo.png";
import donateHeart from "@/assets/images/donate-heart.svg";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import {
  useAccount,
  useContract,
  useSendTransaction,
  useReadContract,
} from "@starknet-react/core";
import { PROTOCOL_ADDRESS } from "../../utils/constants";
import abi from "@/assets/json/abi.json";

function Main() {
  useEffect(() => {
    dom("body").removeClass("main").removeClass("error-page").addClass("login");
  }, []);
  const [isDonating, setIsDonating] = useState(false);
  const { address, account } = useAccount();
  const { contract } = useContract({
    abi,
    address: PROTOCOL_ADDRESS,
  });
  const { erc20Contract } = useContract({
    abi,
    address: PROTOCOL_ADDRESS,
  });

  const STRK_ADDR =
    "0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
  const ETH_ADDR =
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
  const [amount, setAmount] = useState("");
  const [cointype, setCoinType] = useState(STRK_ADDR);
  const {
    data: tokenAddress,
    error: points,
    refetch,
    fetchStatus,
    status,
  } = useReadContract({
    abi: abi,
    functionName: "token_address",
    address: PROTOCOL_ADDRESS,
    args: [],
    watch: true,
  });
  const {
    isError,
    error,
    data,
    sendAsync: donateToFoundation,
    isPending: isAddingLoading,
  } = useSendTransaction({
    calls:
      contract && address
        ? [contract.populate("donate_to_foundation", [cointype, amount])]
        : undefined,
  });
  const {
    isError: isErrorERC20,
    error: errorERC20,
    data: dataERC20,
    sendAsync: approveToken,
    isPending: isApprovingLoading,
  } = useSendTransaction({
    calls:
      erc20Contract && address
        ? [erc20Contract.populate("approve", [tokenAddress, amount])]
        : undefined,
  });

  const handleChange = (setState) => (e) => {
    setState(e.target.value);
  };
  const handleClick = async () => {
    if (amount === "") {
      toast.error("Please fill all fields");
    } else {
      try {
        console.log({ amount, tokenAddress, cointype });
        setIsDonating(true);

        const transactionAppr = await approveToken();
        if (transactionAppr?.transaction_hash) {
          console.log(
            "Transaction submitted:",
            transactionAppr.transaction_hash
          );
        }
        await account.waitForTransaction(transactionAppr.transaction_hash);
        const transaction = await donateToFoundation();
        if (transaction?.transaction_hash) {
          console.log("Transaction submitted:", transaction.transaction_hash);
        }
        await account.waitForTransaction(transaction.transaction_hash);
        toast.success("Points added successfully");
        setAmount("");
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsDonating(false);
      }
    }
  };

  return (
    <>
      <div>
        <DarkModeSwitcher />
        <div className="container sm:px-10">
          <div className="block xl:grid grid-cols-2 gap-4">
            <div className="hidden xl:flex flex-col min-h-screen">
              <a href="/" className="-intro-x flex items-center pt-5">
                <img alt="LifeSource" className="w-6" src={logoUrl} />
                <span className="text-white text-lg ml-3"> LifeSource </span>
              </a>
              <div className="my-auto">
                <img
                  alt="LifeSource"
                  className="-intro-x w-1/2 -mt-16"
                  src={donateHeart}
                />
                <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                  Donating <br />
                  will assist to recycle more waste.
                </div>
                <div className="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">
                  ...Blockchain-powered recycling solution
                </div>
              </div>
            </div>
            <div className="h-screen xl:h-auto flex flex-col items-center py-5 xl:py-0  xl:my-0">
              <a href="/" className="-intro-x flex items-center pt-5 my-2">
                <img alt="LifeSource" className="w-6" src={logoUrl} />
                <span className="text-white text-lg ml-3"> LifeSource </span>
              </a>
              <div className="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                  Donate to the foundation
                </h2>
                <div className="intro-x mt-2 text-slate-400 dark:text-slate-400 xl:hidden text-center">
                  ...Blockchain-powered recycling solution
                </div>
                <div className="intro-x mt-8">
                  <input
                    type="number"
                    value={amount}
                    step={1}
                    onChange={handleChange(setAmount)}
                    className="intro-x login__input form-control py-3 px-4 block"
                    placeholder="$10"
                  />
                </div>

                <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                  <button
                    className="btn btn-primary py-3 px-4 w-full xl:mr-3 align-top"
                    onClick={handleClick}
                    disabled={isDonating}
                  >
                    {isDonating ? (
                      <FaSpinner className="w-5 h-5 animate-spin" />
                    ) : (
                      "Donate"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
