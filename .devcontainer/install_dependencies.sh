#!/usr/bin/env bash
set -euo pipefail

workspace_dir="/workspaces/mgeipel"
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

echo "Wiring bash history to persistent volume..."
mkdir -p /home/node/commandhistory
echo 'export HISTFILE=/home/node/commandhistory/.bash_history' >> /home/node/.bashrc

echo "All dependencies installed."
