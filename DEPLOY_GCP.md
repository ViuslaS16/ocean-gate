# Ocean Gate - Google Cloud Platform (GCP) Deployment Guide

## Prerequisites

- Google Cloud account with billing enabled
- Domain name (optional but recommended)
- Local terminal with `gcloud` CLI installed

---

## Step 1: Set Up GCP Compute Engine Instance

### 1.1 Create VM Instance

```bash
# Install gcloud CLI if not already installed
# Visit: https://cloud.google.com/sdk/docs/install

# Login to GCP
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Create a VM instance
gcloud compute instances create ocean-gate-server \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --boot-disk-size=30GB \
  --boot-disk-type=pd-standard \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --tags=http-server,https-server
```

**Alternative: Using GCP Console**
1. Go to [GCP Console](https://console.cloud.google.com)
2. Navigate to **Compute Engine** > **VM instances**
3. Click **Create Instance**
4. Configure:
   - **Name**: `ocean-gate-server`
   - **Region**: Choose closest to your users
   - **Machine type**: `e2-medium` (2 vCPU, 4 GB memory)
   - **Boot disk**: Ubuntu 22.04 LTS, 30 GB
   - **Firewall**: Check "Allow HTTP traffic" and "Allow HTTPS traffic"
5. Click **Create**

### 1.2 Configure Firewall Rules

```bash
# Allow HTTP
gcloud compute firewall-rules create allow-http \
  --allow tcp:80 \
  --target-tags http-server \
  --description="Allow HTTP traffic"

# Allow HTTPS
gcloud compute firewall-rules create allow-https \
  --allow tcp:443 \
  --target-tags https-server \
  --description="Allow HTTPS traffic"

# Allow custom ports (if not using Nginx reverse proxy)
gcloud compute firewall-rules create allow-ocean-gate \
  --allow tcp:3000,tcp:3001 \
  --target-tags http-server \
  --description="Allow Ocean Gate app ports"
```

---

## Step 2: Connect to Your Instance

```bash
# SSH into the instance
gcloud compute ssh ocean-gate-server --zone=us-central1-a

# Or use browser SSH from GCP Console
```

---

## Step 3: Install Dependencies on the Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x
npm --version

# Install MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt-get install -y nginx

# Install Git
sudo apt-get install -y git
```

---

## Step 4: Set Up MongoDB Security

```bash
# Connect to MongoDB
mongosh

# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "YOUR_STRONG_PASSWORD_HERE",
  roles: ["root"]
})

# Create application database user
use ocean-gate
db.createUser({
  user: "oceangate",
  pwd: "YOUR_APP_PASSWORD_HERE",
  roles: ["readWrite"]
})

# Exit mongosh
exit

# Enable authentication
sudo nano /etc/mongod.conf
```

Add to the config:
```yaml
security:
  authorization: enabled
```

Restart MongoDB:
```bash
sudo systemctl restart mongod
```

---

## Step 5: Deploy the Application

### 5.1 Clone Repository

```bash
# Create app directory
cd /var/www
sudo mkdir ocean-gate
sudo chown $USER:$USER ocean-gate

# Clone repository (replace with your repo URL)
git clone https://github.com/YOUR_USERNAME/ocean-gate.git ocean-gate
cd ocean-gate
```

### 5.2 Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Create production .env file
nano .env
```

Add the following:
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://oceangate:YOUR_APP_PASSWORD_HERE@localhost:27017/ocean-gate?authSource=ocean-gate
FRONTEND_URL=http://YOUR_DOMAIN_OR_IP
```

Save and exit (`Ctrl+X`, `Y`, `Enter`)

```bash
# Start backend with PM2
pm2 start server.js --name ocean-gate-backend

# Save PM2 configuration
pm2 save
pm2 startup
# Run the command it outputs
```

### 5.3 Set Up Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create production .env.local file
nano .env.local
```

Add:
```env
NEXT_PUBLIC_API_URL=http://YOUR_DOMAIN_OR_IP/api
NODE_ENV=production
```

Build and start:
```bash
# Build for production
npm run build

# Start with PM2
pm2 start npm --name ocean-gate-frontend -- start

# Save PM2 configuration
pm2 save
```

---

## Step 6: Configure Nginx Reverse Proxy

```bash
# Remove default configuration
sudo rm /etc/nginx/sites-enabled/default

# Create Ocean Gate configuration
sudo nano /etc/nginx/sites-available/ocean-gate
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    client_max_body_size 50M;

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and test:
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ocean-gate /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Step 7: Set Up SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts
# Choose to redirect HTTP to HTTPS when asked

# Test auto-renewal
sudo certbot renew --dry-run
```

Update your `.env` files to use `https://`:
```bash
# Backend
cd /var/www/ocean-gate/backend
nano .env
# Change FRONTEND_URL to https://yourdomain.com

# Frontend
cd ../frontend
nano .env.local
# Change NEXT_PUBLIC_API_URL to https://yourdomain.com/api

# Restart services
pm2 restart all
```

---

## Step 8: Set Up Automated Backups

### 8.1 Create Backup Script

```bash
sudo nano /usr/local/bin/backup-ocean-gate.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/ocean-gate"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --uri="mongodb://oceangate:YOUR_APP_PASSWORD@localhost:27017/ocean-gate?authSource=ocean-gate" \
  --out="$BACKUP_DIR/mongodb_$DATE"

# Compress backup
tar -czf "$BACKUP_DIR/mongodb_$DATE.tar.gz" "$BACKUP_DIR/mongodb_$DATE"
rm -rf "$BACKUP_DIR/mongodb_$DATE"

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: mongodb_$DATE.tar.gz"
```

Make executable:
```bash
sudo chmod +x /usr/local/bin/backup-ocean-gate.sh
```

### 8.2 Schedule Daily Backups

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-ocean-gate.sh >> /var/log/ocean-gate-backup.log 2>&1
```

---

## Step 9: Set Up CI/CD with GitHub Actions

Update `.github/workflows/deploy.yml` for GCP deployment:

```yaml
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to GCP
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.GCP_SERVER_IP }}
          username: ${{ secrets.GCP_SSH_USER }}
          key: ${{ secrets.GCP_SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/ocean-gate
            git pull origin main
            
            # Update backend
            cd backend
            npm install --production
            pm2 restart ocean-gate-backend
            
            # Update frontend
            cd ../frontend
            npm install
            npm run build
            pm2 restart ocean-gate-frontend
```

### Add GitHub Secrets:
1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Add:
   - `GCP_SERVER_IP`: Your GCP instance external IP
   - `GCP_SSH_USER`: Your username (usually your email username)
   - `GCP_SSH_PRIVATE_KEY`: Your private SSH key

---

## Step 10: Point Domain to GCP Instance

### 10.1 Reserve Static IP (Recommended)

```bash
# Create static IP
gcloud compute addresses create ocean-gate-ip --region=us-central1

# Get the IP address
gcloud compute addresses describe ocean-gate-ip --region=us-central1

# Assign to instance
gcloud compute instances delete-access-config ocean-gate-server \
  --access-config-name "external-nat" --zone=us-central1-a

gcloud compute instances add-access-config ocean-gate-server \
  --access-config-name "external-nat" \
  --address STATIC_IP_ADDRESS \
  --zone=us-central1-a
```

### 10.2 Configure DNS

Add these DNS records at your domain registrar:
- **A Record**: `@` → `YOUR_STATIC_IP`
- **A Record**: `www` → `YOUR_STATIC_IP`

---

## Monitoring & Maintenance

### Check Application Status
```bash
pm2 status
pm2 logs ocean-gate-backend
pm2 logs ocean-gate-frontend
```

### Check Nginx
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Check MongoDB
```bash
sudo systemctl status mongod
mongosh -u oceangate -p --authenticationDatabase ocean-gate
```

### Update Application
```bash
cd /var/www/ocean-gate
git pull
cd backend && npm install && pm2 restart ocean-gate-backend
cd ../frontend && npm install && npm run build && pm2 restart ocean-gate-frontend
```

---

## Cost Optimization

**Estimated Monthly Cost:**
- **e2-medium VM**: ~$24/month
- **30GB Standard Persistent Disk**: ~$1.20/month
- **Static IP**: ~$3/month (if reserved and not attached, free if attached)
- **Total**: ~$28-30/month

**Save Money:**
1. Use **e2-micro** for development: ~$7/month (subject to free tier)
2. Stop instance when not in use
3. Use committed use discounts for long-term deployment

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| SSH to server | `gcloud compute ssh ocean-gate-server --zone=us-central1-a` |
| Check PM2 | `pm2 status` |
| View logs | `pm2 logs` |
| Restart services | `pm2 restart all` |
| Check Nginx | `sudo nginx -t && sudo systemctl reload nginx` |
| Backup database | `/usr/local/bin/backup-ocean-gate.sh` |
| Update app | `cd /var/www/ocean-gate && git pull && ...` |

---

## Troubleshooting

### Can't connect to MongoDB
```bash
sudo systemctl status mongod
sudo systemctl restart mongod
mongosh ocean-gate -u oceangate -p
```

### Application not loading
```bash
pm2 logs
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### SSL certificate issues
```bash
sudo certbot renew
sudo nginx -t && sudo systemctl reload nginx
```

---

You're all set! Your Ocean Gate application should now be running on Google Cloud Platform. Access it at your domain or GCP instance IP address.
