import { create } from "zustand";

interface SearchState {
    search: string;
    setSearch: (search: string) => void;
    column: string;
    setColumn: (column: string) => void;
}

export const useSearch = create<SearchState>((set) => ({
    search: "",
    setSearch: (search: string) => set({ search }),
    column: "",
    setColumn: (column: string) => set({ column }),
}))
