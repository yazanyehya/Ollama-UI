"use client";

import React, { useEffect } from "react";
import { ChatProps } from "./chat";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cross2Icon,
  ImageIcon,
  PaperPlaneIcon,
  StopIcon,
} from "@radix-ui/react-icons";
import { Mic, SendHorizonal } from "lucide-react";
import useSpeechToText from "@/app/hooks/useSpeechRecognition";
import MultiImagePicker from "../image-embedder";
import useChatStore from "@/app/hooks/useChatStore";
import Image from "next/image";
import { ChatRequestOptions, Message } from "ai";
import { ChatInput } from "../ui/chat/chat-input";

interface ChatBottombarProps {
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  isLoading: boolean;
  stop: () => void;
  setInput?: React.Dispatch<React.SetStateAction<string>>;
  input: string;
}

export default function ChatBottombar({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  setInput,
}: ChatBottombarProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const base64Images = useChatStore((state) => state.base64Images);
  const setBase64Images = useChatStore((state) => state.setBase64Images);
  const selectedModel = useChatStore((state) => state.selectedModel);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleImageClick = () => {
    // TODO: Implement image upload functionality
    console.log('Image upload clicked');
  };

  const { isListening, transcript, startListening, stopListening } =
    useSpeechToText({ continuous: true });

  const listen = () => {
    isListening ? stopVoiceInput() : startListening();
  };

  const stopVoiceInput = () => {
    setInput && setInput(transcript.length ? transcript : "");
    stopListening();
  };

  const handleListenClick = () => {
    listen();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      console.log("Input focused");
    }
  }, [inputRef]);

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Button
            type="button"
            variant="ghost"
            className="absolute left-2 p-1 h-8 w-8 hover:bg-accent/50"
            onClick={handleImageClick}
          >
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </Button>
          
          <ChatInput
            ref={inputRef}
            autoFocus
            tabIndex={0}
            rows={1}
            value={input}
            onChange={handleInputChange}
            placeholder="Message..."
            spellCheck={false}
            className="min-h-[56px] w-full resize-none bg-background/80 pl-12 pr-14 py-4 rounded-2xl border shadow-sm focus-visible:ring-1 focus-visible:ring-accent"
            onKeyDown={handleKeyDown}
          />

          <div className="absolute right-2 flex items-center">
            {isLoading ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-accent/50"
                onClick={stop}
              >
                <StopIcon className="h-5 w-5 text-muted-foreground" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                disabled={!input.trim()}
                className="h-8 w-8 hover:bg-accent/50 disabled:opacity-40"
              >
                <PaperPlaneIcon className="h-5 w-5 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>
      </form>
      
      {base64Images && base64Images.length > 0 && (
        <div className="flex gap-2 mt-2">
          {base64Images.map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={image}
                width={80}
                height={80}
                alt=""
                className="rounded-lg border object-cover"
              />
              <Button
                onClick={() => {
                  const updatedImages = base64Images.filter((_, i) => i !== index);
                  setBase64Images(updatedImages);
                }}
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
              >
                <Cross2Icon className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
