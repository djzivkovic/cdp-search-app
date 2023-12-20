export class CdpInfo {
    rate: string;
    cdpList: Cdp[];
    constructor(rate: string, cdpList?: Cdp[]) {
        this.rate = rate;
        this.cdpList = [];
        if (cdpList) {
            this.cdpList = cdpList;
        }
    }
}

export class Cdp {
    id: string;
    userAddr: string;
    collateralType: string;
    collateral: string;
    debt: string;
    constructor(
        id: string,
        userAddr: string,
        collateralType: string,
        collateral: string,
        debt: string
    ) {
        this.id = id;
        this.userAddr = userAddr;
        this.collateralType = collateralType;
        this.collateral = collateral;
        this.debt = debt;
    }
}
