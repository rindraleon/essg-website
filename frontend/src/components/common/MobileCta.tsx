import React from 'react';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

interface MobileCtaProps {
  label: string;
  link: string;
}

const MobileCta: React.FC<MobileCtaProps> = ({ label, link }) => {
  return (
    <div className="mt-8 sm:hidden">
      <Button
        component={RouterLink}
        to={link}
        variant="outlined"
        fullWidth
        endIcon={<ArrowForwardRoundedIcon />}
        sx={{
          borderRadius: '0.9rem',
          py: 1.25,
          textTransform: 'none',
          fontWeight: 600,
          borderColor: 'primary.main',
          color: 'primary.main',
          '&:hover': {
            borderColor: 'primary.dark',
            backgroundColor: 'primary.50',
          },
        }}
      >
        {label}
      </Button>
    </div>
  );
};

export default MobileCta;
