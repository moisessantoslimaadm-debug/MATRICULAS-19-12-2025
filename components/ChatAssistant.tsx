import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, HelpCircle, FileText, Calendar, MapPin, GraduationCap } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { useData } from '../contexts/DataContext';

export const ChatAssistant: React.FC = () => {
  const { schools } = useData(); 
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', text: 'Olá! Sou o Edu, seu assistente escolar 🤖.\n\nPosso ajudar a encontrar escolas próximas, verificar vagas ou explicar como fazer a matrícula. O que você precisa?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', isLoading: true }]);

    try {
      const stream = await sendMessageToGemini(userMsg.text, schools);
      let fullText = '';
      
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId 
            ? { ...msg, text: fullText, isLoading: false } 
            : msg
        ));
      }
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId 
          ? { ...msg, text: "Lamento, houve uma oscilação na rede de inteligência. Por favor, tente novamente.", isLoading: false } 
          : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    { icon: <MapPin className="h-3 w-3" />, text: "Quais escolas têm vaga?" },
    { icon: <FileText className="h-3 w-3" />, text: "Documentos necessários" },
    { icon: <GraduationCap className="h-3 w-3" />, text: "Escolas infantis" },
    { icon: <Calendar className="h-3 w-3" />, text: "Prazo de matrícula" },
  ];

  return (
    <div className="fixed bottom-10 right-10 z-[200] flex flex-col items-end no-print">
      {isOpen && (
        <div className="bg-white rounded-[2.5rem] shadow-luxury w-80 sm:w-96 h-[600px] mb-6 flex flex-col border border-emerald-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500 ring-1 ring-emerald-100/50">
          {/* Header */}
          <div className="bg-[#022c22] p-6 flex justify-between items-center text-white shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest">Assistente Edu</h3>
                <span className="text-[9px] text-emerald-400 flex items-center gap-2 font-black uppercase tracking-ultra">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Online • Itaberaba
                </span>
              </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 scrollbar-thin scrollbar-thumb-emerald-100 scrollbar-track-transparent">
            <div className="space-y-6">
               {messages.length === 1 && (
                 <div className="grid grid-cols-1 gap-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-ultra ml-1">Sugestões de Rede</p>
                   <div className="grid grid-cols-2 gap-3">
                     {suggestions.map((s, i) => (
                       <button
                         key={i}
                         onClick={() => handleSend(s.text)}
                         className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-emerald-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-950 hover:border-emerald-200 transition-all shadow-sm h-full"
                       >
                         <div className="text-emerald-600 bg-emerald-50 p-2 rounded-xl">{s.icon}</div>
                         {s.text}
                       </button>
                     ))}
                   </div>
                 </div>
               )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[1.8rem] px-6 py-4 text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white text-emerald-950 border border-emerald-50 rounded-bl-none font-medium'
                    }`}
                  >
                    {msg.isLoading ? (
                       <div className="flex items-center gap-2 py-1">
                          <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce"></span>
                       </div>
                    ) : (
                      <div className="markdown-body whitespace-pre-wrap">{msg.text}</div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-emerald-50">
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Como posso ajudar?"
                className="flex-1 px-6 py-4 bg-slate-50 border border-emerald-100/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:bg-white transition-all text-sm font-semibold text-emerald-950 placeholder:text-slate-300"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-[#022c22] text-white p-4 rounded-2xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl active:scale-95"
              >
                {isTyping ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
              </button>
            </div>
            <div className="flex justify-center mt-3">
               <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                  <HelpCircle className="h-3 w-3" /> IA Oficial SME • Itaberaba Digital
               </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        } transition-all duration-700 absolute bottom-0 right-0 bg-[#022c22] hover:bg-emerald-700 text-white p-5 rounded-[1.8rem] shadow-luxury flex items-center justify-center ring-8 ring-white z-[200]`}
      >
        <MessageCircle className="h-8 w-8" />
        {!isOpen && messages.length === 1 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-600 text-[10px] text-white items-center justify-center font-black">1</span>
            </span>
        )}
      </button>
      
       <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          !isOpen ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        } transition-all duration-700 absolute bottom-0 right-0 bg-slate-900 text-white p-5 rounded-[1.8rem] shadow-xl flex items-center justify-center ring-8 ring-white z-[200]`}
      >
        <X className="h-8 w-8" />
      </button>
    </div>
  );
};