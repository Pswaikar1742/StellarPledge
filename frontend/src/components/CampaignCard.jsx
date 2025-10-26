import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';

const CampaignCard = ({ campaign, index }) => {
  const navigate = useNavigate();
  const progress = (campaign.pledged / campaign.goal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col"
    >
      <h3 className="text-2xl font-bold text-card-foreground mb-3">
        {campaign.title}
      </h3>

      <p className="text-muted-foreground mb-6 flex-grow line-clamp-3">
        {campaign.description}
      </p>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground font-medium">Progress</span>
          <span className="text-sm text-card-foreground font-bold">{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
            className="h-full bg-accent rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <span className="text-card-foreground font-bold">
            {campaign.pledged.toLocaleString()} XLM
          </span>
          <span className="text-muted-foreground">
            of {campaign.goal.toLocaleString()} XLM
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{campaign.backers} backers</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{campaign.daysLeft} days left</span>
        </div>
      </div>

      <Button
        onClick={() => navigate(`/campaign/${campaign.id}`)}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all duration-300"
      >
        View Details
      </Button>
    </motion.div>
  );
};

export default CampaignCard;
