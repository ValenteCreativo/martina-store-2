'use client';

import { CreditCard, Wallet } from 'lucide-react';
import { CHAIN_NAMES, SUPPORTED_CHAIN_IDS } from '../../lib/crypto';

export type PaymentMethod = 'crypto' | 'mercadopago';
export type TokenType = 'USDC' | 'USDT';
// Do not expose an incomplete payment rail to buyers. Re-enable only with a reviewed flow.
const CRYPTO_CHECKOUT_ENABLED = false;

interface PaymentSelectorProps {
  onMethodChange: (method: PaymentMethod) => void;
  onChainChange: (chainId: number) => void;
  onTokenChange: (token: TokenType) => void;
  selectedMethod: PaymentMethod;
  selectedChain: number;
  selectedToken: TokenType;
  priceUsd: number;
  disabled?: boolean;
}

export default function PaymentSelector({
  onMethodChange,
  onChainChange,
  onTokenChange,
  selectedMethod,
  selectedChain,
  selectedToken,
  priceUsd,
  disabled = false,
}: PaymentSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Payment Method Toggle */}
      <div className="flex gap-2">
        {CRYPTO_CHECKOUT_ENABLED && <button
          type="button"
          disabled={disabled}
          onClick={() => onMethodChange('mercadopago')}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 px-4
            border transition-all duration-300
            ${selectedMethod === 'mercadopago'
              ? 'border-[#8a1c1c] bg-[#8a1c1c]/10 text-[#e5e5e5]'
              : 'border-[#1a1a1a] bg-transparent text-[#606060] hover:border-[#303030]'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <CreditCard className="w-4 h-4" />
          <span className="text-sm font-cinzel">Card / Transfer</span>
        </button>}

        <button
          type="button"
          disabled={disabled}
          onClick={() => onMethodChange('crypto')}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 px-4
            border transition-all duration-300
            ${selectedMethod === 'crypto'
              ? 'border-[#8a1c1c] bg-[#8a1c1c]/10 text-[#e5e5e5]'
              : 'border-[#1a1a1a] bg-transparent text-[#606060] hover:border-[#303030]'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Wallet className="w-4 h-4" />
          <span className="text-sm font-cinzel">Crypto</span>
        </button>
      </div>

      {/* Crypto Options */}
      {CRYPTO_CHECKOUT_ENABLED && selectedMethod === 'crypto' && (
        <div className="space-y-4 animate-fade-in">
          {/* Chain Selector */}
          <div>
            <label className="block text-xs text-[#606060] uppercase tracking-wider mb-2">
              Network
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_CHAIN_IDS.map((chainId) => (
                <button
                  key={chainId}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChainChange(chainId)}
                  className={`
                    py-2 px-3 text-sm border transition-all duration-300
                    ${selectedChain === chainId
                      ? 'border-[#8a1c1c] bg-[#8a1c1c]/10 text-[#e5e5e5]'
                      : 'border-[#1a1a1a] bg-transparent text-[#606060] hover:border-[#303030]'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {CHAIN_NAMES[chainId]}
                </button>
              ))}
            </div>
          </div>

          {/* Token Selector */}
          <div>
            <label className="block text-xs text-[#606060] uppercase tracking-wider mb-2">
              Currency
            </label>
            <div className="flex gap-2">
              {(['USDC', 'USDT'] as TokenType[]).map((token) => (
                <button
                  key={token}
                  type="button"
                  disabled={disabled}
                  onClick={() => onTokenChange(token)}
                  className={`
                    flex-1 py-2 px-4 text-sm border transition-all duration-300
                    ${selectedToken === token
                      ? 'border-[#8a1c1c] bg-[#8a1c1c]/10 text-[#e5e5e5]'
                      : 'border-[#1a1a1a] bg-transparent text-[#606060] hover:border-[#303030]'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          {/* Price Display */}
          <div className="pt-4 border-t border-[#1a1a1a]">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#606060]">Total</span>
              <span className="text-xl font-cinzel text-[#e5e5e5]">
                {priceUsd.toFixed(2)} {selectedToken}
              </span>
            </div>
            <p className="text-xs text-[#9a9a9a] mt-1">
              Stablecoins are pegged 1:1 to USD
            </p>
          </div>
        </div>
      )}

      {/* MercadoPago Info */}
      {selectedMethod === 'mercadopago' && (
        <div className="space-y-4 animate-fade-in">
          <div className="pt-4 border-t border-[#1a1a1a]">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#606060]">Total</span>
              <span className="text-xl font-cinzel text-[#e5e5e5]">
                ${priceUsd.toFixed(2)} USD
              </span>
            </div>
            <p className="text-xs text-[#9a9a9a] mt-1">
              Pay with credit/debit card or bank transfer via MercadoPago
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
