# 📚 Buildy Runbooks

Runbooks are **step-by-step guides** for solving common operational problems.  
They help teams respond quickly, reduce errors, and keep processes consistent.

---

## 🛠️ Common Runbooks

### 🔄 Restarting a Service

**Goal:** Safely restart a Buildy-managed service.  

**Steps:**
1. Open the Buildy dashboard.
2. Navigate to **Services > Target Service**.
3. Click **Restart** and confirm the action.
4. Verify logs to ensure the service is running correctly.

---

### 📦 Deploying a New Version

**Goal:** Deploy a new release into production.  

**Steps:**
1. Check out the latest branch:
   ```bash
   git checkout main
   git pull origin main

