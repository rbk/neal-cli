---
name: neal-cli
description: Use when needing to verify an application is running and visible in a macOS window, capture a screenshot of a specific app window, extract text from a screenshot or image via OCR, or confirm UI state by reading on-screen text
---

# neal CLI

## Overview

`neal` captures macOS application windows as screenshots and extracts text from images via OCR (Tesseract). The primary
agent workflow is: screenshot a window → OCR the image → verify the content matches expectations.

## When to Use

- Verify an app launched and is displaying expected content
- Capture visual state of a running application window
- Extract text from a screenshot or any image file
- Confirm UI text (error messages, status indicators, page titles) without browser tools
- Check which applications are currently running on the Mac

## Prerequisites

- **GetWindowID** — `brew install smokris/getwindowid/getwindowid`
- **Screen Recording permission** granted to the terminal in System Settings → Privacy & Security → Screen Recording
- **Node.js** (runs via the shell wrapper)

## Quick Reference

| Task                     | Command                                         |
|--------------------------|-------------------------------------------------|
| List running apps        | `neal screenshot --apps`                        |
| List windows for an app  | `neal screenshot "AppName" --list`              |
| Capture largest window   | `neal screenshot "AppName" --no-interactive`    |
| Capture window by title  | `neal screenshot "AppName" --title "substr" -n` |
| Capture to specific path | `neal screenshot "AppName" -n -o /tmp/shot.png` |
| OCR an image             | `neal tess /path/to/image.png`                  |

## Core Workflow: Verify App is Running

```bash
# 1. Check the app is running
neal screenshot --apps
# Look for the app name in the list

# 2. Capture its window (non-interactive for agent use)
neal screenshot "MyApp" --no-interactive -o /tmp/myapp.png

# 3. OCR the screenshot to read on-screen text
neal tess /tmp/myapp.png

# 4. Verify output contains expected text
# (parse the OCR output for expected strings)
```

## Important Flags

- **`--no-interactive` / `-n`** — ALWAYS use this in agent/automated contexts. Without it, the CLI prompts for user
  input when multiple windows match.
- **`--title <substr>`** — narrow to a specific window by title substring (case-insensitive). Useful when an app has
  multiple windows.
- **`--list` / `-l`** — dry-run that prints matching windows without capturing. Use to verify window exists before
  capture.

## Common Mistakes

| Mistake                       | Fix                                                                           |
|-------------------------------|-------------------------------------------------------------------------------|
| Forgetting `--no-interactive` | CLI hangs waiting for stdin. Always pass `-n` in scripts/agents.              |
| App name doesn't match        | Use `neal screenshot --apps` first to get the exact process name.             |
| Empty screenshot file         | Screen Recording permission denied. User must grant it in System Settings.    |
| OCR returns garbage           | Window may be minimized or occluded. Ensure window is visible before capture. |
| GetWindowID not found         | Install with `brew install smokris/getwindowid/getwindowid`.                  |

## Output

- **`screenshot`** prints the saved file path: `Saved: /path/to/file.png  (window "Title", WxH)`
- **`tess`** prints extracted text to stdout, one block per recognized region.

## Tips for Agents

- Combine `--list` with `--title` to confirm exactly one window matches before capturing.
- When verifying a specific page/state, use `--title` to target the right window (e.g., `--title "Dashboard"` for a
  browser tab).
- OCR accuracy depends on font size and contrast. Buttons and headers OCR well; tiny footnotes may not.
- If multiple windows exist and you omit `--title`, the largest window is captured automatically in non-interactive
  mode.
