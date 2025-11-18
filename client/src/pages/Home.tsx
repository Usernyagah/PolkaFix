import { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { ethers } from 'ethers';
import { useQuery } from '@tanstack/react-query';
import { BountyCard } from '@/components/BountyCard';
import { CreateBountyModal } from '@/components/CreateBountyModal';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { getPolkaFixContract } from '@/lib/contract';
import { BountyWithId } from '@/types/PolkaFix';
import { Plus, Wallet } from 'lucide-react';

const Home = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { open } = useWeb3Modal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBounties = async (): Promise<BountyWithId[]> => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const chainId = await provider.send('eth_chainId', []);
    const contract = getPolkaFixContract(provider, Number(chainId));
    const contractAddr = await contract.getAddress();
    const count = await contract.bountyCount();
    console.log('[Bounty Debug]', { chainId, contractAddr, count: Number(count) });
    const bounties: BountyWithId[] = [];
    for (let i = 0; i < Number(count); i++) {
      try {
        const bounty = await contract.bounties(i);
        console.log(`[Bounty Debug] Fetched bounty at index ${i}:`, bounty);
        bounties.push({
          id: i,
          title: bounty[0],
          description: bounty[1],
          issueUrl: bounty[2],
          reward: bounty[3],
          submitter: bounty[4],
          fixPR: bounty[5],
          resolved: bounty[6],
          yesVotes: bounty[7],
          noVotes: bounty[8],
        });
      } catch (err) {
        console.error(`[Bounty Debug] Error fetching bounty at index ${i}:`, err);
      }
    }
    console.log('[Bounty Debug] bounties final array:', bounties);
    return bounties.reverse(); // Show newest first
  };

  const { data: bounties, isLoading, refetch } = useQuery({
    queryKey: ['bounties', chainId],
    queryFn: fetchBounties,
    refetchInterval: 15000, // Auto-refresh every 15 seconds
    enabled: isConnected,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            PolkaFix Bounties
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Post and complete bounties on the Moonbeam network. Get rewarded in DOT for fixing issues.
          </p>
          {isConnected ? (
            <Button
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="shadow-glow-purple"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Bounty
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-muted-foreground">Connect your wallet to create bounties</p>
              <Button size="lg" className="shadow-glow-purple" onClick={() => open()}>
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
        {/* Bounties Grid */}
        {!isConnected ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Please connect your wallet to view bounties</p>
          </div>
        ) : isLoading ? (
          <LoadingSkeleton />
        ) : bounties ? (
          bounties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bounties.map((bounty) => (
                <BountyCard key={bounty.id} bounty={bounty} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <p className="text-xl text-muted-foreground mb-4">No bounties yet</p>
              <p className="text-sm text-muted-foreground mb-6">Be the first to create one!</p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Bounty
              </Button>
            </div>
          )
        ) : null}
      </div>
      {/* Always mount the modal with refetch onSuccess */}
      <CreateBountyModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={() => refetch()} // always refetch on success
      />
    </div>
  );
};

export default Home;
