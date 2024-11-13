import { ethers } from 'ethers';

const contractAddress = '';
const contractABI = 

export const getContract = (signer: ethers.Signer) => {
  return new ethers.Contract(contractAddress, contractABI, signer);
};

export const registerUsername = async (signer: ethers.Signer, username: string) => {
  const contract = getContract(signer);
  const tx = await contract.registerUsername(username);
  await tx.wait();
};

export const sendToAddress = async (signer: ethers.Signer, recipient: string, amount: string) => {
  const contract = getContract(signer);
  const tx = await contract.sendToAddress(recipient, { value: ethers.utils.parseEther(amount) });
  await tx.wait();
};

export const sendToUsername = async (signer: ethers.Signer, username: string, amount: string) => {
  const contract = getContract(signer);
  const tx = await contract.sendToUsername(username, { value: ethers.utils.parseEther(amount) });
  await tx.wait();
};

export const claimTransferByAddress = async (signer: ethers.Signer, senderAddress: string) => {
  const contract = getContract(signer);
  const tx = await contract.claimTransferByAddress(senderAddress);
  await tx.wait();
};

export const claimTransferByUsername = async (signer: ethers.Signer, senderUsername: string) => {
  const contract = getContract(signer);
  const tx = await contract.claimTransferByUsername(senderUsername);
  await tx.wait();
};

export const claimTransferById = async (signer: ethers.Signer, transferId: string) => {
  const contract = getContract(signer);
  const tx = await contract.claimTransferById(transferId);
  await tx.wait();
};

export const refundTransfer = async (signer: ethers.Signer, transferId: string) => {
  const contract = getContract(signer);
  const tx = await contract.refundTransfer(transferId);
  await tx.wait();
};

export const getUserTransfers = async (signer: ethers.Signer, userAddress: string) => {
  const contract = getContract(signer);
  return await contract.getUserTransfers(userAddress);
};

export const getTransferDetails = async (signer: ethers.Signer, transferId: string) => {
  const contract = getContract(signer);
  return await contract.getTransferDetails(transferId);
};

export const getUserByUsername = async (signer: ethers.Signer, username: string) => {
  const contract = getContract(signer);
  return await contract.getUserByUsername(username);
};

export const getUserByAddress = async (signer: ethers.Signer, address: string) => {
  const contract = getContract(signer);
  return await contract.getUserByAddress(address);
};

// Define a type for the Transfer Event
interface TransferEvent {
	type: 'TransferInitiated' | 'TransferClaimed' | 'TransferRefunded';
	transferId: string;
	sender?: string; // Optional because it may not be present for all event types
	recipient?: string; // Optional because it may not be present for all event types
	amount: string;
	event: ethers.Event;
  }
  
  // Update the listenForTransferEvents function
  export const listenForTransferEvents = (
	signer: ethers.Signer,
	callback: (event: TransferEvent) => void
  ) => {
	const contract = getContract(signer);
	
	contract.on('TransferInitiated', (transferId: string, sender: string, recipient: string, amount: ethers.BigNumber, event: ethers.Event) => {
	  callback({
		type: 'TransferInitiated',
		transferId,
		sender,
		recipient,
		amount: ethers.utils.formatEther(amount),
		event,
	  });
	});
	
	contract.on('TransferClaimed', (transferId: string, recipient: string, amount: ethers.BigNumber, event: ethers.Event) => {
	  callback({
		type: 'TransferClaimed',
		transferId,
		recipient,
		amount: ethers.utils.formatEther(amount),
		event,
	  });
	});
	
	contract.on('TransferRefunded', (transferId: string, sender: string, amount: ethers.BigNumber, event: ethers.Event) => {
	  callback({
		type: 'TransferRefunded',
		transferId,
		sender,
		amount: ethers.utils.formatEther(amount),
		event,
	  });
	});
	
	return () => {
	  contract.removeAllListeners();
	};
  };
  