#!/bin/bash
# Remove Claude Code attribution from commit message
sed -e '/🤖 Generated with \[Claude Code\]/d' \
    -e '/Co-Authored-By: Claude/d' \
    -e '/^$/N;/^\n$/D'
