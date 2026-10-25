#!/usr/bin/env bash
# Construye las piezas de Rive (RML sin scripts) y copia los .riv a frontend/public/rive/.
# Necesita la CLI de Rive (https://rive.app): ~/.rive/bin/rive. Sin login: un archivo sin
# scripts funciona en los runtimes web sin firmar, así que no se usa --publish.
set -euo pipefail
cd "$(dirname "$0")"
RIVE="${RIVE:-$HOME/.rive/bin/rive}"
for pieza in logotipo reservar; do
  "$RIVE" "$pieza" --verify
  "$RIVE" "$pieza" --once
  cp "$pieza/build/$pieza.riv" "../frontend/public/rive/$pieza.riv"
done
ls -l ../frontend/public/rive/*.riv
