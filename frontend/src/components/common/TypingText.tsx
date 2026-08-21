import { useEffect, useState } from 'react';

interface TypingTextProps {
  phrases: readonly string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  startDelay?: number;
}

/** Machine à écrire discret pour une ligne secondaire de Hero. */
const TypingText = ({
  phrases,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseDuration = 1800,
  startDelay = 600,
}: TypingTextProps) => {
  const firstPhrase = phrases[0] ?? '';
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(firstPhrase);
      return;
    }

    const phrase = phrases[phraseIndex] ?? firstPhrase;
    const isComplete = text === phrase;
    const isEmpty = text.length === 0;
    let delay = typingSpeed;
    if (isComplete && !deleting) {
      delay = pauseDuration;
    } else if (isEmpty && deleting) {
      delay = 180;
    } else if (deleting) {
      delay = deletingSpeed;
    }

    const timer = window.setTimeout(
      () => {
        if (isComplete && !deleting) {
          setDeleting(true);
          return;
        }

        if (isEmpty && deleting) {
          setPhraseIndex((current) => (current + 1) % phrases.length);
          setDeleting(false);
          return;
        }

        const nextLength = text.length + (deleting ? -1 : 1);
        setText(phrase.slice(0, nextLength));
      },
      text.length === 0 && !deleting && phraseIndex === 0 ? startDelay : delay
    );

    return () => window.clearTimeout(timer);
  }, [
    deleting,
    firstPhrase,
    phraseIndex,
    phrases,
    startDelay,
    text,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return (
    <span className="inline-flex items-center" aria-label={firstPhrase}>
      <span aria-hidden="true">{text}</span>
      <span
        aria-hidden="true"
        className="ml-0.5 animate-pulse text-sage-300 motion-reduce:animate-none"
      >
        |
      </span>
    </span>
  );
};

export default TypingText;
