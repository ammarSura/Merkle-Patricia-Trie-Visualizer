import { Network, Alchemy } from 'alchemy-sdk';
import { useRef } from 'react';

export default function useAlchemy() {
    const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY;
    if(!apiKey) throw new Error('Alchemy API key not found')
    const SETTINGS = {
        apiKey,
        network: Network.ETH_MAINNET,
    };
    const alchemy = new Alchemy(SETTINGS);
    const latestBlockRef = useRef<number | null>(null);

    const getLatestBlockNumber = async() => {
        if(latestBlockRef.current === null) {
            const latestBlock = await alchemy.core.getBlockNumber();
            latestBlockRef.current = latestBlock;
        }
        return latestBlockRef.current;
    }

    return {
        getLatestBlock: async () => {
            const latestBlockNumber = await getLatestBlockNumber();
            const block = await alchemy.core.getBlock(latestBlockNumber);
            return block;
        },
        getBlockTransactions: async () => {
            const latestBlockNumber = await getLatestBlockNumber();
            const block = await alchemy.core.getBlockWithTransactions(latestBlockNumber);
            return block.transactions;
        },
        getBlockTransactionReceipts: async () => {
            const latestBlockNumber = await getLatestBlockNumber();
            const block = await alchemy.core.getBlockWithTransactions(latestBlockNumber);
            const transactionReceipts = await Promise.all(block.transactions.slice(5).map(async (transaction) => {
                return await alchemy.core.getTransactionReceipt(transaction.hash);
            }));
            return transactionReceipts;
        }
    }


}
