import { createContext, useContext, useState } from 'react';

export const SelectedCardsContext = createContext();

export function SelectedCardsProvider({ children }) {
  const [selectedCards, setSelectedCards] = useState([]);

  return (
    <SelectedCardsContext.Provider value={{ selectedCards, setSelectedCards }}>
      {children}
    </SelectedCardsContext.Provider>
  );
}

export function useSelectedCards() {
  return useContext(SelectedCardsContext);
}
