# PolkaFix Deployment Guide

Complete guide for deploying PolkaFix.sol to Moonbase Alpha testnet.

## Quick Start

```bash
# 1. Install dependencies
cd contracts && npm install
cd ../client && npm install

# 2. Set up environment (in contracts/ directory)
cd ../contracts
# Create .env file with PRIVATE_KEY, MOONBASE_WDOT, etc.

# 3. Deploy
npm run deploy:moonbase

# 4. Verify
npm run verify:moonbase

# 5. Build and deploy frontend
cd ../client
npm run build && vercel --prod
```

## Detailed Steps

### 1. Prerequisites

- **Node.js** (v18 or higher)
- **Funded wallet** with Moonbase Alpha DEV tokens
- **wDOT tokens** for posting bounties
- **Private key** of deployer wallet (keep secure!)

### 2. Environment Setup

Create `.env` file in the `contracts/` directory:

```bash
cd contracts
# Create .env file manually or copy from .env.example if it exists
```

Required variables:
```env
PRIVATE_KEY=0xYourPrivateKeyHere
MOONBASE_WDOT=0xd909178cC99D318E4d1390dc624800C34066dc6c
MOONSCAN_API_KEY=your_api_key_optional
```

**⚠️ Security Note**: Never commit `.env` to version control!

### 3. Compile Contracts

```bash
cd contracts
npm run compile
```

This compiles the PolkaFix.sol contract and generates artifacts.

### 4. Deploy to Moonbase Alpha

```bash
cd contracts
npm run deploy:moonbase
```

The deployment script will:
- Deploy PolkaFix contract with wDOT address
- Save contract address to `contracts/address.txt`
- Automatically update `client/.env.local` for frontend

**Expected Output:**
```
Deploying contracts with the account: 0x...
Account balance: ...
PolkaFix deployed to: 0x...
Updated client/.env.local with contract address
```

### 5. Verify Contract

```bash
cd contracts
npm run verify:moonbase
```

This verifies the contract on Moonscan. You can view it at:
[0xD1d526991f180504e2eBEa41cCAdf4DB0F7Bf097](https://moonbase.moonscan.io/address/0xD1d526991f180504e2eBEa41cCAdf4DB0F7Bf097)

### 6. Update Frontend Environment

The deployment script automatically updates `client/.env.local`. If you need to do it manually:

```bash
cd client
echo "VITE_CONTRACT_ADDRESS_MOONBASE=0xD1d526991f180504e2eBEa41cCAdf4DB0F7Bf097" > .env.local
echo "VITE_WDOT_ADDRESS_MOONBASE=0xd909178cC99D318E4d1390dc624800C34066dc6c" >> .env.local
```

### 7. Deploy Frontend

```bash
cd client
npm run build
vercel --prod
```

## Moonbase Alpha Testnet Details

| Property | Value |
|----------|-------|
| **Network Name** | Moonbase Alpha |
| **RPC URL** | https://rpc.api.moonbase.moonbeam.network |
| **Chain ID** | 1287 |
| **Currency** | DEV |
| **wDOT Address** | 0xd909178cC99D318E4d1390dc624800C34066dc6c |
| **PolkaFix Contract** | 0xD1d526991f180504e2eBEa41cCAdf4DB0F7Bf097 |
| **Faucet** | https://apps.moonbeam.network/moonbase-alpha/faucet |
| **Explorer** | https://moonbase.moonscan.io |

## Testing the Deployment

### 1. Get Test Tokens

**Get DEV tokens (for gas fees):**
1. Visit [Moonbase Alpha Faucet](https://apps.moonbeam.network/moonbase-alpha/faucet)
2. Connect your wallet or enter your address
3. Request DEV tokens (1.1 DEV per 24 hours)

**Get wDOT tokens (for bounties):**

⚠️ **Note**: The Beamex Beta program has ended. Use one of these methods:

**Option A: Request from Moonbeam Discord (Recommended)**
1. Join [Moonbeam Discord](https://discord.gg/moonbeam)
2. Go to testnet support channel
3. Share your wallet address and request wDOT tokens
4. Community members can help provide test tokens

**Option B: Check if wDOT Contract Supports Wrapping**
1. Visit [wDOT Contract on Moonscan](https://moonbase.moonscan.io/address/0xd909178cC99D318E4d1390dc624800C34066dc6c#code)
2. Check for `deposit()` function
3. If available, wrap DEV to wDOT by calling `deposit()` with DEV

**Option C: Deploy First, Get wDOT Later**
- Contract deployment only needs DEV tokens
- wDOT is only needed when posting bounties
- You can deploy now and get wDOT later for testing

**Check your wDOT balance:**
```bash
cd contracts
npm run check:wdot
```

### 2. Wallet Setup

**Getting Your Wallet Address (for faucet):**
- Open MetaMask → Click account name → Copy address
- This is what you use for the faucet to receive tokens

**Getting Your Private Key (for deployment):**
- MetaMask → Three dots (⋮) → Account details → Show private key
- ⚠️ **Security**: Never share your private key, use a separate test wallet

**Approve wDOT Spending:**

Before posting bounties, approve the PolkaFix contract to spend your wDOT:

1. Go to [wDOT Contract on Moonscan](https://moonbase.moonscan.io/address/0xd909178cC99D318E4d1390dc624800C34066dc6c#writeContract)
2. Connect your wallet
3. Call `approve` function:
   - `spender`: `0xD1d526991f180504e2eBEa41cCAdf4DB0F7Bf097` (PolkaFix contract)
   - `amount`: Amount to approve (or max: `115792089237316195423570985008687907853269984665640564039457584007913129639935`)

### 3. Post a Test Bounty

1. Open your deployed frontend
2. Connect wallet (MetaMask with Moonbase Alpha network)
3. Create a bounty:
   - Title: "Test Bounty"
   - Description: "Testing the deployment"
   - Issue URL: "https://github.com/your-repo/issues/1"
   - Reward: 1 wDOT (or any amount you approved)

### 4. Submit Fix & Vote

1. Submit a fix with a PR link
2. Have at least 3 different addresses vote
3. Need 70% approval (yes votes / total votes >= 0.7)
4. Once resolved, the submitter automatically receives the reward

## Troubleshooting

### "Insufficient funds"
- Get DEV tokens from faucet: https://apps.moonbeam.network/moonbase-alpha/faucet

### "Transfer failed" when posting bounty
- Approve wDOT spending first (see Testing section)
- Ensure you have enough wDOT balance

### Contract verification fails
- Check that MOONSCAN_API_KEY is set (optional but recommended)
- Wait a few seconds after deployment before verifying
- Contract might already be verified (check Moonscan)

### Frontend can't connect to contract
- Verify `client/.env.local` has correct contract address
- Ensure you're on Moonbase Alpha network in MetaMask
- Rebuild frontend: `cd client && npm run build`

## Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| Compile | `cd contracts && npm run compile` | Compile Solidity contracts |
| Deploy | `cd contracts && npm run deploy:moonbase` | Deploy to Moonbase Alpha |
| Verify | `cd contracts && npm run verify:moonbase` | Verify contract on Moonscan |
| Check wDOT | `cd contracts && npm run check:wdot` | Check wDOT balance |


## Security Best Practices

1. **Never commit `.env`** - Add to `.gitignore`
2. **Use separate wallets** - Don't use mainnet wallet for testnet
3. **Verify contracts** - Always verify on block explorer
4. **Test thoroughly** - Test on testnet before mainnet
5. **Keep private keys secure** - Use environment variables, never hardcode

## Next Steps

After successful deployment:

1. ✅ Contract deployed and verified
2. ✅ Frontend connected to contract
3. ✅ Test with small bounties
4. ✅ Monitor transactions on Moonscan
5. ✅ Gather feedback and iterate

## Support

- **Moonbeam Docs**: https://docs.moonbeam.network/
- **Hardhat Docs**: https://hardhat.org/docs
- **Moonscan**: https://moonbase.moonscan.io

