#!/bin/sh
#
# can copy this to /usr/local/manual/bin/ccls and make it an executeable called "ccls"
#
exec /Users/lightmatter/external_code/ccls/ccls/Release/ccls -init='{"clang":{"extraArgs":["-isystem", "/Library/Developer/CommandLineTools/usr/include/c++/v1"]}}' "$@"
