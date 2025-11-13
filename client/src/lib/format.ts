import { ethers } from 'ethers';

export function formatDOT(wei: bigint): string {
  const formatted = ethers.formatEther(wei);
  const num = parseFloat(formatted);
  return `${num.toFixed(2)} DOT`;
}

export function parseDOT(dot: string): bigint {
  return ethers.parseEther(dot);
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getMoonscanLink(txHash: string, chainId: number): string {
  const base = chainId === 1284 
    ? 'https://moonscan.io' 
    : 'https://moonbase.moonscan.io';
  return `${base}/tx/${txHash}`;
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function getBountyStatus(bounty: {
  resolved: boolean;
  fixPR: string;
  yesVotes: bigint;
  noVotes: bigint;
}): string {
  if (bounty.resolved) return 'Resolved';
  if (!bounty.fixPR) return 'Open';
  const totalVotes = bounty.yesVotes + bounty.noVotes;
  if (totalVotes > 0n) return 'Voting';
  return 'Fix Submitted';
}

export function getVotePercentage(yesVotes: bigint, noVotes: bigint): number {
  const total = yesVotes + noVotes;
  if (total === 0n) return 0;
  return Number((yesVotes * 100n) / total);
}
