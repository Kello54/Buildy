# 🔌 Buildy API Reference

The **Buildy REST API** lets you interact programmatically with the platform:  
- Manage deployments  
- Trigger runbooks  
- Query dashboards  
- Access metrics and KPIs  

---

## 🔑 Authentication

All requests require authentication using an **API key**.  
Include the key in your request headers:

```http
Authorization: Bearer <your_api_key>

