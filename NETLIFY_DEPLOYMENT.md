# Netlify Deployment Guide

## Prerequisites
- A Netlify account (free at netlify.com)
- Your domain name (for custom subdomain)
- Git repository with your code

## Step 1: Prepare Your Repository

Your project is already configured for Netlify deployment with:
- `netlify.toml` - Build configuration
- `_redirects` - URL redirects
- Updated `package.json` with build scripts

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify UI (Recommended for first deployment)

1. **Go to Netlify Dashboard**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Sign in or create an account

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub, GitLab, Bitbucket)
   - Select your repository: `portfolio-lavitzwow`

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18` (or latest LTS)

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**
   ```bash
   netlify init
   netlify deploy --prod
   ```

## Step 3: Set Up Custom Subdomain

### Option A: Using Netlify's Free Subdomain
Your site will be available at: `your-site-name.netlify.app`

### Option B: Custom Subdomain (e.g., portfolio.yourdomain.com)

1. **In Netlify Dashboard**
   - Go to your site settings
   - Navigate to "Domain management"
   - Click "Add custom domain"

2. **Add Your Domain**
   - Enter your custom subdomain (e.g., `portfolio.yourdomain.com`)
   - Click "Verify"

3. **Configure DNS**
   - Add a CNAME record in your domain's DNS settings:
     - **Name**: `portfolio` (or your desired subdomain)
     - **Value**: `your-site-name.netlify.app`
     - **TTL**: 3600 (or default)

4. **Wait for Propagation**
   - DNS changes can take up to 48 hours to propagate
   - Usually works within 15-30 minutes

### Option C: Using Netlify DNS (Recommended)

1. **Transfer DNS to Netlify**
   - In Netlify dashboard, go to "Domain management"
   - Click "Add custom domain"
   - Choose "Use Netlify DNS"

2. **Update Nameservers**
   - Netlify will provide nameservers
   - Update your domain registrar's nameservers to Netlify's

3. **Add Subdomain**
   - Once DNS is transferred, add your subdomain
   - It will be instantly available

## Step 4: SSL Certificate

Netlify automatically provides SSL certificates for all domains:
- Free SSL certificates via Let's Encrypt
- Automatic renewal
- HTTPS redirects enabled by default

## Step 5: Continuous Deployment

Netlify automatically:
- Deploys when you push to your main branch
- Creates preview deployments for pull requests
- Maintains deployment history

## Step 6: Custom Domain Verification

To verify your custom subdomain is working:

1. **Check DNS Propagation**
   ```bash
   nslookup portfolio.yourdomain.com
   ```

2. **Test HTTPS**
   - Visit `https://portfolio.yourdomain.com`
   - Should redirect from HTTP automatically

3. **Test Redirects**
   - Visit `https://portfolio.yourdomain.com/prebis`
   - Should serve `prebis.html`

## Troubleshooting

### Build Failures
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### DNS Issues
- Use [whatsmydns.net](https://whatsmydns.net) to check propagation
- Ensure CNAME record is correct
- Wait for DNS propagation (up to 48 hours)

### Custom Domain Not Working
- Verify DNS settings
- Check if domain is properly added in Netlify
- Ensure SSL certificate is provisioned

## File Structure for Netlify

Your deployment will include:
```
dist/
├── index.html
├── prebis.html
├── bis.html
├── main1.css
├── assets/
├── css/
└── js/
```

## Environment Variables (if needed)

If you need environment variables:
1. Go to Site settings → Environment variables
2. Add key-value pairs
3. Access in your build process

## Performance Optimization

Netlify automatically provides:
- Global CDN
- Asset optimization
- Automatic image optimization
- Form handling
- Serverless functions support

## Support

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Community](https://community.netlify.com/)
- [Netlify Status](https://status.netlify.com/)
