"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IUniswapV3SwapCallback__factory = void 0;
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [
            {
                internalType: "int256",
                name: "amount0Delta",
                type: "int256",
            },
            {
                internalType: "int256",
                name: "amount1Delta",
                type: "int256",
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
        ],
        name: "uniswapV3SwapCallback",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
class IUniswapV3SwapCallback__factory {
    static createInterface() {
        return new ethers_1.utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
IUniswapV3SwapCallback__factory.abi = _abi;
exports.IUniswapV3SwapCallback__factory = IUniswapV3SwapCallback__factory;