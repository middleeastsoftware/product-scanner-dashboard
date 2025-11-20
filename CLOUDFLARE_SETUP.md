# Cloudflare Tunnel Setup for Product Scanner Dashboard

## Cloudflare Tunnel Configuration

Add the following configuration to your Cloudflare Tunnel to route traffic to the dashboard:

### Option 1: Using Cloudflare Zero Trust Dashboard

1. Go to Cloudflare Zero Trust Dashboard
2. Navigate to **Access** → **Tunnels**
3. Select your existing tunnel
4. Click **Configure** → **Public Hostname**
5. Add a new public hostname:
   - **Subdomain**: `dashboard`
   - **Domain**: `middleeastsoftware.com`
   - **Type**: `HTTP`
   - **URL**: `product-scanner-dashboard.api.svc.cluster.local:8080`

### Option 2: Using cloudflared CLI

If you're managing your tunnel configuration via YAML, add this to your tunnel config:

```yaml
tunnel: <your-tunnel-id>
credentials-file: /etc/cloudflared/credentials.json

ingress:
  # Dashboard route
  - hostname: dashboard.middleeastsoftware.com
    service: http://product-scanner-dashboard.api.svc.cluster.local:8080

  # Existing routes (keep these)
  - hostname: api.middleeastsoftware.com
    service: http://product-scanner-api.api.svc.cluster.local:8080

  # Catch-all rule (required, must be last)
  - service: http_status:404
```

### Option 3: Using Kubernetes ConfigMap (Recommended)

If your cloudflared is running in Kubernetes and you want to manage configuration via ConfigMap:

1. Get your current tunnel configuration:
```bash
kubectl get secret -n cloudflare-tunnel tunnel-token -o jsonpath='{.data.token}' | base64 -d
```

2. In Cloudflare Zero Trust Dashboard, add the public hostname as described in Option 1.

OR if using config.yaml:

Create/update the ConfigMap:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cloudflared-config
  namespace: cloudflare-tunnel
data:
  config.yaml: |
    tunnel: <your-tunnel-id>
    credentials-file: /etc/cloudflared/credentials.json

    ingress:
      # Dashboard
      - hostname: dashboard.middleeastsoftware.com
        service: http://product-scanner-dashboard.api.svc.cluster.local:8080

      # API
      - hostname: api.middleeastsoftware.com
        service: http://product-scanner-api.api.svc.cluster.local:8080

      # Catch-all
      - service: http_status:404
```

Then update the deployment to use the config file instead of token:
```yaml
# Update cloudflared deployment to mount config
volumes:
- name: config
  configMap:
    name: cloudflared-config
    items:
    - key: config.yaml
      path: config.yaml
```

## Service Details

- **Service Name**: `product-scanner-dashboard.api.svc.cluster.local`
- **Port**: `8080`
- **Protocol**: `HTTP` (Cloudflare Tunnel handles HTTPS termination)
- **Namespace**: `api`

## DNS

The DNS is automatically managed by Cloudflare Tunnel. Once you add the public hostname, the DNS record will be created automatically pointing to your tunnel.

## Verify

After adding the configuration:

1. Wait 1-2 minutes for the tunnel to reload
2. Visit: https://dashboard.middleeastsoftware.com
3. You should see the Product Scanner Dashboard

## Troubleshooting

Check cloudflared logs:
```bash
kubectl logs -n cloudflare-tunnel -l app=cloudflared --tail=100 -f
```

Check dashboard pods:
```bash
kubectl get pods -n api -l app=product-scanner-dashboard
kubectl logs -n api -l app=product-scanner-dashboard --tail=100
```

Test service connectivity from inside the cluster:
```bash
kubectl run -n api curl-test --image=curlimages/curl:latest --rm -it --restart=Never -- curl http://product-scanner-dashboard.api.svc.cluster.local:8080
```
