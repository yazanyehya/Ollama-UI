"use client";

import React, { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Message } from "ai/react";
import { getSelectedModel } from "@/lib/model-helper";
import useChatStore from "@/app/hooks/useChatStore";

interface ChatTopbarProps {
  isLoading: boolean;
  chatId?: string;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export default function ChatTopbar({
  isLoading,
  chatId,
  messages,
  setMessages,
}: ChatTopbarProps) {
  const [models, setModels] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const selectedModel = useChatStore((state) => state.selectedModel);
  const setSelectedModel = useChatStore((state) => state.setSelectedModel);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/tags");
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        const data = await res.json().catch(() => null);
        if (!data?.models?.length) return;

        setModels(data.models.map(({ name }: { name: string }) => name));
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    })();
  }, []);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={isLoading}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between bg-background/60 border-0 font-medium text-sm"
        >
          {selectedModel || "Select model"}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <div className="max-h-[300px] overflow-y-auto">
          {models.length > 0 ? (
            models.map((model) => (
              <Button
                key={model}
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-sm font-medium"
                onClick={() => {
                  handleModelChange(model);
                }}
              >
                {model}
              </Button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              No models available
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
