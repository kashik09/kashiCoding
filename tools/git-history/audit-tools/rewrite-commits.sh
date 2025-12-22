#!/bin/bash
# Create a script to rewrite all commit messages

# Get the root commit
ROOT=$(git rev-list --max-parents=0 HEAD)

# Rewrite all commits from root
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --msg-filter '
sed -e "/🤖 Generated with \[Claude Code\]/d" \
    -e "/Co-Authored-By: Claude/d" \
    -e "/^$/N;/^\n$/D"
' $ROOT..HEAD
