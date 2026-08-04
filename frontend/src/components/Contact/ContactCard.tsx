import React from 'react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Link as RouterLink } from 'react-router-dom';
import { GREEN } from '../../constants/colors';
import type { ContactCardProps } from '../../types/faq.types';

const ContactCard: React.FC<ContactCardProps> = (props: Readonly<ContactCardProps>) => {
  const {
    icon,
    title = 'Vous ne trouvez pas la réponse à votre question ?',
    description = "Notre équipe est disponible pour répondre à toutes vos interrogations. N'hésitez pas à nous contacter.",
    primaryLabel = "Contacter l'ESSG",
    primaryLink = '/contact',
    secondaryLabel = 'Postuler maintenant',
    secondaryLink = '/admission',
  } = props;

  return (
    <Card
      sx={{
        borderRadius: '1rem',
        border: `1px solid ${GREEN[200]}`,
        backgroundColor: GREEN[50],
      }}
    >
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: GREEN[100] }}
          >
            {icon ?? <HelpOutlineRoundedIcon sx={{ fontSize: 28, color: GREEN[900] }} />}
          </div>

          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>

            <p className="mb-4 text-gray-700">{description}</p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                component={RouterLink}
                to={primaryLink}
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  borderRadius: '0.75rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: GREEN[900],
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: GREEN[700],
                    boxShadow: 'none',
                  },
                }}
              >
                {primaryLabel}
              </Button>

              <Button
                component={RouterLink}
                to={secondaryLink}
                variant="outlined"
                sx={{
                  borderRadius: '0.75rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: GREEN[900],
                  color: GREEN[600],
                  backgroundColor: '#ffffff',
                  '&:hover': {
                    borderColor: GREEN[700],
                    backgroundColor: GREEN[50],
                  },
                }}
              >
                {secondaryLabel}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
