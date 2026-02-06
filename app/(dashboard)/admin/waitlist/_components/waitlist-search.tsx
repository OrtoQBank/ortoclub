"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface WaitlistSearchProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
}

export function WaitlistSearch({
  searchInput,
  onSearchInputChange,
  onSearch,
}: WaitlistSearchProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Buscar por nome, email, WhatsApp ou Instagram..."
        value={searchInput}
        onChange={(e) => onSearchInputChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        className="max-w-md bg-white"
      />
      <Button onClick={onSearch} size="default">
        <Search className="mr-2 h-4 w-4" />
        Buscar
      </Button>
    </div>
  );
}
