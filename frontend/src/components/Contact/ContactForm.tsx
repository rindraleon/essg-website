import React, { useState } from 'react';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import type { SelectChangeEvent } from '@mui/material/Select';
import { toast } from 'react-hot-toast';
import { GREEN } from '../../constants/colors';
import type { ContactFormData, ContactFormProps } from '../../types/contact.types';
import { createContactMessage } from '../../services/contact.service';

const INITIAL_FORM_DATA: ContactFormData = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  sujet: '',
  message: '',
};

const DEFAULT_SUJETS = [
  { value: 'information', label: "Demande d'information" },
  { value: 'admission', label: 'Admission' },
  { value: 'partenariat', label: 'Partenariat' },
  { value: 'autre', label: 'Autre' },
];

const iconSx = {
  fontSize: 20,
  color: GREEN[500],
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.9rem',
    backgroundColor: '#ffffff',
    '&.Mui-focused fieldset': {
      borderColor: GREEN[600],
    },
    '&:hover fieldset': {
      borderColor: GREEN[400],
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: GREEN[600],
  },
};

const selectSx = {
  borderRadius: '0.9rem',
  backgroundColor: '#ffffff',
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: GREEN[600],
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: GREEN[400],
  },
};

const ContactForm: React.FC<ContactFormProps> = (props: Readonly<ContactFormProps>) => {
  const { sujets = DEFAULT_SUJETS, onSubmit } = props;

  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      sujet: event.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createContactMessage(formData);

      if (onSubmit) {
        onSubmit(formData);
      }

      toast.success('Message envoyé avec succès ! Nous vous recevrez un email de confirmation.', {
        duration: 5000,
        position: 'top-right',
      });

      setFormData(INITIAL_FORM_DATA);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.", {
        duration: 5000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '1.5rem',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 2px rgba(15, 33, 30, 0.04), 0 4px 16px -4px rgba(15, 33, 30, 0.08)',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >

      <CardContent className="p-4 sm:p-6">
        <div className="mb-4">
          <h2 className="mb-1 text-xl font-bold text-ink-900">Envoyez-nous un message</h2>
          <p className="text-xs text-ink-500">
            Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs
            délais.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className="rounded-2xl border border-ink-100 bg-ink-50/50 p-5 sm:p-6"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-md"
                style={{ backgroundColor: GREEN[50] }}
              >
                <PersonRoundedIcon
                  sx={{
                    fontSize: 16,
                    color: GREEN[600],
                  }}
                />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink-900">Vos informations</h3>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                fullWidth
                size="small"
                sx={inputSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeRoundedIcon sx={iconSx} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                fullWidth
                size="small"
                sx={inputSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRoundedIcon sx={iconSx} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                placeholder='example@gmail.com'
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                size="small"
                sx={inputSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon sx={iconSx} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Téléphone"
                name="telephone"
                type="tel"
                placeholder='+261 3X XXX XX'
                value={formData.telephone}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneRoundedIcon sx={iconSx} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
          </div>

          <Divider />

          {/* Section 2 — Demande */}
          <div
            className="rounded-2xl border border-ink-100 bg-ink-50/50 p-4 sm:p-5"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-md"
                style={{ backgroundColor: GREEN[50] }}
              >
                <MessageRoundedIcon
                  sx={{
                    fontSize: 16,
                    color: GREEN[600],
                  }}
                />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink-900">Votre demande</h3>
              </div>
            </div>

            <div className="space-y-4">
              <FormControl fullWidth size="small" required>
                <InputLabel
                  id="sujet-label"
                  sx={{
                    '&.Mui-focused': {
                      color: GREEN[600],
                    },
                  }}
                >
                  Sujet
                </InputLabel>
                <Select
                  labelId="sujet-label"
                  label="Sujet"
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleSelectChange}
                  sx={selectSx}
                  startAdornment={
                    <InputAdornment position="start">
                      <SubjectRoundedIcon sx={iconSx} />
                    </InputAdornment>
                  }
                >
                  {sujets.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="mb-3 flex items-center gap-3 my-3">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-md"
                style={{ backgroundColor: GREEN[50] }}
              >
                <MessageRoundedIcon
                  sx={{
                    fontSize: 16,
                    color: GREEN[600],
                  }}
                />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink-900">Votre demande</h3>
              </div>
            </div>
              
              
              <TextField
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={4}
                size="small"
                placeholder="Décrivez votre demande avec le plus de précision possible..."
                sx={inputSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          alignSelf: 'flex-start',
                          mt: 0.5,
                        }}
                      >
                        <MessageRoundedIcon sx={iconSx} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
          </div>

          {/* Bouton */}
          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="contained"
              size="medium"
              disabled={loading}
              endIcon={!loading ? <SendRoundedIcon /> : undefined}
              sx={{
                minWidth: {
                  xs: '100%',
                  sm: 220,
                },
                borderRadius: '0.9rem',
                px: 3,
                py: 1.2,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                backgroundColor: GREEN[600],
                boxShadow: '0 10px 24px -10px rgba(46, 106, 95, 0.5)',
                '&:hover': {
                  backgroundColor: GREEN[700],
                  boxShadow: '0 14px 28px -12px rgba(46, 106, 95, 0.55)',
                },
                '&.Mui-disabled': {
                  backgroundColor: GREEN[300],
                  color: '#ffffff',
                },
              }}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le message'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
