import Web3 from "web3";

const readContract = async (web3:Web3, address:string, abi:any, methodName:string, ...args:any) => {

  const methods = abi.filter((method:any) => method.name === methodName);

  const contract = new web3.eth.Contract(methods, address);

  console.log(address,methods,args);
  return contract.methods[methods[0].name](...args).call();
}

const newWeb3 = (provider:any) => {

  const web3:any = new Web3(provider);

  web3.ext = {
    readContract: async (address:string, abi:any, methodName:string, ...args:any) =>
      readContract(web3, address, abi, methodName, ...args),
  }

  return web3;
}

export default newWeb3;
