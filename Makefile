.PHONY: build  clean release deploy_test

BASEURL ?= https://c3re.de

release: build

build: clean
	hugo --gc --minify --cleanDestinationDir -b "${BASEURL}" --enableGitInfo --panicOnWarning

clean:
	rm -rf  public dist


dist:
	mkdir dist

deploy_test:
	$(MAKE) BASEURL=https://c3retest.shnbk.de release
	rsync -rv --delete public/* shnbk.de:domains/c3retest.shnbk.de/htdocs