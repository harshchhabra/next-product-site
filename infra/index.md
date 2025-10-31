# Next.js Production Deployment with Docker

This document describes how to deploy the **Next.js app** to production using Docker.

---

## Overview

We can package the Next.js app as a Docker image and run it on any container platform (VPS, cloud server, Kubernetes, etc.).  
This approach allows consistent environments and easy scaling.

---

## Running the Mock API (Development)

1. **Build the Docker image:**

```bash
docker build \
  --build-arg NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  -t nextjs-app .

docker run -p 3000:3000 nextjs-app
```
