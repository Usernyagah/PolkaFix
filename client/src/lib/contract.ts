import { ethers } from 'ethers';
import { POLKAFIX_ABI } from '@/types/PolkaFix';

export const MOONBASE_CONTRACT =
  import.meta.env.VITE_CONTRACT_ADDRESS_MOONBASE || '0x0000000000000000000000000000000000000000';
export const MOONBEAM_CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS_MOONBEAM || MOONBASE_CONTRACT;
export const WDOT_MOONBASE =
  import.meta.env.VITE_WDOT_ADDRESS_MOONBASE || '0xd909178cC99D318E4d1390dc624800C34066dc6c';
export const WDOT_MOONBEAM =
  import.meta.env.VITE_WDOT_ADDRESS_MOONBEAM || '0x0000000000000000000000000000000000000000';

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
  signerOrProvider: ethers.Signer | ethers.Provider,
  chainId: number
): ethers.Contract {
  const wdotAddress = chainId === 1284 ? WDOT_MOONBEAM : WDOT_MOONBASE;
  if (!wdotAddress || wdotAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error(`wDOT contract address not configured for chain ID ${chainId}`);
  }
  return new ethers.Contract(wdotAddress, WDOT_ABI, signerOrProvider);
}
