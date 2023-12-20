import { vatAbi, vatAddress, vaultAbi, vaultAddress } from "./constants";
import { bytesToString, stringToBytes } from "@defisaver/tokens/esm/utils";
import { Cdp, CdpInfo } from "./types";
import { web3 } from "./web3";
import { Dispatch, SetStateAction } from "react";

export class CdpSearcher {
    private static readonly SEARCH_LIMIT = 5000;
    private static readonly RESULTS_NEEDED = 20;
    private static readonly RPC_LIMIT = 5;
    private collateralType: string;
    private targetCdpId: number;
    private updateResults: Dispatch<SetStateAction<CdpInfo>>;
    private setSearching: Dispatch<SetStateAction<boolean>>;
    private isActive = false;
    private localResults: CdpInfo;
    private l: number;
    private r: number;

    constructor(
        collateralType: string,
        targetCdpId: string,
        updateResults: Dispatch<SetStateAction<CdpInfo>>,
        setSearching: Dispatch<SetStateAction<boolean>>
    ) {
        this.collateralType = collateralType;
        this.targetCdpId = parseInt(targetCdpId);
        this.updateResults = updateResults;
        this.setSearching = setSearching;
        this.localResults = new CdpInfo("0");
        this.isActive = true;
        this.l = this.targetCdpId;
        this.r = this.targetCdpId + 1;
    }

    private async checkNext(): Promise<void> {
        const leftDiff = this.targetCdpId - this.l;
        const rightDiff = this.r - this.targetCdpId;

        let id = leftDiff < rightDiff ? this.l-- : this.r++;

        if (id < 0) {
            id = this.r++;
        }

        checkCdpId(this.collateralType, id.toString()).then((cdp) => {
            if (!this.isActive) return;
            if (this.localResults.cdpList.length >= CdpSearcher.RESULTS_NEEDED) {
                this.stop();
                return;
            }
            if (cdp !== null) {
                this.localResults.cdpList.push(cdp);
                this.updateResults(
                    new CdpInfo(
                        this.localResults.rate,
                        sortPositions(this.localResults.cdpList, this.targetCdpId)
                    )
                );
            }
            if (this.r - this.l >= CdpSearcher.SEARCH_LIMIT) {
                this.stop();
                return;
            }
            this.checkNext();
        });
    }

    public async start(): Promise<void> {
        this.setSearching(true);
        this.localResults.rate = await getDebtRate(this.collateralType);
        for (let i = 0; i < CdpSearcher.RPC_LIMIT; i++) {
            this.checkNext();
        }
    }

    public stop(): void {
        this.isActive = false;
        this.setSearching(false);
    }
}

const checkCdpId = async (collateralType: string, targetCdpId: string): Promise<Cdp | null> => {
    const vaultContract = new web3.eth.Contract(vaultAbi, vaultAddress);

    const cdp = await vaultContract.methods.getCdpInfo(targetCdpId).call();
    const ilk = bytesToString(cdp.ilk as string);

    if (ilk !== collateralType) {
        return null; // not the right collateral type
    }

    const collateralAmount = cdp.collateral.toString();
    const debtAmount = cdp.debt.toString();

    if (collateralAmount === "0" || debtAmount === "0") {
        return null; // not active
    }

    return new Cdp(targetCdpId, cdp.userAddr, collateralType, collateralAmount, debtAmount);
};

const getDebtRate = async (collateralType: string): Promise<string> => {
    const vatContract = new web3.eth.Contract(vatAbi, vatAddress);

    const ilkDetails = await vatContract.methods.ilks(stringToBytes(collateralType)).call();

    return ilkDetails.rate.toString();
};

const sortPositions = (positions: Cdp[], targetId: number): Cdp[] => {
    const customCompare = (a: Cdp, b: Cdp) =>
        Math.abs(parseInt(a.id) - targetId) - Math.abs(parseInt(b.id) - targetId);
    return positions.sort(customCompare);
};
