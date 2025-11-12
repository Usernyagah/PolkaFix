import { ethers } from 'ethers';
import { POLKAFIX_ABI } from '@/types/PolkaFix';

export const MOONBASE_CONTRACT =
  import.meta.env.VITE_CONTRACT_ADDRESS_MOONBASE || '0x0000000000000000000000000000000000000000';
export const MOONBEAM_CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS_MOONBEAM || MOONBASE_CONTRACT;
export const WDOT_MOONBASE =
  import.meta.env.VITE_WDOT_ADDRESS_MOONBASE || '0x0000000000000000000000000000000000000000';

export const WDOT_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
];

export function getPolkaFixContract(
  signerOrProvider: ethers.Signer | ethers.Provider,
  chainId: number
): ethers.Contract {
  const address = chainId === 1284 ? MOONBEAM_CONTRACT : MOONBASE_CONTRACT;
  return new ethers.Contract(address, POLKAFIX_ABI, signerOrProvider);
}

export function getWDotContract(
  signerOrProvider: ethers.Signer | ethers.Provider
): ethers.Contract {
  return new ethers.Contract(WDOT_MOONBASE, WDOT_ABI, signerOrProvider);
}
