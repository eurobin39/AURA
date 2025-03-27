# .github/workflows/deploy.yml

name: Build and deploy Node.js app to Azure Web App

on:
  push:
    branches:
      - frontend/com  
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22.x'

      - name: Install dependencies and build (in frontend folder)
        run: |
          npm install
          npm run build
        working-directory: ./aura-project

      - name: Zip build output for deployment
        run: zip -r build.zip .
        working-directory: ./aura-project

      - name: Login to Azure
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v3
        with:
          app-name: 'myAura'  
          slot-name: 'Production'
          package: ./aura-project/build.zip
