#!/bin/sh
# Erzeugt Städteseiten (de + tr), Themenseiten und sitemap.xml neu. Aufruf aus der Repo-Wurzel: sh tools/build.sh
set -e
cd "$(dirname "$0")/.."
export TZ=Europe/Berlin
node tools/gen_staedte.js .
node tools/gen_themen.js .
node tools/gen_tr.js .
node tools/gen_sprachen.js .
