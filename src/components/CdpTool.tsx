import React, { useEffect, useRef, useState } from "react";
import DropdownSelection from "./DropdownSelection";
import { collateralOptions } from "../utils/constants";
import Form from "react-bootstrap/esm/Form";
import { useDebounce } from "../hooks/useDebounce";
import { CdpSearcher } from "../utils/helpers";
import { CdpInfo } from "../utils/types";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import { ListGroup } from "react-bootstrap";
import BigNumber from "bignumber.js";
import CdpView from "./CdpView";

interface CdpToolProps {
    isMetaMaskInstalled: boolean | null;
    selectedChainId: number | null;
}

const CdpTool: React.FC<CdpToolProps> = ({ isMetaMaskInstalled, selectedChainId }) => {
    const [selectedCollateral, setSelectedCollateral] = useState<string>(
        collateralOptions[0] || "No collateral types available"
    );
    const [roughCdpId, setRoughCdpId] = useState<string>();
    const debouncedCdpId = useDebounce(roughCdpId, 1000);
    const [cdpResults, setCdpResults] = useState<CdpInfo>(new CdpInfo("0"));
    const [searching, setSearching] = useState<boolean>(false);
    const searcher = useRef<CdpSearcher | null>(null);

    useEffect(() => {
        if (debouncedCdpId && debouncedCdpId !== "") {
            setCdpResults(new CdpInfo("0"));
            searcher.current?.stop();
            searcher.current = new CdpSearcher(
                selectedCollateral,
                debouncedCdpId,
                setCdpResults,
                setSearching
            );
            searcher.current.start();
        }
    }, [debouncedCdpId, selectedCollateral]);

    if (isMetaMaskInstalled === null || selectedChainId === null) {
        return (
            // return empty if metamask and chainId are not yet loaded
            <></>
        );
    }

    return (
        <div id="cdp-tool" className="d-flex flex-column align-items-center w-75 h-75 text-center">
            {!isMetaMaskInstalled && (
                <div className="alert alert-danger" role="alert">
                    Please install Metamask
                </div>
            )}
            {isMetaMaskInstalled && selectedChainId !== 1 && (
                <div className="alert alert-danger" role="alert">
                    Please switch to Ethereum Mainnet
                </div>
            )}
            {isMetaMaskInstalled && selectedChainId === 1 && (
                <>
                    <DropdownSelection
                        selectedValue={selectedCollateral}
                        onSelect={setSelectedCollateral}
                        options={collateralOptions}
                    />
                    <Form.Label className="mt-4">CDP Id</Form.Label>
                    <Form.Control
                        className="w-25"
                        onChange={(e) => setRoughCdpId(e.target.value)}
                        type="number"
                        min="0"
                    />
                    {searching && (
                        <ProgressBar
                            animated
                            className="w-50 mt-4 overflow-visible"
                            now={(cdpResults.cdpList.length / 20) * 100}
                            label={`${((cdpResults.cdpList.length / 20) * 100).toFixed(0)}%`}
                        />
                    )}
                    {cdpResults.cdpList.length > 0 && (
                        <>
                            <h5 className="mt-4">CDP List</h5>
                            <div className="mt-4 w-50 h-75 overflow-y-auto">
                                <ListGroup className="">
                                    {cdpResults.cdpList.map((result) => (
                                        <CdpView cdp={result} rate={cdpResults.rate} />
                                    ))}
                                </ListGroup>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default CdpTool;
