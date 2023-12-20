import React from "react";
import { Cdp } from "../utils/types";
import BigNumber from "bignumber.js";
import { ListGroup } from "react-bootstrap";

interface CdpViewProps {
    cdp: Cdp;
    rate: string;
}

const CdpView: React.FC<CdpViewProps> = ({ cdp, rate }) => {
    return (
        <ListGroup.Item
            key={cdp.id}
            className="w-100 d-flex flex-row justify-content-between align-items-center"
        >
            <div>CDP Id: {cdp.id}</div>
            <div className="d-flex flex-column">
                <div>
                    Collateral Amount:{" "}
                    {BigNumber(cdp.collateral)
                        .div(BigNumber(10).pow(18)) // hard coded 18 decimals
                        .toFixed(2)}{" "}
                    {cdp.collateralType}
                </div>
                <div>
                    Debt Amount:{" "}
                    {BigNumber(cdp.debt)
                        .multipliedBy(rate)
                        .div(BigNumber(10).pow(45)) // hard coded 18 + 27 decimals
                        .toFixed(2)}
                    {" DAI"}
                </div>
            </div>
        </ListGroup.Item>
    );
};

export default CdpView;
