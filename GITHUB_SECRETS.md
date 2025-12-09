# Setting Up GitHub Secrets for GCP Deployment

To enable automated deployments to your Google Cloud VM, you need to add these secrets to your GitHub repository:

## Required Secrets

1. **GCP_VM_IP** - Your GCP VM external IP address
2. **GCP_SSH_USER** - Your SSH username (usually your GCP username)
3. **GCP_SSH_PRIVATE_KEY** - Your SSH private key

---

## How to Add Secrets

### 1. Get Your VM IP Address

```bash
gcloud compute instances describe YOUR_VM_NAME \
  --zone=YOUR_ZONE \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

### 2. Get Your SSH Username

Usually your GCP username. Check with:
```bash
whoami
```

### 3. Generate SSH Key (if you don't have one)

On your **local machine**:

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Save to: ~/.ssh/gcp_github_actions
# Don't set a passphrase (press Enter)

# Copy the public key
cat ~/.ssh/gcp_github_actions.pub
```

Add the public key to your GCP VM:

```bash
# SSH into your VM
gcloud compute ssh YOUR_VM_NAME --zone=YOUR_ZONE

# Add the public key
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the public key content
# Save and exit

# Set permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Get the private key to add to GitHub:

```bash
# On your local machine
cat ~/.ssh/gcp_github_actions
# Copy the entire output including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ...
# -----END OPENSSH PRIVATE KEY-----
```

### 4. Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**

Add these three secrets:

**Secret 1: GCP_VM_IP**
- Name: `GCP_VM_IP`
- Value: Your VM external IP (e.g., `34.123.45.67`)

**Secret 2: GCP_SSH_USER**
- Name: `GCP_SSH_USER`
- Value: Your SSH username (e.g., `your_username`)

**Secret 3: GCP_SSH_PRIVATE_KEY**
- Name: `GCP_SSH_PRIVATE_KEY`
- Value: Your entire private key (including BEGIN and END lines)

---

## Test the Deployment

1. Make a small change to your code
2. Commit and push to main:
   ```bash
   git add .
   git commit -m "test: trigger deployment"
   git push origin main
   ```
3. Go to **Actions** tab in GitHub to watch the deployment

---

## Troubleshooting

### SSH Connection Failed

If deployment fails with SSH errors:

1. **Check firewall**:
   ```bash
   gcloud compute firewall-rules list
   ```

2. **Verify SSH key**:
   ```bash
   # Test SSH connection manually
   ssh -i ~/.ssh/gcp_github_actions YOUR_USER@YOUR_VM_IP
   ```

3. **Check VM is running**:
   ```bash
   gcloud compute instances list
   ```

### PM2 Commands Not Found

SSH into your VM and verify:
```bash
which pm2
# Should show: /usr/bin/pm2 or similar

# If not found:
sudo npm install -g pm2
```

---

## What Happens on Deploy

1. ✅ GitHub Actions tests your code
2. ✅ Connects to your GCP VM via SSH
3. ✅ Pulls latest code from GitHub
4. ✅ Installs dependencies
5. ✅ Builds frontend
6. ✅ Restarts both backend and frontend with PM2
7. ✅ Verifies services are running

Every push to `main` branch will automatically deploy!
