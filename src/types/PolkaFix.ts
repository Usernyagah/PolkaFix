import { ethers } from 'ethers';

export interface Bounty {
  title: string;
  description: string;
  issueUrl: string;
  reward: bigint;
  submitter: string;
  fixPR: string;
  resolved: boolean;
  yesVotes: bigint;
  noVotes: bigint;
}

export interface BountyWithId extends Bounty {
  id: number;
}

export const POLKAFIX_ABI = [
  {
    inputs: [{ internalType: 'address', name: '_wDOT', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'title', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' },
    ],
    name: 'BountyPosted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'submitter', type: 'address' },
      { indexed: false, internalType: 'string', name: 'prLink', type: 'string' },
    ],
    name: 'FixSubmitted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'voter', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'approve', type: 'bool' },
    ],
    name: 'Voted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'winner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' },
    ],
    name: 'BountyResolved',
    type: 'event',
  },
  {
    inputs: [],
    name: 'bountyCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'bounties',
    outputs: [
      { internalType: 'string', name: 'title', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'string', name: 'issueUrl', type: 'string' },
      { internalType: 'uint256', name: 'reward', type: 'uint256' },
      { internalType: 'address payable', name: 'submitter', type: 'address' },
      { internalType: 'string', name: 'fixPR', type: 'string' },
      { internalType: 'bool', name: 'resolved', type: 'bool' },
      { internalType: 'uint256', name: 'yesVotes', type: 'uint256' },
      { internalType: 'uint256', name: 'noVotes', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'title', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'string', name: 'issueUrl', type: 'string' },
      { internalType: 'uint256', name: 'reward', type: 'uint256' },
    ],
    name: 'postBounty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'bountyId', type: 'uint256' },
      { internalType: 'string', name: 'prLink', type: 'string' },
    ],
    name: 'submitFix',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'bountyId', type: 'uint256' },
      { internalType: 'bool', name: 'approve', type: 'bool' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wDOT',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];
