build:
	python3 tools/build.py
test:
	node tests/parser.test.js && node tests/i18n-coverage.js
e2e:
	bash tests/e2e/run_all.sh
serve:
	python3 -m http.server 8000 -d dist
