develop:
	npx webpack-dev-server --open

install:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .
