#!/usr/bin/env python3
import re

ATTR_LINE = "🤖 Generated with [Claude Code](https://claude.com/claude-code)"

# Remove either "Claude Sonnet 4.5 <...>" or plain "Claude <...>"
COAUTHOR_RE = re.compile(
    r"^Co-Authored-By:\s*Claude(?:\s+Sonnet\s+4\.5)?\s*<noreply@anthropic\.com>\s*$",
    re.MULTILINE
)

def clean(msg: bytes) -> bytes:
    s = msg.decode("utf-8", errors="replace")

    s = s.replace(ATTR_LINE, "")
    s = COAUTHOR_RE.sub("", s)

    # normalize whitespace
    s = re.sub(r"\n{3,}", "\n\n", s).strip() + "\n"
    return s.encode("utf-8")

if __name__ == "__main__":
    import sys
    sys.stdout.buffer.write(clean(sys.stdin.buffer.read()))
