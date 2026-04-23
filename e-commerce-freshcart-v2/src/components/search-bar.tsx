"use client";

import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const [keyword, setKeyword] = useQueryState("keyword", { defaultValue: "", shallow: false });
  const [draft, setDraft] = useState(keyword);

  useEffect(() => {
    const t = setTimeout(() => setKeyword(draft || null), 350);
    return () => clearTimeout(t);
  }, [draft, setKeyword]);

  useEffect(() => {
    setDraft(keyword);
  }, [keyword]);

  return (
    <div className="relative flex-1">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Search products…"
        className="pl-9 pr-9"
        aria-label="Search products"
      />
      {draft && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => { setDraft(""); setKeyword(null); }}
          aria-label="Clear search"
        >
          <X size={14} />
        </Button>
      )}
    </div>
  );
}
