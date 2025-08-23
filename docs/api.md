# API Reference

Welcome to the **V18 Platform API documentation**.  
Below you’ll find an interactive Swagger UI rendering of the API specification.

<swagger-ui src="platform.json"></swagger-ui>

---

## Usage

- The API spec is defined in [`platform.json`](platform.json).  
- You can explore all endpoints directly in this page using the Swagger UI component.  
- To try requests, you may need a valid API key or authentication token (depending on your setup).

---

## Troubleshooting

If the API does not display:
- Ensure `docs/platform.json` exists and is valid OpenAPI/Swagger JSON.
- Check your browser console for errors.
- Verify that the `mkdocs.yml` has the plugin configured:

```yaml
plugins:
  - swagger-ui-tag:
      swagger_ui: docs/platform.json
