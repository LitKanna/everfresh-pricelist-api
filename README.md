# Everfresh Pricelist API

Node.js API server that generates pricelist images using HTML Canvas. Exact replica of the web app's pricelist image generation.

## Quick Deploy to Render.com (Free)

1. Push this folder to a new GitHub repository
2. Go to [Render.com](https://render.com)
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name**: everfresh-pricelist-api
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click "Create Web Service"

Your API will be available at `https://everfresh-pricelist-api.onrender.com`

## API Endpoint

**POST** `/api/generate`

### Request Body
```json
{
  "priceData": {
    "Mangoes": [
      ["Honey Gold", "Tray", "$45"],
      ["R2E2", "Tray", "$38"]
    ],
    "Avocados": [
      ["Hass", "Each", "$2.50"]
    ]
  },
  "effectiveDate": "2026-01-27T00:00:00.000Z",
  "salesmanInfo": {
    "name": "John Smith",
    "phone": "0412 345 678"
  }
}
```

### Response
```json
{
  "success": true,
  "imageUrl": "https://otiyknwuosgmvsvxdhwb.supabase.co/storage/v1/object/public/everfresh-media/pricelists/pricelist-1234567890.png"
}
```

## Local Development

Requires Cairo libraries for node-canvas:
- **macOS**: `brew install pkg-config cairo pango libpng jpeg giflib librsvg`
- **Ubuntu**: `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`
- **Windows**: See [node-canvas wiki](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows)

```bash
npm install
npm start
```

Server runs on http://localhost:3001
