.PHONY: build  clean release deploy_test pretty minify

BASEURL ?= https://c3re.de

release: build minify

build: clean
	hugo --gc --minify --cleanDestinationDir -b "${BASEURL}" --enableGitInfo --panicOnWarning

clean:
	rm -rf  public dist


minify:
	rm -rf tmp
	mkdir -p tmp
	cp -rp public/* tmp/
	minify -q -a -r -o tmp/ public/
	rm -rf public
	mv tmp public


deploy_test:
	$(MAKE) BASEURL=https://c3retest.shnbk.de release
	rsync -rv --delete public/* shnbk.de:domains/c3retest.shnbk.de/htdocs

pretty:
	prettier -w content/**/*
