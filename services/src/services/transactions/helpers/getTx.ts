const abi = [{
  "inputs": [],
  "name": "decimals",
  "outputs": [
    {
      "internalType": "uint8",
      "name": "",
      "type": "uint8"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}];

const decimals = async (web3:any, address:string) => {

  const contract = new web3.eth.Contract(abi, address);

  return contract.methods[abi[0].name]().call();
}

export default async (web3:any, hash:any) => {

  hash = hash.toLowerCase();

  const txPromise = web3.eth.getTransaction(hash)

  const receiptPromise = web3.eth.getTransactionReceipt(hash);

  const [ tx, receipt ] =  await Promise.all([txPromise, receiptPromise]);

  const block = await web3.eth.getBlock(tx.blockNumber);

  const { blockNumber, from, to, value, gasPrice, gas, nonce, input } = tx;
  const { status, gasUsed, logs } = receipt;
  const { timestamp } = block;

  const methodID = input.substring(0, 10);

  const tokensDecimals = new Map();

  const tokens_transfers = logs.filter((log:any) => log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef').map((log:any) => {

    tokensDecimals.set(log.address.toLowerCase(), 0);

    return {
      token_address: log.address.toLowerCase(),
      from_address: log.topics[1].toLowerCase().replace('0x000000000000000000000000','0x'),
      to_address: log.topics[2].toLowerCase().replace('0x000000000000000000000000','0x'),
      value: log.data,
      log_index: log.logIndex
    }
  });

  await Promise.all(Array.from(tokensDecimals.keys()).map(async (token:any) => {
    tokensDecimals.set(token, await decimals(web3, token));
  }))

  tokens_transfers.forEach((token_transfer:any) => {
    token_transfer.value = token_transfer.value / (10 ** tokensDecimals.get(token_transfer.token_address));
  });

  return {
    hash,
    status: status ? 1 : 0,
    block_number: blockNumber,
    block_timestamp: timestamp,
    from: from.toLowerCase(),
    to: to.toLowerCase(),
    value,
    gas: web3.utils.fromWei(web3.utils.toBN(gasPrice).mul(web3.utils.toBN(gasUsed))),
    gas_limit: gas,
    gas_used: gasUsed,
    gas_price: web3.utils.fromWei(gasPrice),
    nonce,
    input,
    methodID,
    logs: logs.map((log:any) => {
      return {
        log_index: log.logIndex,
        address: log.address.toLowerCase(),
        topics: log.topics,
        data: log.data
      }
    }),
    tokens_transfers
  }
}
