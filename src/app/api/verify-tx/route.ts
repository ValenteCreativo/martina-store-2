import { NextRequest, NextResponse } from 'next/server';
import { db, cryptoOrders, artworks } from '../../../db';
import { eq } from 'drizzle-orm';
import { createPublicClient, http, parseAbi } from 'viem';
import { base, polygon, arbitrum, mainnet, baseSepolia, sepolia } from 'viem/chains';

const CHAIN_CONFIG = {
  1: mainnet,
  8453: base,
  137: polygon,
  42161: arbitrum,
  84532: baseSepolia,
  11155111: sepolia,
} as const;

// ERC20 Transfer event signature
const ERC20_TRANSFER_ABI = parseAbi([
  'event Transfer(address indexed from, address indexed to, uint256 value)',
]);

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Los pagos con cripto están temporalmente desactivados.' }, { status: 410 });
  /*
  try {
    const { orderId, txHash, chainId } = await request.json();

    if (!orderId || !txHash || !chainId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get order
    const [order] = await db
      .select()
      .from(cryptoOrders)
      .where(eq(cryptoOrders.id, orderId));

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.status === 'paid') {
      return NextResponse.json({
        success: true,
        message: 'Order already verified',
        order,
      });
    }

    // Create public client for the chain
    const chain = CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG];
    if (!chain) {
      return NextResponse.json(
        { error: 'Unsupported chain' },
        { status: 400 }
      );
    }

    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    // Get transaction receipt
    const receipt = await publicClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    if (receipt.status !== 'success') {
      return NextResponse.json(
        { error: 'Transaction failed' },
        { status: 400 }
      );
    }

    // Verify the transaction is to the correct token contract
    if (receipt.to?.toLowerCase() !== order.tokenAddress.toLowerCase()) {
      return NextResponse.json(
        { error: 'Invalid token contract' },
        { status: 400 }
      );
    }

    // Verify recipient (Martina's wallet)
    const recipientAddress = process.env.NEXT_PUBLIC_MARTINA_WALLET?.toLowerCase();
    if (!recipientAddress) {
      console.error('MARTINA_WALLET_ADDRESS not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse logs to find Transfer event
    let validTransfer = false;
    for (const log of receipt.logs) {
      try {
        // Check if this is a Transfer event to Martina's wallet
        if (log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
          // Transfer event signature
          const to = `0x${log.topics[2]?.slice(26)}`.toLowerCase();
          if (to === recipientAddress) {
            validTransfer = true;
            break;
          }
        }
      } catch {
        continue;
      }
    }

    if (!validTransfer) {
      return NextResponse.json(
        { error: 'Payment not sent to correct address' },
        { status: 400 }
      );
    }

    // Update order status
    const [updatedOrder] = await db
      .update(cryptoOrders)
      .set({
        txHash,
        status: 'paid',
        updatedAt: new Date(),
      })
      .where(eq(cryptoOrders.id, orderId))
      .returning();

    // Mark artwork as unavailable
    if (order.artworkId) {
      await db
        .update(artworks)
        .set({
          available: false,
          updatedAt: new Date(),
        })
        .where(eq(artworks.id, order.artworkId));
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Transaction verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify transaction' },
      { status: 500 }
    );
  }
  */
}
