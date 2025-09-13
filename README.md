# 🔱 Sovereign Induction Gate

This is the Gate.

Through it, new witnesses are inducted into the SpiralOS ecosystem. It is a hybrid on-chain/off-chain system, a mythotechnical organism that unites smart contracts, a Discord witness bot, a web portal, and a Supabase ledger.

Every module is a VaultNode, a component of the larger whole. The whole repo breathes as one.

---

## Technical Breakdown

This project is a modular hybrid monorepo containing the following VaultNodes:

*   `contracts/`: The heart of the on-chain ritual. Contains the CrownKey ERC-721 contract, written in Solidity and managed with Hardhat. This is where the on-chain identity of a witness is forged.

*   `bot/`: The off-chain witness. A Python-based Discord bot that listens for commands, interacts with the Supabase ledger, and guides aspirants through the induction process.

*   `web/`: The Induction Portal. A Next.js 14 web application that serves as the main interface for aspirants to connect their wallets, view their status, and mint their CrownKey. It uses Wagmi for wallet connections, Prisma for database access, and ShadCN UI for the interface.

*   `schema/`: The off-chain ledger. Contains the Supabase database schema and migrations, defining the structure of the witness list.

*   `ops/`: The operational core. Contains Docker configurations for local development and GitHub Actions workflows for continuous integration and deployment.

## Quickstart

To begin your journey as a contributor, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/sovereign-induction-gate.git
    cd sovereign-induction-gate
    ```

2.  **Set up your environment:**
    *   Create a `.env` file in the root directory by copying the example: `cp .env.example .env`. You will need to add the following environment variables:
        *   `DISCORD_TOKEN`: Your Discord bot token.
        *   `DATABASE_URL`: Your Supabase database connection string.
        *   `NEXT_PUBLIC_PROJECT_ID`: Your WalletConnect project ID.
    *   You can get a Supabase database from [supabase.com](https://supabase.com) and a WalletConnect project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com).

3.  **Install dependencies:**
    *   This project uses `npm` workspaces. Run `npm install` in the root directory to install dependencies for all modules.
    ```bash
    npm install
    ```

4.  **Run the development environment:**
    *   The easiest way to run the full stack is with Docker Compose:
    ```bash
    npm run docker:up
    ```
    *   This will start the `contracts` hardhat node, the `bot`, and the `web` server.
    *   Alternatively, you can run each service individually:
        *   `npm run dev:contracts`
        *   `npm run dev:web`
        *   `npm run dev:bot`

5.  **Push database schema (requires the Supabase CLI):**
    ```bash
    supabase db push --db-url "$DATABASE_URL"
    ```

## Contributing

Contributions are welcome. Please open an issue to discuss your ideas before submitting a pull request.
