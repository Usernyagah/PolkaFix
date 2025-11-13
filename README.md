# PolkaFix - Decentralized Bug Bounty Platform

PolkaFix is a decentralized bug bounty platform built on Moonbeam that enables project maintainers to post bounties for fixing issues and rewards developers with wDOT tokens for successful fixes.

## 🌟 Overview

PolkaFix connects project maintainers with developers through a transparent, on-chain bounty system. Post issues, submit fixes, and get rewarded - all powered by smart contracts on Moonbeam.

## ✨ Features

- **Post Bounties**: Create bounties with wDOT rewards for fixing issues
- **Submit Fixes**: Developers can submit pull request links for bounties
- **Community Voting**: Decentralized voting system (minimum 3 votes, 70% approval required)
- **Automatic Payouts**: Rewards are automatically distributed when fixes are approved
- **Transparent**: All bounties, submissions, and votes are recorded on-chain
- **Moonbeam Integration**: Built on Moonbeam/Moonbase Alpha testnet

## 📋 Contract Information

### Deployed Contract (Moonbase Alpha)

- **Contract Address**: `0xD1d526991f180504e2eBEa41cCAdf4DB0F7Bf097`
- **Network**: Moonbase Alpha (Testnet)
- **Chain ID**: `1287`
- **Explorer**: [View on Moonscan](https://moonbase.moonscan.io/address/0xD1d526991f180504e2eBEa41cCAdf4DB0F7Bf097)
- **wDOT Token**: `0xd909178cC99D318E4d1390dc624800C34066dc6c`

### Contract Functions

- `postBounty(title, description, issueUrl, reward)` - Post a new bounty
- `submitFix(bountyId, prLink)` - Submit a fix for a bounty
- `vote(bountyId, approve)` - Vote on a submitted fix
- `bountyCount()` - Get total number of bounties

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MetaMask or compatible Web3 wallet
- Moonbase Alpha testnet configured in wallet
- DEV tokens for gas fees
- wDOT tokens for posting bounties

### Installation

```bash
# Clone the repository
git clone https://github.com/Usernyagah/PolkaFix.git
cd polkafix-dapp

# Install dependencies for both client and contracts
cd client && npm install
cd ../contracts && npm install
cd ..

# Start development server (from root or client directory)
cd client && npm run dev
```

## 🛠️ Technologies

This project is built with:

- **Frontend**: React, TypeScript, Vite
- **UI**: shadcn-ui, Tailwind CSS
- **Web3**: Wagmi, Viem, Web3Modal
- **Smart Contracts**: Solidity, Hardhat
- **Blockchain**: Moonbeam/Moonbase Alpha
- **Deployment**: Vercel (frontend)

## 💻 Development

### Project Structure

```
polkafix-dapp/
├── client/          # Frontend React application
│   ├── src/         # Source code
│   ├── public/      # Static assets
│   └── package.json # Client dependencies
├── contracts/       # Smart contracts
│   ├── PolkaFix.sol # Main contract
│   ├── scripts/     # Deployment scripts
│   └── package.json # Contract dependencies
└── README.md        # This file
```

### Local Development

To run the project locally:

```bash
# Install dependencies
cd client && npm install
cd ../contracts && npm install

# Start development server (from client directory)
cd client && npm run dev
```

The development server will start at `http://localhost:8080` with hot-reload enabled.

## Deploy to Testnet (Moonbase Alpha)

### Prerequisites

- Node.js installed
- A funded wallet with Moonbase Alpha DEV tokens
- wDOT tokens for posting bounties (get from faucet)
- Private key of deployer wallet

### Moonbase Alpha Testnet Information

- **RPC URL**: `https://moonbeam-alpha.api.onfinality.io/public` (Alternative: `https://rpc.api.moonbase.moonbeam.network`)
- **Chain ID**: `1287`
- **wDOT Address**: `0xd909178cC99D318E4d1390dc624800C34066dc6c`
- **PolkaFix Contract**: `0xD1d526991f180504e2eBEa41cCAdf4DB0F7Bf097`
- **Faucet**: https://apps.moonbeam.network/moonbase-alpha/faucet
- **Explorer**: https://moonbase.moonscan.io

### Step-by-Step Deployment

1. **Install Dependencies**
   ```bash
   cd contracts && npm install
   cd ../client && npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the `contracts/` directory:
   ```bash
   cd contracts
   # Create .env file with:
   PRIVATE_KEY=0xYourPrivateKeyHere
   MOONBASE_WDOT=0xd909178CC99d318e4D1390dC624800C34066DC6c
   MOONSCAN_API_KEY=your_api_key_optional
   ```

3. **Compile Contracts**
   ```bash
   cd contracts
   npm run compile
   # or
   npx hardhat compile
   ```

4. **Deploy Contract**
   ```bash
   cd contracts
   npm run deploy:moonbase
   # or
   npx hardhat run scripts/deploy.cjs --network moonbase
   ```
   This will:
   - Deploy PolkaFix contract to Moonbase Alpha
   - Save the contract address to `contracts/address.txt`
   - Update `client/.env.local` with the contract address

5. **Verify Contract** (Optional but recommended)
   ```bash
   cd contracts
   npm run verify:moonbase
   # or
   npx hardhat run scripts/verify.cjs --network moonbase
   ```

6. **Update Frontend Environment**
   The deployment script automatically updates `client/.env.local`. If you need to do it manually:
   ```bash
   cd client
   echo "VITE_CONTRACT_ADDRESS_MOONBASE=0xD1d526991f180504e2eBEa41cCAdf4DB0F7Bf097" > .env.local
   echo "VITE_WDOT_ADDRESS_MOONBASE=0xd909178cC99D318E4d1390dc624800C34066dc6c" >> .env.local
   ```

7. **Deploy Frontend**
   ```bash
   cd client
   npm run build
   vercel --prod
   ```


### Testing wDOT Faucet & Approval Flow

1. **Get Test wDOT**
   - Visit: https://moonbase.beamex.exchange/#/claim
   - Connect your wallet (MetaMask, Coinbase Wallet, or WalletConnect)
   - Make sure your wallet is on Moonbase Alpha network
   - Click "Claim" under wDOT to get test wDOT tokens

2. **Approve PolkaFix Contract**
   - Go to the wDOT contract on Moonscan: [0xd909178cC99D318E4d1390dc624800C34066dc6c](https://moonbase.moonscan.io/address/0xd909178cC99D318E4d1390dc624800C34066dc6c#writeContract)
   - Connect your wallet
   - Call `approve` function with:
     - `spender`: `0xD1d526991f180504e2eBEa41cCAdf4DB0F7Bf097` (PolkaFix contract address)
     - `amount`: Amount you want to approve (or max: `115792089237316195423570985008687907853269984665640564039457584007913129639935`)

3. **Post First Test Bounty**
   - Use the frontend to connect your wallet
   - Create a bounty with a small reward amount
   - Confirm the transaction

4. **Submit Fix & Vote**
   - Submit a fix PR link for the bounty
   - Have at least 3 different addresses vote (70% approval needed)
   - Once resolved, the submitter receives the reward

### Final Deployment Checklist

```bash
# 1. Setup
cd contracts && npm install
cd ../client && npm install
cd ../contracts
# → Create .env file with PRIVATE_KEY

# 2. Compile
npm run compile

# 3. Deploy
npm run deploy:moonbase
# → Copy address from output

# 4. Verify
npm run verify:moonbase

# 5. Update Frontend (if not auto-updated)
cd ../client
echo "VITE_CONTRACT_ADDRESS_MOONBASE=0xD1d526991f180504e2eBEa41cCAdf4DB0F7Bf097" > .env.local
echo "VITE_WDOT_ADDRESS_MOONBASE=0xd909178cC99D318E4d1390dc624800C34066dc6c" >> .env.local

# 6. Deploy Frontend
npm run build
vercel --prod
```

### Expected Output

After successful deployment, you should have:
- ✅ Contract deployed to Moonbase Alpha
- ✅ Contract verified on Moonscan
- ✅ Frontend `.env.local` updated with contract address
- ✅ Live frontend URL from Vercel
- ✅ Moonscan link to view contract

## 📖 How It Works

1. **Post a Bounty**: Project maintainers post bounties with wDOT rewards for fixing specific issues
2. **Submit Fixes**: Developers submit pull request links addressing the issues
3. **Community Voting**: At least 3 community members vote on the fix (yes/no)
4. **Automatic Resolution**: If 70% or more approve, the bounty is automatically resolved
5. **Reward Distribution**: The submitter receives the wDOT reward automatically

## 🔗 Links

- **Contract on Moonscan**: [0xD1d526991f180504e2eBEa41cCAdf4DB0F7Bf097](https://moonbase.moonscan.io/address/0xD1d526991f180504e2eBEa41cCAdf4DB0F7Bf097)
- **wDOT Token**: [0xd909178cC99D318E4d1390dc624800C34066dc6c](https://moonbase.moonscan.io/address/0xd909178cC99D318E4d1390dc624800C34066dc6c)
- **Moonbase Alpha Explorer**: https://moonbase.moonscan.io
- **Moonbeam Documentation**: https://docs.moonbeam.network

## 📝 Scripts

```bash
# Client (Frontend) - run from client/ directory
cd client
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Lint code

# Contracts - run from contracts/ directory
cd contracts
npm run compile         # Compile Solidity contracts
npm run deploy:moonbase # Deploy to Moonbase Alpha
npm run verify:moonbase # Verify contract on Moonscan
npm run check:wdot      # Check wDOT balance and contract info
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## ⚠️ Disclaimer

This is a testnet deployment. The contract is deployed on Moonbase Alpha testnet for testing purposes only. Do not use real funds on testnet contracts.
