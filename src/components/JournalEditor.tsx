import React, { useState } from 'react';
import { Save, Smile, Mic } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface JournalEditorProps {
  onSave: (text: string) => boolean;
}

export function JournalEditor({ onSave }: JournalEditorProps) {
  const [entry, setEntry] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const { isRecording, toggleRecording } = useSpeechRecognition((text) => {
    setEntry(prev => prev + ' ' + text);
  });

  const handleSave = () => {
    if (onSave(entry)) {
      setEntry('');
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className="relative bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <Smile className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={toggleRecording}
          className={`p-2 rounded-full transition-colors ${
            isRecording ? 'bg-red-500/50 text-white' : 'hover:bg-white/10 text-white'
          }`}
        >
          <Mic className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute z-10"
          >
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                setEntry(prev => prev + emojiData.emoji);
                setShowEmojiPicker(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your thoughts here..."
        className="w-full h-40 p-4 mb-4 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:ring focus:ring-purple-200/20 focus:ring-opacity-50 resize-none transition-colors"
      />

      <button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <Save className="w-5 h-5" />
        Save Entry
      </button>
    </div>
  );
}