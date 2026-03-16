
'use client';

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Send, Bot, Keyboard } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { assistantCommandAction } from '@/app/actions/assistant-command';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';


type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
};

type AssistantMode = 'chat' | 'voice';

// Typewriter effect hook
const useTypewriter = (text: string, speed = 30) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText('');
    if (text) {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(timer);
        }
      }, speed);
      return () => clearInterval(timer);
    }
  }, [text, speed]);

  return displayText;
};

const VoiceVisualizer = ({ isListening, dataArray }: { isListening: boolean; dataArray: Uint8Array | null; }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    
    if (!isListening || !dataArray) {
       ctx.fillStyle = 'rgba(128, 90, 213, 0.1)';
       const barWidth = 4;
       const numBars = width / (barWidth + 2);
       for(let i=0; i<numBars; i++) {
          const barHeight = 10 + Math.random() * 10;
          ctx.fillRect(i * (barWidth + 2), height/2 - barHeight/2, barWidth, barHeight);
       }
       return;
    }

    const bufferLength = dataArray.length;
    const barWidth = (width / bufferLength) * 1.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 2;
      ctx.fillStyle = 'rgba(128, 90, 213, 0.6)';
      ctx.fillRect(x, height / 2 - barHeight / 2, barWidth, barHeight);
      x += barWidth + 2;
    }
  }, [dataArray, isListening]);
  
  return (
    <div className="relative flex items-center justify-center w-full h-24">
      <canvas ref={canvasRef} className="w-full h-full" />
       {!isListening && (
        <div className="absolute inset-0 flex items-center justify-center">
            <Bot className="h-12 w-12 text-primary/30" />
        </div>
      )}
    </div>
  );
};

const AITypingResponse = memo(({ text }: { text: string }) => {
    const displayedText = useTypewriter(text);
    return <>{displayedText}<span className={cn("inline-block animate-pulse", displayedText.length === text.length ? 'hidden' : '')}>|</span></>;
});
AITypingResponse.displayName = "AITypingResponse";


const ChatMessage = memo(({ message }: { message: Message }) => {
    return (
        <div 
            className={cn("flex items-end gap-2", message.sender === 'user' ? 'justify-end' : 'justify-start')}
        >
            {message.sender === 'ai' && <Bot className="h-6 w-6 text-primary shrink-0" />}
            <div className={cn(
                "max-w-xs rounded-2xl p-3 text-sm",
                message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-br-none' 
                    : 'bg-muted rounded-bl-none'
            )}>
                {message.sender === 'ai' ? 
                    (message.text === '...' ? 
                        <div className="flex gap-1 items-center p-1">
                            <span className="h-2 w-2 bg-foreground/30 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-foreground/30 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-foreground/30 rounded-full animate-bounce"></span>
                        </div> 
                        : <AITypingResponse text={message.text} />)
                    : message.text
                }
            </div>
        </div>
    );
});
ChatMessage.displayName = "ChatMessage";


export function AIAssistant({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<AssistantMode>('chat');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');

  // Audio analysis state
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);


  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const { toast } = useToast();

  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  const setupAudioAnalysis = useCallback(async (stream: MediaStream) => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    if (!analyserRef.current) {
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 128;
    }
    
    if (sourceRef.current) {
        sourceRef.current.disconnect();
    }
    sourceRef.current = audioContext.createMediaStreamSource(stream);
    sourceRef.current.connect(analyserRef.current);

    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);
  }, []);

  const stopAudioAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
    }
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setAudioData(null);
  }, []);
  
  const analyzeAudio = useCallback(() => {
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      setAudioData(new Uint8Array(dataArrayRef.current));
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    }
  }, []);


  const processCommand = useCallback(async (command: string) => {
    if (!command) {
        setIsListening(false);
        return;
    };
    
    setInterimTranscript('Processing...');

    if (mode === 'chat') {
      setMessages(prev => [...prev, { id: Date.now(), text: command, sender: 'user' }]);
      setInputValue('');
    }

    const typingId = Date.now() + 1;
    if (mode === 'chat') {
       setMessages(prev => [...prev, { id: typingId, text: '...', sender: 'ai' }]);
    }
    

    try {
        const result = await assistantCommandAction({ command });

        if (mode === 'chat') {
           setMessages(prev => prev.map(msg => 
            msg.id === typingId ? { ...msg, text: result.responseText } : msg
          ));
        } else {
           setVoiceTranscript(result.responseText);
        }
        
        if (result.navigationPath) {
            toast({
                title: 'Navigating...',
                description: `Moving to ${result.navigationPath}`
            });
            router.push(result.navigationPath!);
        }

    } catch (error) {
        console.error("Error processing command:", error);
         const errorText = "I'm sorry, I encountered an error. Please try again.";
         if (mode === 'chat') {
            setMessages(prev => prev.map(msg => 
              msg.id === typingId ? { ...msg, text: errorText } : msg
            ));
         } else {
            setVoiceTranscript(errorText);
         }
    } finally {
      setInterimTranscript('');
    }
  }, [router, toast, mode]);
  
  const stopListening = useCallback(() => {
      if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
      }
      stopAudioAnalysis();
      setIsListening(false);
  }, [isListening, stopAudioAnalysis]);

  const startListening = useCallback(async () => {
    if (isListening) return;

    setVoiceTranscript('');
    setInterimTranscript('Listening...');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setupAudioAnalysis(stream);
        analyzeAudio();
        
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsListening(true);
        }
    } catch (err) {
        console.error('Error accessing microphone:', err);
        toast({
            title: 'Microphone Access Denied',
            description: 'Please enable microphone permissions in your browser settings.',
            variant: 'destructive',
        });
    }

  }, [isListening, setupAudioAnalysis, analyzeAudio, toast]);
  
  

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setVoiceTranscript('');
          setInterimTranscript('Listening...');
        };

        recognition.onend = () => {
          if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
          stopListening();
        };
        
        recognition.onresult = (event: any) => {
          if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

          let localInterimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              localInterimTranscript += event.results[i][0].transcript;
            }
          }
          
          setInterimTranscript(voiceTranscript + finalTranscript + localInterimTranscript);
          
          if(finalTranscript) {
              setVoiceTranscript(prev => prev + finalTranscript);
          }

          silenceTimeoutRef.current = setTimeout(() => {
              const currentTranscript = (voiceTranscript + finalTranscript + localInterimTranscript).trim();
              if (isListening && currentTranscript && currentTranscript !== 'Listening...') {
                  processCommand(currentTranscript);
              }
          }, 1500); // 1.5-second silence timeout
        };
        
        recognition.onerror = (event: any) => {
          if (event.error === 'aborted' || event.error === 'no-speech') {
            return;
          }
          console.error('Speech recognition error:', event.error);
          stopListening();
        };
      }
    }
    return () => {
      stopListening();
    }
  }, [processCommand, stopListening, isListening, voiceTranscript]);

  const toggleAssistant = () => {
    if (isOpen) {
        stopListening();
    } else {
        setMessages([]);
        setInputValue('');
        setMode('chat');
    }
    onOpenChange(!isOpen);
  }

  const handleSend = () => {
    if (inputValue) {
      processCommand(inputValue);
    }
  }


  const renderChatMode = () => (
     <motion.div
        key="chat-assistant"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
    >
        <Card className="h-[60vh] flex flex-col shadow-2xl bg-background/80 backdrop-blur-lg">
            <header className="flex items-center justify-between p-3 text-foreground border-b">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://picsum.photos/seed/ai-avatar/100/100" />
                        <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-bold text-sm">Sahayak Assistant</h3>
                        <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                </div>
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleAssistant}>
                    <X className="h-4 w-4" />
                </Button>
            </header>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                   <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </CardContent>
            <footer className="p-3 border-t">
                <div className="flex items-center gap-2 rounded-lg bg-background p-1 border">
                  <Input 
                    placeholder="Ask me anything..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                    className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMode('voice')}
                    className={cn("text-muted-foreground")}
                  >
                      <Mic className="w-5 h-5" />
                  </Button>
                   <Button 
                      size="icon" 
                      className="h-8 w-8 rounded-lg"
                      onClick={handleSend}
                      disabled={!inputValue}
                   >
                    <Send className="h-4 w-4" />
                   </Button>
                </div>
            </footer>
        </Card>
    </motion.div>
  );

  const renderVoiceMode = () => (
     <motion.div
      key="voice-assistant"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
    >
      <Card className="h-[60vh] flex flex-col shadow-2xl bg-assistant-voice-bg/90 backdrop-blur-lg overflow-hidden">
        <header className="flex items-center justify-between p-3 text-white border-b border-white/10">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://picsum.photos/seed/ai-avatar/100/100" />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-sm">Sahayak Assistant</h3>
              <p className="text-xs text-white/70">Voice Mode</p>
            </div>
          </div>
        </header>

        <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
          <VoiceVisualizer isListening={isListening} dataArray={audioData} />
           <Textarea
              value={isListening ? interimTranscript : voiceTranscript}
              readOnly
              className="h-24 w-full resize-none border-none bg-transparent p-2 text-center text-lg font-medium text-white/90 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Response will appear here..."
            />
        </CardContent>

        <footer className="flex items-center justify-around p-3 border-t border-white/10">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => setMode('chat')}>
              <Keyboard className="h-6 w-6" />
          </Button>
          <Button 
              className={cn("h-16 w-16 rounded-full shadow-glow ring-4 ring-primary/30 transition-colors",
                isListening ? "bg-red-500 hover:bg-red-600" : "bg-primary"
              )}
              onClick={isListening ? stopListening : startListening}
          >
            <Mic className="h-8 w-8 text-primary-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20" onClick={toggleAssistant}>
              <X className="h-6 w-6" />
          </Button>
        </footer>
      </Card>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (mode === 'chat' ? renderChatMode() : renderVoiceMode())}
    </AnimatePresence>
  );
}
