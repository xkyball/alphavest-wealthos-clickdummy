#!/usr/bin/env bash
set -euo pipefail

# collect.sh
# Run from project root:
#   bash collect.sh
#
# Output:
#   _next_docker_context_YYYYMMDD_HHMMSS/
#   _next_docker_context_YYYYMMDD_HHMMSS.tar.gz
#
# macOS-compatible version:
# - does NOT use GNU find -maxdepth
# - avoids copying real .env secrets
# - excludes node_modules, .next, .git, build artifacts and caches

TS="$(date +"%Y%m%d_%H%M%S")"
ROOT="$(pwd)"
OUT="${ROOT}/_next_docker_context_${TS}"
ARCHIVE="${OUT}.tar.gz"

mkdir -p "$OUT"/{root,apps,env,system,diagnostics}

write_cmd_version() {
  local name="$1"
  local cmd="$2"

  {
    echo "## ${name}"
    if command -v "${cmd%% *}" >/dev/null 2>&1; then
      ${cmd} 2>&1 || true
    else
      echo "not installed / not found in PATH"
    fi
    echo
  } >> "$OUT/system/versions.txt"
}

sanitize_env_file() {
  local src="$1"
  local dest="$2"

  if [ ! -f "$src" ]; then
    return 0
  fi

  mkdir -p "$(dirname "$dest")"

  awk '
    BEGIN { FS="=" }
    /^[[:space:]]*#/ { print; next }
    /^[[:space:]]*$/ { print; next }
    /^[A-Za-z_][A-Za-z0-9_]*=/ {
      key=$1
      print key"=<MASKED>"
      next
    }
    { print "# UNPARSED_OR_NON_STANDARD_LINE_MASKED" }
  ' "$src" > "$dest"
}

safe_find() {
  local root="$1"
  shift

  find "$root" \
    \( \
      -path "$OUT" -o \
      -name "node_modules" -o \
      -name ".next" -o \
      -name ".git" -o \
      -name "dist" -o \
      -name "build" -o \
      -name "coverage" -o \
      -name ".turbo" -o \
      -name ".cache" -o \
      -name "out" -o \
      -name ".vercel" \
    \) -type d -prune -o "$@"
}

relpath() {
  sed "s#^$ROOT/##"
}

echo "Collecting Next/Docker context from: $ROOT"
echo "Output folder: $OUT"

cat > "$OUT/README.txt" <<EOF
Collected context for extending docker-compose.yml with a Next.js web service.

Generated at: ${TS}
Project root: ${ROOT}

Important:
- Real .env values are NOT copied.
- Env files are sanitized to keys only with <MASKED> values.
- node_modules, .next, .git, dist, build, coverage and caches are excluded.
EOF

# -------------------------------------------------------------------
# Root-level files
# -------------------------------------------------------------------

ROOT_FILES=(
  "docker-compose.yml"
  "docker-compose.yaml"
  "compose.yml"
  "compose.yaml"
  "Dockerfile"
  "Dockerfile.web"
  "Dockerfile.next"
  ".dockerignore"
  ".nvmrc"
  ".node-version"
  ".npmrc"
  "package.json"
  "package-lock.json"
  "pnpm-lock.yaml"
  "pnpm-workspace.yaml"
  "yarn.lock"
  "bun.lockb"
  "next.config.js"
  "next.config.mjs"
  "next.config.ts"
  "tsconfig.json"
  "jsconfig.json"
  "postcss.config.js"
  "postcss.config.mjs"
  "tailwind.config.js"
  "tailwind.config.ts"
  "turbo.json"
  "nx.json"
  "prisma/schema.prisma"
)

for f in "${ROOT_FILES[@]}"; do
  if [ -f "$ROOT/$f" ]; then
    mkdir -p "$OUT/root/$(dirname "$f")"
    cp "$ROOT/$f" "$OUT/root/$f"
  fi
done

# -------------------------------------------------------------------
# Sanitized env files
# -------------------------------------------------------------------

ENV_FILES=(
  ".env"
  ".env.local"
  ".env.development"
  ".env.development.local"
  ".env.production"
  ".env.production.local"
  ".env.example"
)

for f in "${ENV_FILES[@]}"; do
  sanitize_env_file "$ROOT/$f" "$OUT/env/${f}.sanitized"
done

# -------------------------------------------------------------------
# Project tree, depth-limited without GNU -maxdepth
# -------------------------------------------------------------------

{
  echo "# Project tree, max depth 5"
  echo "# Excludes: node_modules, .next, .git, dist, build, coverage, .turbo, .cache, out, .vercel"
  echo

  safe_find "$ROOT" -print \
    | sed "s#^$ROOT#.#" \
    | awk '
        {
          path=$0
          gsub(/^\.\//, "", path)
          if (path == ".") {
            print $0
            next
          }
          depth=gsub(/\//, "/", path) + 1
          if (depth <= 5) print $0
        }
      ' \
    | sort
} > "$OUT/diagnostics/project_tree.txt"

# -------------------------------------------------------------------
# System/tool versions
# -------------------------------------------------------------------

: > "$OUT/system/versions.txt"

write_cmd_version "OS" "uname -a"
write_cmd_version "Node" "node --version"
write_cmd_version "npm" "npm --version"
write_cmd_version "pnpm" "pnpm --version"
write_cmd_version "yarn" "yarn --version"
write_cmd_version "bun" "bun --version"
write_cmd_version "Docker" "docker --version"

{
  echo "## Docker Compose"
  if command -v docker >/dev/null 2>&1; then
    docker compose version 2>&1 || true
  else
    echo "docker not installed / not found in PATH"
  fi
  echo
} >> "$OUT/system/versions.txt"

# -------------------------------------------------------------------
# Detect package manager
# -------------------------------------------------------------------

{
  echo "# Package manager detection"
  echo

  if [ -f "$ROOT/bun.lockb" ]; then
    echo "Detected: bun"
  elif [ -f "$ROOT/pnpm-lock.yaml" ]; then
    echo "Detected: pnpm"
  elif [ -f "$ROOT/yarn.lock" ]; then
    echo "Detected: yarn"
  elif [ -f "$ROOT/package-lock.json" ]; then
    echo "Detected: npm"
  else
    echo "Detected: unknown"
  fi
} > "$OUT/diagnostics/package_manager.txt"

# -------------------------------------------------------------------
# Detect Next.js app package.json files
# -------------------------------------------------------------------

NEXT_PACKAGE_LIST="$OUT/diagnostics/next_package_json_locations.txt"
: > "$NEXT_PACKAGE_LIST"

while IFS= read -r pkg; do
  if grep -q '"next"[[:space:]]*:' "$pkg"; then
    rel="${pkg#$ROOT/}"
    echo "$rel" >> "$NEXT_PACKAGE_LIST"

    app_dir="$(dirname "$rel")"
    dest="$OUT/apps/$app_dir"
    mkdir -p "$dest"

    cp "$ROOT/$rel" "$dest/package.json"

    for candidate in \
      "$app_dir/package-lock.json" \
      "$app_dir/pnpm-lock.yaml" \
      "$app_dir/yarn.lock" \
      "$app_dir/bun.lockb" \
      "$app_dir/next.config.js" \
      "$app_dir/next.config.mjs" \
      "$app_dir/next.config.ts" \
      "$app_dir/tsconfig.json" \
      "$app_dir/jsconfig.json" \
      "$app_dir/Dockerfile" \
      "$app_dir/.dockerignore" \
      "$app_dir/prisma/schema.prisma"; do

      normalized="${candidate#./}"

      if [ -f "$ROOT/$normalized" ]; then
        mkdir -p "$OUT/apps/$(dirname "$normalized")"
        cp "$ROOT/$normalized" "$OUT/apps/$normalized"
      fi
    done

    for envfile in \
      "$app_dir/.env" \
      "$app_dir/.env.local" \
      "$app_dir/.env.development" \
      "$app_dir/.env.production" \
      "$app_dir/.env.example"; do

      normalized_env="${envfile#./}"

      if [ -f "$ROOT/$normalized_env" ]; then
        safe_name="$(echo "$normalized_env" | sed 's#/#__#g')"
        sanitize_env_file "$ROOT/$normalized_env" "$OUT/env/${safe_name}.sanitized"
      fi
    done
  fi
done < <(
  safe_find "$ROOT" -name package.json -type f | sort
)

if [ ! -s "$NEXT_PACKAGE_LIST" ]; then
  echo "No package.json with a direct \"next\" dependency found." > "$NEXT_PACKAGE_LIST"
fi

# -------------------------------------------------------------------
# Extract package scripts and key dependencies
# -------------------------------------------------------------------

{
  echo "# package.json script/dependency hints"
  echo

  PACKAGE_SUMMARY_LIST="$(mktemp)"
  {
    if [ -f "$ROOT/package.json" ]; then
      echo "package.json"
    fi

    grep -v '^No package' "$NEXT_PACKAGE_LIST" 2>/dev/null || true
  } | sort -u > "$PACKAGE_SUMMARY_LIST"

  while IFS= read -r pkg; do
    [ -f "$ROOT/$pkg" ] || continue

    echo "## $pkg"

    if command -v node >/dev/null 2>&1; then
      node -e '
        const fs = require("fs");
        const file = process.argv[1];

        try {
          const p = JSON.parse(fs.readFileSync(file, "utf8"));
          console.log("name:", p.name || "<none>");
          console.log("type:", p.type || "<none>");
          console.log("packageManager:", p.packageManager || "<none>");
          console.log("scripts:", JSON.stringify(p.scripts || {}, null, 2));

          const deps = Object.assign({}, p.dependencies || {}, p.devDependencies || {});
          const keys = [
            "next",
            "react",
            "react-dom",
            "typescript",
            "prisma",
            "@prisma/client",
            "@prisma/adapter-pg",
            "dotenv",
            "zod"
          ];

          console.log("selectedDependencies:", JSON.stringify(
            Object.fromEntries(keys.filter(k => deps[k]).map(k => [k, deps[k]])),
            null,
            2
          ));
        } catch (e) {
          console.log("Could not parse package.json:", e.message);
        }
      ' "$ROOT/$pkg" 2>/dev/null || echo "Could not parse $pkg"
    else
      echo "node not installed / not found in PATH, skipping JSON summary"
    fi

    echo
  done < "$PACKAGE_SUMMARY_LIST"

  rm -f "$PACKAGE_SUMMARY_LIST"
} > "$OUT/diagnostics/package_json_summary.txt"

# -------------------------------------------------------------------
# Prisma diagnostics
# -------------------------------------------------------------------

{
  echo "# Prisma schema files"
  echo

  safe_find "$ROOT" -path "*/prisma/schema.prisma" -type f | relpath | sort || true
  echo

  echo "# Prisma migration directories"
  safe_find "$ROOT" -path "*/prisma/migrations" -type d | relpath | sort || true
} > "$OUT/diagnostics/prisma_locations.txt"

# -------------------------------------------------------------------
# Docker diagnostics
# -------------------------------------------------------------------

{
  echo "# Docker / Compose files"
  echo

  safe_find "$ROOT" \
    \( \
      -name "docker-compose.yml" -o \
      -name "docker-compose.yaml" -o \
      -name "compose.yml" -o \
      -name "compose.yaml" -o \
      -name "Dockerfile" -o \
      -name "Dockerfile.*" -o \
      -name ".dockerignore" \
    \) -type f | relpath | sort
} > "$OUT/diagnostics/docker_files.txt"

# -------------------------------------------------------------------
# Env var reference scan
# -------------------------------------------------------------------

{
  echo "# Potential env var references"
  echo "# Scans common config/source files only and prints variable-like names."
  echo

  safe_find "$ROOT" \
    \( \
      -name "*.ts" -o \
      -name "*.tsx" -o \
      -name "*.js" -o \
      -name "*.mjs" -o \
      -name "*.cjs" -o \
      -name "*.json" -o \
      -name "*.yml" -o \
      -name "*.yaml" -o \
      -name "Dockerfile" -o \
      -name "Dockerfile.*" \
    \) -type f \
    -exec grep -hEo 'process\.env\.[A-Za-z_][A-Za-z0-9_]*|[A-Z][A-Z0-9_]{2,}' {} \; 2>/dev/null \
    | sed 's/process\.env\.//' \
    | sort -u
} > "$OUT/diagnostics/env_var_references.txt"

# -------------------------------------------------------------------
# Port and host reference scan
# -------------------------------------------------------------------

{
  echo "# Potential port / host references"
  echo

  safe_find "$ROOT" \
    \( \
      -name "*.ts" -o \
      -name "*.tsx" -o \
      -name "*.js" -o \
      -name "*.mjs" -o \
      -name "*.json" -o \
      -name "*.yml" -o \
      -name "*.yaml" -o \
      -name "Dockerfile" -o \
      -name "Dockerfile.*" \
    \) -type f \
    -exec grep -HnE 'PORT|EXPOSE|localhost:|127\.0\.0\.1|:3000|:5432|postgres:5432' {} \; 2>/dev/null \
    | relpath \
    | sort
} > "$OUT/diagnostics/port_and_host_references.txt"

# -------------------------------------------------------------------
# Docker compose validation without dumping secrets
# -------------------------------------------------------------------

{
  echo "# Docker Compose validation"
  echo

  if command -v docker >/dev/null 2>&1; then
    if [ -f "$ROOT/docker-compose.yml" ] || [ -f "$ROOT/docker-compose.yaml" ] || [ -f "$ROOT/compose.yml" ] || [ -f "$ROOT/compose.yaml" ]; then
      docker compose config --services 2>&1 || true
    else
      echo "No compose file found."
    fi
  else
    echo "docker not installed / not found in PATH"
  fi
} > "$OUT/diagnostics/docker_compose_services.txt"

# -------------------------------------------------------------------
# Git status without content
# -------------------------------------------------------------------

if command -v git >/dev/null 2>&1 && [ -d "$ROOT/.git" ]; then
  {
    echo "# Git branch"
    git branch --show-current || true
    echo

    echo "# Git status short"
    git status --short || true
    echo

    echo "# Latest commit"
    git log -1 --oneline || true
  } > "$OUT/diagnostics/git_summary.txt"
fi

# -------------------------------------------------------------------
# Create final archive
# -------------------------------------------------------------------

tar -czf "$ARCHIVE" -C "$ROOT" "$(basename "$OUT")"

echo
echo "Done."
echo "Folder:  $OUT"
echo "Archive: $ARCHIVE"
echo
echo "Upload this archive:"
echo "  $(basename "$ARCHIVE")"
