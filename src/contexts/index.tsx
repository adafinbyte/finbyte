import { createContext, FC, ReactNode, useState } from "react";

import { Wallet } from "@meshsdk/core";
import { Currency, Themes } from "./utils";

type finbyte_context = {
  /** @note allows info about the wallet connecting */
  wallet: Wallet | undefined;
  toggle_wallet: (new_wallet: Wallet) => void;

  /** @note allows end user to change local currency */
  currency: Currency;
  toggle_currency: (new_currency: Currency) => void;

  /** @note allows end user to change global theme */
  theme: Themes;
  toggle_theme: (new_theme: Themes) => void;
};

export const FinbyteContext = createContext<finbyte_context>({
  wallet: undefined,
  toggle_wallet: () => {},

  currency: "USD",
  toggle_currency: () => {},

  theme: 'Neutral',
  toggle_theme: () => {},
});

interface custom_props {
  children: ReactNode;
}

export const FinbyteProvider: FC <custom_props> = ({ children }) => {
  const [wallet, set_wallet] = useState<Wallet | undefined>(undefined);
  const toggle_wallet = (new_wallet: Wallet) => {
    set_wallet(new_wallet);
  };

  const [currency, set_currency] = useState<Currency>("USD");
  const toggle_currency = (new_currency: Currency) => {
    set_currency(new_currency);
  };

  const [theme, set_theme] = useState<Themes>('Slate');
  const toggle_theme = (new_theme: Themes) => {
    set_theme(new_theme);
  };

  return (
    <FinbyteContext.Provider
      value={{
        wallet,   toggle_wallet,
        currency, toggle_currency,
        theme,    toggle_theme,
      }}
    >
      {children}
    </FinbyteContext.Provider>
  );
};
