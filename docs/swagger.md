---

## 📄 `mkdocs.yml`
Here’s a full version based on all the files I saw in your repo:

```yaml
site_name: V18 Platform Docs
site_url: https://kello54.github.io/Buildy/
site_description: Documentation for the V18 platform

theme:
  name: material

plugins:
  - search
  - swagger-ui

nav:
  - Home: index.md
  - Getting Started: getting-started.md
  - Architecture: architecture.md
  - Dashboards: dashboards.md
  - Runbooks: runbooks.md
  - API Guide: api.md
  - API Reference: swagger.md
  - Changelog: changelog.md
  - Contributing: contributing.md
