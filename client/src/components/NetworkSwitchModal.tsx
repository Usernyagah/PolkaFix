import { useAccount, useChainId, useSwitchChain, useDisconnect } from 'wagmi';
import { moonbaseAlpha, moonbeam } from 'wagmi/chains';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SUPPORTED_CHAINS = [moonbaseAlpha.id, moonbeam.id];

export const NetworkSwitchModal = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending, error } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  const isUnsupportedNetwork = isConnected && !SUPPORTED_CHAINS.includes(chainId);

  if (!isUnsupportedNetwork) {
    return null;
  }

  const handleSwitchToMoonbase = async () => {
    try {
      await switchChain({ chainId: moonbaseAlpha.id });
    } catch (err) {
      toast({
        title: 'Failed to switch network',
        description: 'Please switch to Moonbase Alpha manually in your wallet.',
        variant: 'destructive',
      });
    }
  };

  const handleSwitchToMoonbeam = async () => {
    try {
      await switchChain({ chainId: moonbeam.id });
    } catch (err) {
      toast({
        title: 'Failed to switch network',
        description: 'Please switch to Moonbeam manually in your wallet.',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <AlertDialog open={isUnsupportedNetwork}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>Unsupported Network</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            This app doesn't support your current network. Switch to an available option to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <Button
            onClick={handleSwitchToMoonbase}
            className="w-full justify-start"
            variant="outline"
            disabled={isPending}
          >
            <div className="flex flex-col items-start">
              <span className="font-semibold">Moonbase Alpha</span>
              <span className="text-xs text-muted-foreground">Testnet (Chain ID: {moonbaseAlpha.id})</span>
            </div>
          </Button>
          <Button
            onClick={handleSwitchToMoonbeam}
            className="w-full justify-start"
            variant="outline"
            disabled={isPending}
          >
            <div className="flex flex-col items-start">
              <span className="font-semibold">Moonbeam</span>
              <span className="text-xs text-muted-foreground">Mainnet (Chain ID: {moonbeam.id})</span>
            </div>
          </Button>
        </div>
        {error && (
          <div className="text-sm text-destructive mb-2 px-4">
            {error.message || 'Failed to switch network. Please try again or switch manually in your wallet.'}
          </div>
        )}
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isPending}
          >
            Disconnect
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

