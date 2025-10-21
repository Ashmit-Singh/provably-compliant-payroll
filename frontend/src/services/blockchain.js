// blockchain.js
// Enhanced blockchain audit system for verifiable payroll NFTs

import { BrowserProvider, Contract, sha256, toUtf8Bytes } from 'ethers';

// Example: Payroll NFT smart contract ABI and address (replace with real values)
const PAYROLL_NFT_ABI = [
  // Minimal ABI for minting and storing proof
  'function mintPayrollNFT(address to, string memory payrollBatchId, string memory complianceProof) public returns (uint256)',
  'function getPayrollNFT(uint256 tokenId) public view returns (string memory payrollBatchId, string memory complianceProof)',
];
const PAYROLL_NFT_ADDRESS = '0xYourPayrollNFTContractAddress';

/**
 * Generate a unique payroll NFT for a payroll batch
 * @param {string} payrollBatchId Unique batch identifier
 * @param {string} complianceProof Verifiable compliance proof (hash or encrypted)
 * @param {string} to Wallet address to receive NFT
 * @returns {Promise<number>} Token ID of minted NFT
 */
export async function mintPayrollNFT(payrollBatchId, complianceProof, to) {
  // Connect to Ethereum provider (Metamask, Infura, etc.)
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new Contract(PAYROLL_NFT_ADDRESS, PAYROLL_NFT_ABI, signer);
  const tx = await contract.mintPayrollNFT(to, payrollBatchId, complianceProof);
  const receipt = await tx.wait();
  // Extract tokenId from event logs (assumes event PayrollNFTMinted)
  const event = receipt.events?.find(e => e.event === 'PayrollNFTMinted');
  return event?.args?.tokenId.toNumber();
}

/**
 * Store compliance proof on-chain (as part of NFT minting)
 * @param {string} payrollBatchId
 * @param {string} complianceProof
 * @param {string} to
 * @returns {Promise<number>} Token ID
 */
export async function storeComplianceProof(payrollBatchId, complianceProof, to) {
  return mintPayrollNFT(payrollBatchId, complianceProof, to);
}

/**
 * Auditor access portal: fetch payroll NFT and verify proof
 * @param {number} tokenId
 * @returns {Promise<{payrollBatchId, complianceProof}>}
 */
export async function getPayrollNFT(tokenId) {
  const provider = new BrowserProvider(window.ethereum);
  const contract = new Contract(PAYROLL_NFT_ADDRESS, PAYROLL_NFT_ABI, provider);
  const [payrollBatchId, complianceProof] = await contract.getPayrollNFT(tokenId);
  return { payrollBatchId, complianceProof };
}

/**
 * Privacy: Only store hashes or encrypted proofs on-chain
 * @param {string} proofData
 * @returns {string} Hashed or encrypted proof
 */
export function createPrivateProof(proofData) {
  // Example: SHA-256 hash (replace with real encryption as needed)
  return sha256(toUtf8Bytes(proofData));
}
