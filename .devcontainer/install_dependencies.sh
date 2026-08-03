#!/usr/bin/env bash
set -euo pipefail

workspace_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
current_user="$(id -un)"
current_group="$(id -gn)"

echo "Fixing node_modules permissions..."
sudo chown -R "$current_user:$current_group" \
  "$workspace_dir/node_modules" \
  "$HOME/.claude" \
  "$HOME/commandhistory"
 

echo "Fixing Claude Code npm ownership (installed by devcontainer feature as root)..."
sudo chown -R "$current_user:$current_group" /usr/local/share/npm-global

echo "Installing global dependencies..."
npm install -g  @angular/cli

echo "Installing Playwright and Chromium browser..."
npm install -g playwright
npx --yes playwright install --with-deps chromium

echo "Linking Chromium for VS Code's Chrome debug configs..."
chromium_dir="$(find "$HOME/.cache/ms-playwright" -maxdepth 1 -type d -name 'chromium-*' | sort -V | tail -n1)"
sudo ln -sf "$chromium_dir/chrome-linux64/chrome" /usr/local/bin/playwright-chromium

echo "Wiring bash history to persistent volume..."
mkdir -p /home/node/commandhistory
echo 'export HISTFILE=/home/node/commandhistory/.bash_history' >> /home/node/.bashrc

echo "All dependencies installed."
