.PHONY: build minify clean release deploy_test

BASEURL ?= https://c3re.de

release: build minify

build: clean
	hugo --gc --minify --cleanDestinationDir -b "${BASEURL}" --enableGitInfo --panicOnWarning

clean:
	rm -rf  public dist

minify: dist build
	minify -a -r -o dist/  public/. -q --exclude "public/js/jquery-3.7.1.min.js" --html-keep-document-tags
	cp -rp public/js/jquery-3.7.1.min.js dist/public/js/jquery-3.7.1.min.js
	mv dist/public/* dist/
	rm -rf dist/public

dist:
	mkdir dist

deploy_test:
	$(MAKE) BASEURL=https://c3retest.shnbk.de release
	rsync -rv --delete dist/* shnbk.de:domains/c3retest.shnbk.de/htdocs