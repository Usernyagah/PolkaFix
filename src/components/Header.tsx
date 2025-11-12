import { Link } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Button } from '@/components/ui/button';
import { formatAddress } from '@/lib/format';
import { Wallet, LogOut } from 'lucide-react';

export const Header = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-purple">
            <span className="text-2xl font-bold">PF</span>
          </div>
          <span className="text-xl font-bold hidden sm:inline">PolkaFix</span>
        </Link>

        <div className="flex items-center gap-4">
          {!isConnected ? (
            <Button onClick={() => open()} className="shadow-glow-purple">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => disconnect()}
              className="flex gap-2"
            >
              <span className="font-mono">{formatAddress(address || '')}</span>
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
