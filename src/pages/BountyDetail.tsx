import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccount, useChainId } from 'wagmi';
import { ethers } from 'ethers';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VoteButtons } from '@/components/VoteButtons';
import { getPolkaFixContract } from '@/lib/contract';
import { formatDOT, getBountyStatus, getVotePercentage, getMoonscanLink, formatAddress } from '@/lib/format';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ExternalLink, GitPullRequest, Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { Bounty } from '@/types/PolkaFix';

const BountyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { toast } = useToast();

  const [prLink, setPrLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const fetchBounty = async (): Promise<Bounty | null> => {
    if (!id) return null;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = getPolkaFixContract(provider, chainId);
    const bounty = await contract.bounties(parseInt(id));
    
    return {
      title: bounty[0],
      description: bounty[1],
      issueUrl: bounty[2],
      reward: bounty[3],
      submitter: bounty[4],
      fixPR: bounty[5],
      resolved: bounty[6],
      yesVotes: bounty[7],
      noVotes: bounty[8],
    };
  };

  const { data: bounty, isLoading, refetch } = useQuery({
    queryKey: ['bounty', id, chainId],
    queryFn: fetchBounty,
    refetchInterval: 10000,
    enabled: isConnected && !!id,
  });

  const handleSubmitFix = async () => {
    if (!id || !prLink) return;

    try {
      setIsSubmitting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getPolkaFixContract(signer, chainId);

      const tx = await contract.submitFix(parseInt(id), prLink);
      await tx.wait();

      toast({
        title: 'Fix Submitted!',
        description: 'Your PR has been submitted for voting',
      });

      setPrLink('');
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit fix',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (approve: boolean) => {
    if (!id) return;

    try {
      setIsVoting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getPolkaFixContract(signer, chainId);

      const tx = await contract.vote(parseInt(id), approve);
      await tx.wait();

      setHasVoted(true);
      toast({
        title: 'Vote Recorded!',
        description: `You voted to ${approve ? 'approve' : 'reject'} this fix`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to vote',
        variant: 'destructive',
      });
    } finally {
      setIsVoting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id || '');
    toast({ title: 'Copied!', description: 'Bounty ID copied to clipboard' });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please connect your wallet</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!bounty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Bounty not found</p>
      </div>
    );
  }

  const status = getBountyStatus(bounty);
  const votePercentage = getVotePercentage(bounty.yesVotes, bounty.noVotes);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Bounties
        </Link>

        <Card className="bg-gradient-card border-border">
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold">{bounty.title}</h1>
                <Badge className="text-sm">{status}</Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <Copy className="w-4 h-4" />
                  ID: {id}
                </button>
              </div>
            </div>

            {/* Reward */}
            <div className="p-6 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">Bounty Reward</p>
              <p className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {formatDOT(bounty.reward)}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{bounty.description}</p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-4">
              <a
                href={bounty.issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                View GitHub Issue
              </a>
              {bounty.fixPR && (
                <a
                  href={bounty.fixPR}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <GitPullRequest className="w-4 h-4" />
                  View Pull Request
                </a>
              )}
            </div>

            {/* Submitter Info */}
            {bounty.submitter !== ethers.ZeroAddress && (
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Submitted by</p>
                <p className="font-mono">{formatAddress(bounty.submitter)}</p>
              </div>
            )}

            {/* Voting Section */}
            {bounty.fixPR && !bounty.resolved && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Community Votes</span>
                    <span className="font-medium">
                      {Number(bounty.yesVotes)} Yes / {Number(bounty.noVotes)} No
                    </span>
                  </div>
                  <Progress value={votePercentage} className="h-3" />
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {votePercentage}% Approval
                  </p>
                </div>

                {address && address.toLowerCase() !== bounty.submitter.toLowerCase() && (
                  <VoteButtons
                    bountyId={parseInt(id || '0')}
                    hasVoted={hasVoted}
                    isVoting={isVoting}
                    onVote={handleVote}
                  />
                )}
              </div>
            )}

            {/* Submit Fix Section */}
            {!bounty.fixPR && !bounty.resolved && (
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-semibold">Submit Your Fix</h3>
                <div className="flex gap-2">
                  <Input
                    value={prLink}
                    onChange={(e) => setPrLink(e.target.value)}
                    placeholder="https://github.com/owner/repo/pull/123"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSubmitFix}
                    disabled={!prLink || isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Resolved */}
            {bounty.resolved && (
              <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-500">Bounty Resolved</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BountyDetail;
