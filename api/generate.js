// ============================================
// EVERFRESH - PRICELIST IMAGE GENERATOR
// Node.js Canvas API - Exact replica of web app
// ============================================

const { createCanvas } = require('canvas');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://otiyknwuosgmvsvxdhwb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aXlrbnd1b3NnbXZzdnhkaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMjUyNjksImV4cCI6MjA4NDkwMTI2OX0.cwBEPgfmiTQ7-PDYdZW-4bO8158O6I1p5tUe3Ix3Vbw';

// Format price with $ symbol
function formatPriceWithSymbol(price) {
  if (!price) return '';
  const cleaned = price.toString().trim();
  if (cleaned.startsWith('$')) return cleaned;
  const num = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
  if (!isNaN(num)) return '$' + num.toFixed(2);
  return cleaned;
}

// Truncate text to fit within maxWidth
function truncateText(ctx, text, maxWidth) {
  if (!text) return '';
  let str = text.toString();
  if (ctx.measureText(str).width <= maxWidth) return str;
  while (str.length > 0 && ctx.measureText(str + '...').width > maxWidth) {
    str = str.slice(0, -1);
  }
  return str + '...';
}

// Get effective date
function getEffectiveDate(effectiveDateStr) {
  let date;
  if (effectiveDateStr) {
    date = new Date(effectiveDateStr);
    if (isNaN(date.getTime())) {
      date = new Date();
      date.setDate(date.getDate() + 1);
    }
  } else {
    date = new Date();
    date.setDate(date.getDate() + 1);
  }
  return date;
}

// Generate pricelist image - EXACT replica of web app canvas code
function generatePricelistImage(priceData, effectiveDateStr, salesmanInfo) {
  // Calculate height
  let totalRows = 0;
  Object.values(priceData).forEach(items => {
    const availableItems = items.filter(item => {
      const price = (item[2] || '').toString().trim();
      if (price === '') return false;
      const cleanedPrice = price.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      return cleanedPrice !== 'na' && cleanedPrice !== 'notavailable';
    });
    totalRows += availableItems.length;
  });
  const categoryCount = Object.keys(priceData).length;

  // Ultra HD - 3x resolution (3600px width) - EXACT match to web app
  const canvasWidth = 3600;
  const estimatedHeight = 1200 + (categoryCount * 300) + (totalRows * 135) + 600;

  const canvas = createCanvas(canvasWidth, estimatedHeight);
  const ctx = canvas.getContext('2d');

  console.log(`Canvas size: ${canvasWidth}x${estimatedHeight} (Ultra HD 3x)`);

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, estimatedHeight);

  let y = 120;
  const margin = 180;

  // Header background - Barely green-white
  ctx.fillStyle = '#fafdf7';
  const headerHeight = (salesmanInfo.name || salesmanInfo.phone) ? 840 : 720;
  ctx.fillRect(0, 0, canvasWidth, headerHeight);

  // Company name - Forest green
  ctx.fillStyle = '#2d6a4f';
  ctx.font = 'bold 168px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('EVERFRESH PRODUCE GROUP', canvasWidth / 2, y + 150);
  y += 240;

  // Title - Fresh green
  ctx.fillStyle = '#52b788';
  ctx.font = 'bold 144px Arial, Helvetica, sans-serif';
  ctx.fillText('WHOLESALE PRICE LIST', canvasWidth / 2, y + 120);
  y += 210;

  // Address and Date
  const leftCol = 300;
  const rightCol = canvasWidth - 300;

  ctx.textAlign = 'left';
  ctx.fillStyle = '#2d6a4f';
  ctx.font = 'bold 66px Arial, Helvetica, sans-serif';
  ctx.fillText('Stand 275, Shed C, Sydney Markets', leftCol, y + 60);

  ctx.textAlign = 'right';
  const effectiveDate = getEffectiveDate(effectiveDateStr);
  const formattedDate = effectiveDate.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' });
  ctx.fillText('Effective: ' + formattedDate, rightCol, y + 60);
  y += 150;

  // Contact box - Very light green
  if (salesmanInfo.name || salesmanInfo.phone) {
    ctx.fillStyle = '#d8f3dc';
    ctx.fillRect(leftCol - 60, y - 30, canvasWidth - 480, 150);
    ctx.strokeStyle = '#52b788';
    ctx.lineWidth = 6;
    ctx.strokeRect(leftCol - 60, y - 30, canvasWidth - 480, 150);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#1b4332';
    ctx.font = 'bold 72px Arial, Helvetica, sans-serif';

    if (salesmanInfo.name && salesmanInfo.phone) {
      ctx.fillText('Sales Contact: ' + salesmanInfo.name, leftCol, y + 60);
      ctx.textAlign = 'right';
      ctx.fillText(salesmanInfo.phone, rightCol, y + 60);
    } else if (salesmanInfo.name) {
      ctx.fillText('Sales Contact: ' + salesmanInfo.name, leftCol, y + 60);
    } else {
      ctx.fillText('Sales Contact: ' + salesmanInfo.phone, leftCol, y + 60);
    }
    y += 195;
  } else {
    y += 45;
  }

  // Separator - Fresh green
  ctx.strokeStyle = '#b7e4c7';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(margin, y);
  ctx.lineTo(canvasWidth - margin, y);
  ctx.stroke();
  y += 90;

  // Table setup
  ctx.textAlign = 'left';
  const tableWidth = canvasWidth - 2 * margin;
  const col1 = margin;
  const col2 = margin + tableWidth * 0.45;
  const col3 = margin + tableWidth * 0.80;
  const rowHeight = 126;

  console.log('Drawing categories...');

  // Draw each category
  for (const categoryName in priceData) {
    const items = priceData[categoryName];

    // Filter out items with NA/Not Available price
    const availableItems = items.filter(item => {
      const price = (item[2] || '').toString().trim();
      if (price === '') return false;
      const cleanedPrice = price.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      return cleanedPrice !== 'na' && cleanedPrice !== 'notavailable';
    });

    // Skip this category if no available items
    if (availableItems.length === 0) {
      console.log(`Skipping category "${categoryName}" - all products NA`);
      continue;
    }

    // Category header - Medium green
    ctx.fillStyle = '#40916c';
    ctx.fillRect(margin, y, tableWidth, 150);
    ctx.strokeStyle = '#2d6a4f';
    ctx.lineWidth = 6;
    ctx.strokeRect(margin, y, tableWidth, 150);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 102px Arial, Helvetica, sans-serif';
    ctx.fillText(categoryName, col1 + 60, y + 108);
    y += 150;

    // Column headers - Light green
    ctx.fillStyle = '#74c69d';
    ctx.fillRect(margin, y, tableWidth, rowHeight);
    ctx.strokeRect(margin, y, tableWidth, rowHeight);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 78px Arial, Helvetica, sans-serif';
    ctx.fillText('Product', col1 + 60, y + 84);
    ctx.fillText('Grade/Size', col2 + 60, y + 84);
    ctx.fillText('Price', col3 + 60, y + 84);

    // Vertical lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(col2, y);
    ctx.lineTo(col2, y + rowHeight);
    ctx.moveTo(col3, y);
    ctx.lineTo(col3, y + rowHeight);
    ctx.stroke();
    y += rowHeight;

    // Draw only available items
    for (let i = 0; i < availableItems.length; i++) {
      const item = availableItems[i];

      // Background - Very subtle alternating
      ctx.fillStyle = i % 2 === 1 ? '#f1faee' : '#ffffff';
      ctx.fillRect(margin, y, tableWidth, rowHeight);

      // Borders - Soft green-gray
      ctx.strokeStyle = '#d8f3dc';
      ctx.lineWidth = 3;
      ctx.strokeRect(margin, y, tableWidth, rowHeight);
      ctx.beginPath();
      ctx.moveTo(col2, y);
      ctx.lineTo(col2, y + rowHeight);
      ctx.moveTo(col3, y);
      ctx.lineTo(col3, y + rowHeight);
      ctx.stroke();

      // Calculate column widths for text truncation
      const productMaxWidth = col2 - col1 - 90;
      const gradeMaxWidth = col3 - col2 - 90;
      const priceMaxWidth = (margin + tableWidth) - col3 - 90;

      // Text - Dark for readability
      ctx.fillStyle = '#212529';
      ctx.font = '72px Arial, Helvetica, sans-serif';
      ctx.fillText(truncateText(ctx, item[0], productMaxWidth), col1 + 60, y + 84);
      ctx.fillText(truncateText(ctx, item[1], gradeMaxWidth), col2 + 60, y + 84);

      // Price - Deep forest green
      ctx.fillStyle = '#1b4332';
      ctx.font = 'bold 78px Arial, Helvetica, sans-serif';
      ctx.fillText(truncateText(ctx, formatPriceWithSymbol(item[2]), priceMaxWidth), col3 + 60, y + 84);

      y += rowHeight;
    }
    y += 75;
  }

  // Notes
  y += 45;
  ctx.fillStyle = '#2d6a4f';
  ctx.font = 'bold 96px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('NOTES:', margin, y + 90);
  y += 150;

  ctx.fillStyle = '#495057';
  ctx.font = '60px Arial, Helvetica, sans-serif';
  const notes = [
    '• All prices are wholesale rates',
    '• Prices subject to availability and market conditions',
    '• Quality guaranteed - fresh daily from Sydney Markets',
    '• Contact us for bulk pricing and special requests'
  ];
  notes.forEach(note => {
    ctx.fillText(note, margin + 60, y + 66);
    y += 96;
  });

  // Return PNG buffer
  return canvas.toBuffer('image/png');
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceData, effectiveDate, salesmanInfo } = req.body;

    console.log('Generating pricelist image...');
    console.log('Categories:', Object.keys(priceData || {}));

    if (!priceData || Object.keys(priceData).length === 0) {
      return res.status(400).json({ error: 'priceData is required' });
    }

    // Generate the image
    const pngBuffer = generatePricelistImage(priceData, effectiveDate, salesmanInfo || {});
    console.log('PNG generated, size:', pngBuffer.length, 'bytes');

    // Upload to Supabase Storage
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const timestamp = Date.now();
    const fileName = `pricelists/pricelist-${timestamp}.png`;

    const { error: uploadError } = await supabase.storage
      .from('everfresh-media')
      .upload(fileName, pngBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({ error: 'Upload failed', details: uploadError.message });
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/everfresh-media/${fileName}`;
    console.log('Success! Image URL:', publicUrl);

    return res.status(200).json({ success: true, imageUrl: publicUrl });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
