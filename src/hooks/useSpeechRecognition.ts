import { useRef, useEffect, useState, useCallback } from 'react';

export function useSpeechRecognition(onTranscript: (text: string) => void) {
  const recognition = useRef<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new (window as any).webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        
        onTranscript(transcript);
      };

      recognition.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, [onTranscript]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      recognition.current?.stop();
    } else {
      recognition.current?.start();
    }
    setIsRecording(!isRecording);
  }, [isRecording]);

  return {
    isRecording,
    toggleRecording
  };
}