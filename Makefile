.PHONY: build  clean release deploy_test pretty minify check

# Das Standardziel muss check bleiben, auch wenn weiter unten Regeln stehen.
.DEFAULT_GOAL := check

BASEURL ?= https://c3re.de

# Das Theme braucht mindestens diese Hugo-Version (hugo.Data, siehe
# .github/workflows/build.yml). Ist auf dem System kein oder ein älteres Hugo
# installiert, zum Beispiel das aus Debian 13, wird das Release-Binary nach
# .tools/ geladen. Ein vorhandenes Hugo ab dieser Version wird unverändert genutzt.
HUGO_VERSION ?= 0.161.1
HUGO_DIR := $(CURDIR)/.tools/hugo-$(HUGO_VERSION)

HUGO_SYSTEM_VERSION := $(shell hugo version 2>/dev/null | sed -n 's/^hugo v\([0-9][0-9.]*\).*/\1/p')
HUGO_SYSTEM_OK := $(shell [ -n "$(HUGO_SYSTEM_VERSION)" ] && [ "$$(printf '%s\n%s\n' '$(HUGO_VERSION)' '$(HUGO_SYSTEM_VERSION)' | sort -V | head -n 1)" = '$(HUGO_VERSION)' ] && echo yes)

ifeq ($(HUGO_SYSTEM_OK),yes)
HUGO := hugo
else
HUGO := $(HUGO_DIR)/hugo
HUGO_DEP := $(HUGO_DIR)/hugo

HUGO_OS := $(shell uname -s)
HUGO_ARCH := $(shell uname -m)
ifeq ($(HUGO_OS)-$(HUGO_ARCH),Linux-x86_64)
HUGO_PLATFORM := linux-amd64
else ifeq ($(HUGO_OS)-$(HUGO_ARCH),Linux-aarch64)
HUGO_PLATFORM := linux-arm64
else ifeq ($(HUGO_OS),Darwin)
HUGO_PLATFORM := darwin-universal
endif
endif

check: build-check minify

build-check build: $(HUGO_DEP)

build-check: clean
	$(HUGO) --gc --minify --cleanDestinationDir -b "${BASEURL}" --panicOnWarning

release: build minify

build: clean
	$(HUGO) --gc --minify --cleanDestinationDir -b "${BASEURL}" --enableGitInfo --panicOnWarning

# Lädt Hugo $(HUGO_VERSION) (wie in der CI: die Standardvariante, nicht extended).
$(HUGO_DIR)/hugo:
	@if [ -z "$(HUGO_PLATFORM)" ]; then \
		echo "Hugo >= $(HUGO_VERSION) fehlt, und für $(HUGO_OS)/$(HUGO_ARCH) gibt es keinen automatischen Download. Bitte Hugo selbst installieren." >&2; \
		exit 1; \
	fi
	mkdir -p $(HUGO_DIR)
	@url=https://github.com/gohugoio/hugo/releases/download/v$(HUGO_VERSION)/hugo_$(HUGO_VERSION)_$(HUGO_PLATFORM).tar.gz; \
	echo "Lade $$url"; \
	if command -v wget >/dev/null 2>&1; then wget -q -O $(HUGO_DIR)/hugo.tar.gz "$$url"; \
	else curl -fsSL -o $(HUGO_DIR)/hugo.tar.gz "$$url"; fi \
	&& tar -xzf $(HUGO_DIR)/hugo.tar.gz -C $(HUGO_DIR) hugo \
	&& rm -f $(HUGO_DIR)/hugo.tar.gz \
	|| { rm -rf $(HUGO_DIR); echo "Hugo $(HUGO_VERSION) konnte nicht geladen werden" >&2; exit 1; }

clean:
	rm -rf  public dist


minify:
	rm -rf tmp
	mkdir -p tmp
	cp -rp public/* tmp/
	minify -q -a -r --html-keep-comments -o tmp/ public/
	@if [ -f static/.assetsignore ]; then cp static/.assetsignore tmp/.assetsignore; fi
	rm -rf public
	mv tmp public


deploy_test:
	$(MAKE) BASEURL=https://c3retest.shnbk.de release
	rsync -rv --delete public/* shnbk.de:domains/c3retest.shnbk.de/htdocs

pretty:
	prettier -w content/**/*
