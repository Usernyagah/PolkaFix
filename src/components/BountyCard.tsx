import { Link } from 'react-router-dom';
import { BountyWithId } from '@/types/PolkaFix';
import { formatDOT, getBountyStatus, getVotePercentage } from '@/lib/format';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, GitPullRequest } from 'lucide-react';

interface BountyCardProps {
  bounty: BountyWithId;
}

export const BountyCard = ({ bounty }: BountyCardProps) => {
  const status = getBountyStatus(bounty);
  const votePercentage = getVotePercentage(bounty.yesVotes, bounty.noVotes);

  const statusColors: Record<string, string> = {
    Open: 'bg-green-500/10 text-green-500 border-green-500/20',
    'Fix Submitted': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Voting: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    Resolved: 'bg-muted text-muted-foreground',
  };

  return (
    <Card className="group hover:shadow-glow-purple transition-all duration-300 hover:border-primary/50 bg-gradient-card">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {bounty.title}
          </h3>
          <Badge className={statusColors[status]}>{status}</Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{bounty.description}</p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <a
            href={bounty.issueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3" />
            Issue
          </a>
          {bounty.fixPR && (
            <>
              <span>•</span>
              <a
                href={bounty.fixPR}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <GitPullRequest className="w-3 h-3" />
                PR
              </a>
            </>
          )}
        </div>

        {(bounty.yesVotes > 0n || bounty.noVotes > 0n) && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Approval</span>
              <span className="font-medium">{votePercentage}%</span>
            </div>
            <Progress value={votePercentage} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {formatDOT(bounty.reward)}
          </div>
          <Link to={`/bounty/${bounty.id}`}>
            <button className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
