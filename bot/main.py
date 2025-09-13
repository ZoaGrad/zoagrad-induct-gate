import os
import json
import logging
import asyncio
import discord
from discord.ext import commands
from dotenv import load_dotenv
from supabase import Client, create_client
from web3 import Web3
from typing import Optional, Set

# ----------------------------------------------------------------------------
# Configuration & Clients
# ----------------------------------------------------------------------------

load_dotenv()

DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    logger.warning("Supabase credentials missing; witness command disabled.")

RPC_URL = os.getenv("RPC_URL")
CROWN_CONTRACT_ADDRESS = os.getenv("CROWN_CONTRACT_ADDRESS")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CHAIN_ID = int(os.getenv("CHAIN_ID", "1"))

# Minimal ABI for CrownKey's safeMint
CROWN_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "to", "type": "address"}],
        "name": "safeMint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    }
]

w3: Optional[Web3] = None
crown_contract = None
account = None
if RPC_URL and CROWN_CONTRACT_ADDRESS and PRIVATE_KEY:
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    crown_contract = w3.eth.contract(address=CROWN_CONTRACT_ADDRESS, abi=CROWN_ABI)
    account = w3.eth.account.from_key(PRIVATE_KEY)
else:
    logger.warning("Blockchain credentials missing; crown command disabled.")

ADMIN_USER_IDS: Set[str] = {
    uid.strip() for uid in os.getenv("ADMIN_USER_IDS", "").split(",") if uid.strip()
}


def is_admin(user_id: int) -> bool:
    return str(user_id) in ADMIN_USER_IDS


def mint_crown(target: str) -> str:
    nonce = w3.eth.get_transaction_count(account.address)
    tx = crown_contract.functions.safeMint(target).build_transaction(
        {
            "chainId": CHAIN_ID,
            "gas": 300000,
            "gasPrice": w3.eth.gas_price,
            "nonce": nonce,
            "from": account.address,
        }
    )
    signed_tx = account.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    return tx_hash.hex()


# Initialize the bot
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)


@bot.event
async def on_ready():
    logger.info("Logged in as %s", bot.user.name)


@bot.command(name="crown")
async def crown(ctx, address: str):
    """Mint a CrownKey NFT to the provided address."""
    if not is_admin(ctx.author.id):
        await ctx.send("You do not have permission to mint.")
        return
    if crown_contract is None:
        await ctx.send("Crown contract not configured.")
        return
    try:
        tx_hash = await asyncio.to_thread(mint_crown, address)
        await ctx.send(f"CrownKey minted: {tx_hash}")
    except Exception as exc:
        logger.exception("Minting failed")
        await ctx.send(f"Minting failed: {exc}")


@bot.command(name="witness")
async def witness(ctx):
    """Query Supabase for the caller's witness status."""
    if not is_admin(ctx.author.id):
        await ctx.send("You do not have permission to query witnesses.")
        return
    if supabase is None:
        await ctx.send("Supabase client not configured.")
        return
    try:
        response = (
            supabase.table("witnesses")
            .select("status")
            .eq("discord_id", str(ctx.author.id))
            .execute()
        )
        if response.data:
            status = response.data[0].get("status")
            await ctx.send(f"Witness status: {status}")
        else:
            await ctx.send("No witness record found.")
    except Exception as exc:
        logger.exception("Witness query failed")
        await ctx.send(f"Witness query failed: {exc}")


@bot.slash_command(name="unfold", description="Unfold a new vision.")
async def unfold(ctx):
    """Reserved for future sigil/vision logic."""
    if not is_admin(ctx.author.id):
        await ctx.respond("You do not have permission to unfold visions.")
        return
    logger.info("Unfold command invoked by %s", ctx.author)
    await ctx.respond("Vision unfolding will be available soon.")


if __name__ == "__main__":
    if DISCORD_TOKEN is None:
        logger.error("DISCORD_TOKEN not found in environment.")
    else:
        bot.run(DISCORD_TOKEN)
