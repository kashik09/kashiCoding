#!/usr/bin/env bash
set -euo pipefail

# -------- config --------
REMOTE="${1:-origin}"
BRANCH="${2:-main}"
OUT_DIR="audit"
REPORT_FILE="$OUT_DIR/attribution_report.txt"
ERROR_FILE="$OUT_DIR/attribution_errors.log"
# ------------------------

mkdir -p "$OUT_DIR"

# Redirect stderr to error log
exec 2> >(tee -a "$ERROR_FILE" >&2)

{
  echo "===== ATTRIBUTION AUDIT REPORT ====="
  echo "Generated at: $(date)"
  echo

  echo "== Repo root =="
  git rev-parse --show-toplevel
  echo

  echo "== Current branch / status =="
  git status -sb
  echo

  if git rev-parse --verify -q "${REMOTE}/${BRANCH}" >/dev/null; then
    echo "== Ahead / Behind ${REMOTE}/${BRANCH} =="
    git rev-list --left-right --count "${REMOTE}/${BRANCH}...HEAD" \
      | awk '{print "behind=" $1 ", ahead=" $2}'
    echo
  else
    echo "== Remote branch ${REMOTE}/${BRANCH} not found =="
    echo
  fi

  echo "== Commit counts =="
  echo "local_commits=$(git rev-list --count HEAD)"
  if git rev-parse --verify -q "${REMOTE}/${BRANCH}" >/dev/null; then
    echo "remote_commits=$(git rev-list --count ${REMOTE}/${BRANCH})"
  fi
  echo

  ATTR1='🤖 Generated with'
  ATTR2='Co-Authored-By: Claude Sonnet'

  echo "== Attribution totals (all history) =="
  echo "contains_generated_with=$(git log --format='%B' --all | grep -c "$ATTR1" || true)"
  echo "contains_coauthored_by=$(git log --format='%B' --all | grep -c "$ATTR2" || true)"
  echo

  echo "== Affected commit hashes (counts) =="
  echo "hashes_with_generated_with=$(git log --all --pretty=format:'%H' --grep="$ATTR1" | wc -l)"
  echo "hashes_with_coauthored_by=$(git log --all --pretty=format:'%H' --grep="$ATTR2" | wc -l)"
  echo

  echo "== Latest 280 affected commits (hash | date | subject) =="
  git log --all \
    --grep="$ATTR1" \
    --grep="$ATTR2" \
    --pretty=format:'%h | %ad | %s' \
    --date=short \
    -n 280 || true
  echo

  echo "== NOTE =="
  echo "This script is read-only. No history was modified."
  echo "Send this report + the error log to decide next steps."
  echo

} | tee "$REPORT_FILE"

echo "Audit complete."
echo "Report: $REPORT_FILE"
echo "Errors: $ERROR_FILE"
