import { Network, Alchemy } from 'alchemy-sdk';
import { useRef } from 'react';
const SETTINGS = {
    apiKey: "20tMln_P8mxBB4I8WV0__VkQbmLvHirI",
    network: Network.ETH_MAINNET,
};

export default function useAlchemy() {
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
