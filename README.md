# neal-cli

A macOS CLI tool for screenshots and OCR.

## Quickstart

```sh
# Interactively select a screen/window to take a screenshot of
neal sc

# Screenshot a specific app + OCR in one shot — prints saved path then extracted text
neal sc "Google Chrome" --no-interactive --ocr

# Verify an window with title matching "Android Emulator" contains expected text — prints ✓/✗ per term, exits 0 (PASS) or 1 (FAIL)
neal verify --title "Android Emulator" --expect "AssociatedBank"

# List all running apps to find the right process name — prints numbered list of foreground processes
neal sc --apps

# OCR an existing image file — prints extracted text to stdout
neal tess screenshot.png
```

## Prerequisites

- **macOS** (no cross-platform support)
- **Node.js** ≥ 18

### GetWindowID (required for `screenshot`)

The `screenshot` command needs [GetWindowID](https://github.com/smokris/GetWindowID) to resolve window IDs.

**Option A — Homebrew:**

```sh
brew install smokris/getwindowid/getwindowid
```

**Option B — Build from source** (if Homebrew isn't available):

```sh
git clone https://github.com/smokris/GetWindowID.git /tmp/GetWindowID
cd /tmp/GetWindowID
clang -framework Cocoa -framework CoreGraphics -o GetWindowID GetWindowID.m
cp GetWindowID ~/.local/bin/   # or anywhere on your PATH
rm -rf /tmp/GetWindowID
```

### Screen Recording permission

`screencapture` requires Screen Recording access for your terminal.
If screenshots come out empty, grant permission in:

> **System Settings → Privacy & Security → Screen Recording**

Then restart your terminal.

## Install

```sh
cd neal-cli
npm install
npm link        # makes `neal` available globally
```

## Commands

### `screenshot` — capture a macOS window

```sh
# Interactive — walks you through picking an app and window
neal screenshot

# Capture a specific app (picks largest window, or prompts if multiple)
neal screenshot "Google Chrome"

# Filter by window title
neal screenshot Safari --title "GitHub"

# Save to a specific path
neal screenshot Notion -o notion.png

# List all windows for an app
neal screenshot Slack --list

# List all running app names
neal screenshot --apps

# Non-interactive — captures ALL matching windows automatically
neal screenshot "Google Chrome" --no-interactive
```

| Option                 | Description                                                  |
|------------------------|--------------------------------------------------------------|
| `-a, --apps`           | List running application names and exit                      |
| `-t, --title <substr>` | Filter windows by title (case-insensitive substring)         |
| `-o, --output <path>`  | Output PNG path (default: `./<app>-<title>-<timestamp>.png`) |
| `-l, --list`           | List matching windows and exit                               |
| `-n, --no-interactive` | Skip prompts; capture all matching windows                   |

### `tess` — extract text from an image (OCR)

```sh
neal tess photo.png
```
