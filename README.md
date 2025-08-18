# Huddle01 Testnet Airdrop bot
A Node.js-based automation script that helps you **join Huddle01 rooms** with multiple wallet accounts at once to **earn testnet participation points** efficiently.

## Features
- 🚀 **Multi-wallet support** — loads private keys from `privateKeys.json`.
- 🎭 **Random display name & user-agent** — reduces detection risk.
- 🔗 **Automated login & room joining** — from challenge signing to WebSocket connection.
- 📊 **Points triggering** — triggers relevant actions to earn testnet points.
- 🛡 **Interactive CLI** — easy room ID & account count input.

## Requirements
- Node.js
- NPM
- Huddle01 room ID
- A `privateKeys.json` file with your wallet private keys

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/frankrichardhall/Huddle01-Testnet-Airdrop-bot.git
   cd Huddle01-Testnet-Airdrop-bot
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Create `privateKeys.json`**:
   Create a file named `privateKeys.json` in the root directory with the following format:

   ```json
   [
     "your_private_key_1",
     "your_private_key_2"
   ]
   ```

4. **Run the Bot**:

   ```bash
   npm start
   ```

## Usage

- Use `npm start` to check the menu options available.
- Choose the appropriate command based on the network you want to use.
- The bot will automatically execute the transactions, handling any errors and retrying as needed.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
 