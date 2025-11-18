import { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { ethers } from 'ethers';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getPolkaFixContract, getWDotContract } from '@/lib/contract';
import { parseDOT, getMoonscanLink } from '@/lib/format';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, ExternalLink } from 'lucide-react';

interface CreateBountyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateBountyModal = ({ open, onOpenChange, onSuccess }: CreateBountyModalProps) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issueUrl: '',
    reward: '',
  });

  const [step, setStep] = useState<'form' | 'approve' | 'post' | 'success'>('form');
  const [txHash, setTxHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const rewardWei = parseDOT(formData.reward);
      const polkaFixContract = getPolkaFixContract(signer, chainId);
      const polkaFixAddress = await polkaFixContract.getAddress();

      // Step 1: Check and approve wDOT
      setStep('approve');
      let allowance = 0n;
      let wDotContract;
      let wdotAddress =
        chainId === 1284
          ? import.meta.env.VITE_WDOT_ADDRESS_MOONBEAM || ''
          : chainId === 1287
          ? import.meta.env.VITE_WDOT_ADDRESS_MOONBASE || ''
          : import.meta.env.VITE_WDOT_ADDRESS_LOCAL || '';
      // Do NOT check or throw if the address is empty or missing. Just always attempt the transaction.

      try {
        wDotContract = getWDotContract(signer, chainId);
        allowance = await wDotContract.allowance(address, polkaFixAddress);
      } catch {}

      if (allowance < rewardWei) {
        try {
          const approveTx = await wDotContract.approve(polkaFixAddress, rewardWei);
          await approveTx.wait();
          toast({ title: 'Approved!', description: 'wDOT spending approved' });
        } catch {
          toast({
            title: 'Could not approve wDOT',
            description: 'Try again or switch networks/wallets.',
            variant: 'destructive',
          });
          setStep('form');
          setIsLoading(false);
          return;
        }
      }

      // Step 2: Post bounty
      setStep('post');
      try {
        const tx = await polkaFixContract.postBounty(
          formData.title,
          formData.description,
          formData.issueUrl,
          rewardWei
        );
        setTxHash(tx.hash);
        await tx.wait();
        // On create bounty success:
        setStep('success');
        toast({
          title: 'Bounty Posted!',
          description: 'Your bounty has been created successfully',
        });
        // Always call onSuccess (which triggers the refetch in Home)
        onSuccess();
        setTimeout(() => {
          onOpenChange(false);
          resetForm();
        }, 2000);
      } catch {
        toast({
          title: 'Could not post bounty',
          description: 'Try again or switch network.',
          variant: 'destructive',
        });
        setStep('form');
      }
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error creating bounty:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create bounty',
        variant: 'destructive',
      });
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', issueUrl: '', reward: '' });
    setStep('form');
    setTxHash('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Bounty</DialogTitle>
          <DialogDescription>
            Create a new bug bounty with a wDOT reward for fixing issues.
          </DialogDescription>
        </DialogHeader>

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Fix bug in authentication system"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the issue..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueUrl">GitHub Issue URL</Label>
              <Input
                id="issueUrl"
                type="url"
                value={formData.issueUrl}
                onChange={(e) => setFormData({ ...formData, issueUrl: e.target.value })}
                placeholder="https://github.com/owner/repo/issues/123"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reward">Reward (DOT)</Label>
              <Input
                id="reward"
                type="number"
                step="0.01"
                min="0"
                value={formData.reward}
                onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                placeholder="10.00"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              Create Bounty
            </Button>
          </form>
        )}

        {(step === 'approve' || step === 'post') && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">
                {step === 'approve' ? 'Approving wDOT...' : 'Posting Bounty...'}
              </p>
              <p className="text-sm text-muted-foreground">
                {step === 'approve'
                  ? 'Please confirm the approval transaction'
                  : 'Please confirm the bounty creation transaction'}
              </p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Bounty Created!</p>
              {txHash && (
                <a
                  href={getMoonscanLink(txHash, chainId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline justify-center"
                >
                  View on Moonscan
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
