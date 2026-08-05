import React from 'react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import MobileCta from './MobileCta';

interface SectionCtaProps {
  label: string;
  link: string;
}


const SectionCta: React.FC<SectionCtaProps> = ({ label, link }) => {
  return (
    <>
      <div className="mt-6 mb-4 flex justify-center">
        <Button
          component={RouterLink}
          to={link}
          variant="outlined"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            borderRadius: '0.75rem',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: 'divider',
            color: 'text.secondary',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
              backgroundColor: 'primary.50',
            },
          }}
        >
          {label}
        </Button>
      </div>

      <MobileCta label={label} link={link} />
    </>
  );
};

export default SectionCta;
