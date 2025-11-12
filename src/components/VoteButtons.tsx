import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';

interface VoteButtonsProps {
  bountyId: number;
  hasVoted: boolean;
  isVoting: boolean;
  onVote: (approve: boolean) => void;
}

export const VoteButtons = ({ hasVoted, isVoting, onVote }: VoteButtonsProps) => {
  return (
    <div className="flex gap-4">
      <Button
        onClick={() => onVote(true)}
        disabled={hasVoted || isVoting}
        className="flex-1 bg-green-500/10 hover:bg-green-500 hover:text-white border border-green-500/20 transition-all"
        variant="outline"
      >
        {isVoting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <ThumbsUp className="w-4 h-4 mr-2" />
            Approve
          </>
        )}
      </Button>
      <Button
        onClick={() => onVote(false)}
        disabled={hasVoted || isVoting}
        className="flex-1 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all"
        variant="outline"
      >
        {isVoting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <ThumbsDown className="w-4 h-4 mr-2" />
            Reject
          </>
        )}
      </Button>
    </div>
  );
};
