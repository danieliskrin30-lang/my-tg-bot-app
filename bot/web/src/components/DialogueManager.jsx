import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DialogueManager Component
 * Handles the visual novel style storytelling.
 *
 * @param {Object} story - The story nodes for the current character.
 * @param {Object} character - The character object (name, emoji, image, color).
 * @param {Function} onFinish - Callback when the story sequence ends.
 */
const DialogueManager = ({ story, character, clickSfx, onOpenProfile, onFinish }) => {
  const [currentNode, setCurrentNode] = useState('start');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);

  const node = story[currentNode];

  /* Typewriter effect */
  useEffect(() => {
    if (!node) return;

    const text = node.text;
    if (!text) return;

    setDisplayedText('— ');
    setIsTyping(true);
    setShowChoices(false);

    let currentIdx = 0;
    const timer = setInterval(() => {
      if (currentIdx >= text.length) {
        clearInterval(timer);
        setIsTyping(false);
        setShowChoices(true);
        return;
      }
      const ch = text[currentIdx];
      if (ch === undefined) {
        clearInterval(timer);
        return;
      }
      setDisplayedText((prev) => prev + ch);
      currentIdx++;
    }, 45);

    return () => clearInterval(timer);
  }, [currentNode, node]);

  const handleChoice = (choice) => {
    clickSfx?.play();
    if (isTyping) {
      setDisplayedText('— ' + node.text);
      setIsTyping(false);
      setShowChoices(true);
      return;
    }

    if (choice.next === 'finish') {
      onFinish();
    } else if (story[choice.next]) {
      setCurrentNode(choice.next);
    }
  };

  if (!node) return null;

  return (
    <motion.div
      className="dialogue-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Profile button */}
      {onOpenProfile && (
        <button className="btn-dialogue-profile" onClick={onOpenProfile} aria-label="Profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      )}

      {/* Character Sprite */}
      <motion.div
        className="dialogue-sprite-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {story && character && (
          <motion.img
            key={character.id}
            src={character.image}
            alt={character.name}
            className="dialogue-character-img"
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 30px ${character.color}44)` }}
          />
        )}
      </motion.div>

      {/* Dialogue Box */}
      <motion.div
        className="dialogue-box-container"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="dialogue-box" style={{ borderColor: `${character?.color}66` }}>
          <div className="dialogue-name-tag" style={{ backgroundColor: character?.color }}>
            {character?.emoji} {character?.name}
          </div>

          <div className="dialogue-text" onClick={() => { clickSfx?.play(); handleChoice({}); }}>
            {displayedText}
            {isTyping && <span className="typewriter-cursor">|</span>}
          </div>

          <div className="dialogue-choices">
            <AnimatePresence>
              {showChoices &&
                node.choices &&
                node.choices.map((choice, i) => (
                  <motion.button
                    key={i}
                    className="choice-button"
                    whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleChoice(choice)}
                  >
                    <span className="choice-bullet" style={{ color: character?.color }}>✦</span>
                    {choice.text}
                  </motion.button>
                ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DialogueManager;
