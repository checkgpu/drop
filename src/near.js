import {
    Near, Account, keyStores, utils, transactions, providers
} from 'near-api-js';
const nacl = require('tweetnacl');
const bs58 = require('bs58');

export const BOATLOAD_OF_GAS = "300000000000000";
export const TRUKLOAD_OF_GAS = "30000000000000";
export const ENOULOAD_OF_GAS = "1000000000000";
export const ONE_NEAR = "1000000000000000000000000";
export const TEN_CENT = "100000000000000000000000";
export const ONE_CENT = "10000000000000000000000";
export const ONE_MILL = "1000000000000000000000";

const getNetwork = function(networkId) {
    if (networkId == "testnet") {
        let keyPair = utils.key_pair.KeyPair.fromString(globalThis.env.SECKEY_TESTNET)
        let testnetKeystore = new keyStores.InMemoryKeyStore();
        testnetKeystore.setKey("testnet", globalThis.env.ACCOUNT_TESTNET, keyPair)
        const nearTestnet = new Near({
            networkId: 'testnet',
            nodeUrl: 'https://rpc.testnet.near.org',
            deps: {
                keyStore: testnetKeystore
            },
        });
        return nearTestnet
    } else {
        let keyPair = utils.key_pair.KeyPair.fromString(globalThis.env.SECKEY)
        let mainnetKeystore = new keyStores.InMemoryKeyStore();
        mainnetKeystore.setKey("mainnet", globalThis.env.ACCOUNT, keyPair)
        const nearMainnet = new Near({
            networkId: 'mainnet',
            nodeUrl: 'https://rpc.mainnet.near.org',
            deps: {
                keyStore: mainnetKeystore
            },
        });
        return nearMainnet
    }
}

export const send_near = async (receiverId, amount, networkId) => {
    if (!networkId)
        networkId = "mainnet"
    const near = getNetwork(networkId);
    try {
        const account = await near.account(globalThis.env.ACCOUNT);
        let res = await account.sendMoney(receiverId, amount)
        res = providers.getTransactionLastResult(res);
        return {error: "ok", result: res}
    } catch (err) {
        if (err.stack) {
            return {error: err.message, stack: err.stack}
        } else {
            return {error: err}
        }
    }
};

export const send_zod = async (receiverId, amount, networkId) => {
    if (!networkId)
        networkId = "mainnet"
    const near = getNetwork(networkId);
    try {
        const account = await near.account(globalThis.env.ACCOUNT);
        let res = await account.functionCall({
            contractId: "zod.near",
            methodName: "ft_transfer_preregister",
            args: {receiver_id: receiverId, amount: amount},
            gas: TRUKLOAD_OF_GAS,
            attachedDeposit: ONE_CENT,
        })
        res = providers.getTransactionLastResult(res);
        return {error: "ok", result: res}
    } catch (err) {
        if (err.stack) {
            return {error: err.message, stack: err.stack}
        } else {
            return {error: err}
        }
    }
};