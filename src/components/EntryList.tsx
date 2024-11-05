import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trash2, Link } from 'lucide-react';

interface Entry {
  text: string;
  date: string;
}

interface EntryListProps {
  entries: Entry[];
  onDelete: (index: number) => void;
}

export function EntryList({ entries, onDelete }: EntryListProps) {
  return (
    <div className="space-y-6">
      {entries.map((entry, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 group relative"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 text-purple-300">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(entry.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <button
              onClick={() => onDelete(index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded-full"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
          <p className="text-white/90 whitespace-pre-wrap leading-relaxed">{entry.text}</p>
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              className="flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200 transition-colors"
              onClick={() => {
                const url = `#entry-${index}`;
                window.history.pushState({}, '', url);
              }}
            >
              <Link className="w-4 h-4" />
              Share Entry
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}