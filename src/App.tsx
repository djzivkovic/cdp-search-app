import React, { useEffect, useState } from "react";
import "./App.css";
import CdpTool from "./components/CdpTool";
import { injectedProvider, isInjectedProvider, web3 } from "./utils/web3";

function App() {
    const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean | null>(null);
    const [selectedChainId, setSelectedChainId] = useState<number | null>(null);

    useEffect(() => {
        setIsMetamaskInstalled(isInjectedProvider);
        if (isInjectedProvider) {
            web3.eth.getChainId().then((chainId) => setSelectedChainId(Number(chainId)));
            if (web3.provider) {
                web3.provider.on("chainChanged", (chainId) => {
                    setSelectedChainId(Number(chainId));
                });
            }
            return () => {
                if (web3?.provider) {
                    web3.provider.removeListener("chainChanged", () => {});
                }
            };
        } else {
            setSelectedChainId(-1);
        }
    }, []);

    useEffect(() => {
        if (selectedChainId !== null && selectedChainId !== 1 && selectedChainId !== -1) {
            injectedProvider
                .request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x1" }],
                })
                .then(() => {
                    setSelectedChainId(1);
                })
                .catch((error: unknown) => {
                    console.error(error);
                });
        }
    }, [selectedChainId]);

    return (
        <div className="App">
            <CdpTool isMetaMaskInstalled={isMetamaskInstalled} selectedChainId={selectedChainId} />
        </div>
    );
}

export default App;
