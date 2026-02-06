"use client";

import { useState } from "react";

import { api } from "@/convex/_generated/api";
import { WaitlistSearch } from "./waitlist-search";
import { WaitlistTable } from "./waitlist-table";
import { Button } from "@/components/ui/button";

import { useQuery } from "convex/react";

export function WaitlistPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  const entries = useQuery(api.waitlist.list, {});
  const isLoading = entries === undefined;

  const filteredEntries = (entries ?? []).filter((entry) => {
    if (!searchQuery.trim()) return true;
    const search = searchQuery.toLowerCase();
    return (
      entry.name.toLowerCase().includes(search) ||
      entry.email.toLowerCase().includes(search) ||
      entry.whatsapp.toLowerCase().includes(search) ||
      entry.instagram?.toLowerCase().includes(search)
    );
  });

  function handleSearch() {
    setSearchQuery(searchInput.trim());
  }



  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <div className="border-b pt-12">
        <div className="p-4 pt-12 flex items-center pl-14 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Lista de Espera
            </h1>
          </div>
        </div>
      </div>

      {/* Content with standardized padding */}
      <div className="p-6 pb-12 md:p-12">
        <div className="max-w-5xl mx-auto">
          {/* Search */}
          <div className="mb-6">
            <WaitlistSearch
              searchInput={searchInput}
              onSearchInputChange={setSearchInput}
              onSearch={handleSearch}
            />
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-4">
            {isLoading
              ? "Carregando..."
              : searchQuery.trim()
                ? `Mostrando ${filteredEntries.length} resultado(s) da busca.`
                : `Mostrando ${Math.min(visibleCount, (entries ?? []).length)} de ${(entries ?? []).length} inscricao(oes).`}
          </p>

          {/* Table */}
          <div className="mb-8">
            <WaitlistTable
              entries={searchQuery.trim() ? filteredEntries : filteredEntries.slice(0, visibleCount)}
              isLoading={isLoading}
              hasSearchQuery={!!searchQuery.trim()}
            />
          </div>

          {/* Load more */}
          {!searchQuery.trim() && visibleCount < (entries ?? []).length && (
            <div className="flex justify-center">
              <Button variant="outline" size="lg" onClick={() => setVisibleCount((c) => c + 10)}>
                Ver mais
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
