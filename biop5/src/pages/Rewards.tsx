import * as React from "react";
import styled from "styled-components";
import { callBIOPBalance} from "../helpers/web3";


import {  convertAmountFromRawNumber } from 'src/helpers/bignumber';

const SRewards = styled.div`
    width:100%;
    height:100%;
`
const SHelper = styled.div`
    font-size: x-small;
`

interface IRewardsProps {
    address: string
    chainId: number
    web3: any
}


interface IRewardsState {
    address: string;
    web3: any;
    chainId: number;
    pendingRequest: boolean;
    error: string;
    biopBalance: number;
}

const INITIAL_STATE: IRewardsState = {
    address: "",
    web3: null,
    chainId: 1,
    pendingRequest: false,
    error: "",
    biopBalance: 0,
};
class Stake extends React.Component<any, any> {
    // @ts-ignore
    public state: IRewardsState;

    constructor(props: IRewardsProps) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
        this.state.web3 = props.web3;
        this.state.address = props.address;
        this.state.chainId = props.chainId;
    }

    public componentDidMount() {
        this.getAvailableClaims();
    }

    public async getAvailableClaims() {
        const {chainId, web3, address} = this.state;
        
        const biopBalance = await callBIOPBalance(address, chainId, web3);


            // tslint:disable-next-line:no-console
            console.log("presend");
            // tslint:disable-next-line:no-console
            console.log(biopBalance);
        this.setState({biopBalance})
    }

    

    


  
   


    public render() {
        const {biopBalance} = this.state;
        return(
            <SRewards>

                <h1>Rewards</h1>
                <p>BIOP governance tokens you've earned for utilizing the protocol</p>
                <p>Available: <b>{convertAmountFromRawNumber(biopBalance, 18)} BIOP</b></p>
                <br/>
                <SHelper >Goverance Functionalities will be available on this page soon.</SHelper>
               

               
            </SRewards>

        )
    }

}

export default Stake