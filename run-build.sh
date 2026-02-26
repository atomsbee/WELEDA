#!/bin/bash
export NEXT_TELEMETRY_DISABLED=1
export CI=true
cd /Applications/MAMP/htdocs/WELEDA
node_modules/.bin/next build > /Applications/MAMP/htdocs/WELEDA/build-result.txt 2>&1
echo "BUILD_EXIT_CODE:$?" >> /Applications/MAMP/htdocs/WELEDA/build-result.txt
