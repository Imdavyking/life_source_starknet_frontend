import ScrollToTop from "@/base-components/scroll-to-top/Main";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Router from "./router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createContext, useContext, useState } from "react";
import { StarknetProvider } from "./components/StarknetProvider";

function App() {
  return (
    <StarknetProvider>
      <RecoilRoot>
        <ToastContainer />
        <BrowserRouter>
          <Router />
          <ScrollToTop />
        </BrowserRouter>
      </RecoilRoot>
    </StarknetProvider>
  );
}

export function getFirstAndLast4Chars(str) {
  if (!str) return null;

  if (str.length <= 8) {
    return str; // If the string is too short, return it as is
  }
  return `${str.slice(0, 4)}...${str.slice(-4)}`;
}

export default App;
