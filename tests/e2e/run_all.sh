#!/usr/bin/env bash
# build + all tests. needs: node, python3, `pip install playwright && playwright install chromium`
set -e
cd "$(dirname "$0")/../.."
python3 tools/build.py
node --check src/app.js && node --check src/parser.js
node tests/parser.test.js
node tests/i18n-coverage.js
node tests/gas.test.js
python3 tests/e2e/ftest.py
python3 tests/e2e/ftest2.py
python3 tests/e2e/ftest3.py
python3 tests/e2e/ftest4.py
python3 tests/e2e/ftest5.py
python3 tests/e2e/ftest6.py
python3 tests/e2e/ftest7.py
echo "ALL TESTS PASSED"
