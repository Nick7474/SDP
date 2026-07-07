const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const filePath = path.join('c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\public', 'btn_energymile_on.png');
try {
  const buffer = fs.readFileSync(filePath);
  
  let pos = 8; // skip signature
  let idatBuffers = [];
  let width = 0, height = 0;
  
  while (pos < buffer.length) {
    const length = buffer.readInt32BE(pos);
    const type = buffer.toString('ascii', pos + 4, pos + 8);
    
    if (type === 'IHDR') {
      width = buffer.readInt32BE(pos + 8);
      height = buffer.readInt32BE(pos + 12);
    } else if (type === 'IDAT') {
      idatBuffers.push(buffer.subarray(pos + 8, pos + 8 + length));
    }
    
    pos += 12 + length;
  }
  
  const compressedData = Buffer.concat(idatBuffers);
  const decompressed = zlib.inflateSync(compressedData);
  
  const bytesPerPixel = 4;
  const scanlineLength = 1 + width * bytesPerPixel;
  
  // Reconstruct PNG scanlines
  const reconstructed = Buffer.alloc(width * height * bytesPerPixel);
  
  function paethPredictor(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  }
  
  for (let y = 0; y < height; y++) {
    const lineStart = y * scanlineLength;
    const filter = decompressed[lineStart];
    
    for (let x = 0; x < width; x++) {
      const rawIdx = lineStart + 1 + x * bytesPerPixel;
      const reconIdx = (y * width + x) * bytesPerPixel;
      
      for (let c = 0; c < bytesPerPixel; c++) {
        const rawVal = decompressed[rawIdx + c];
        
        const a = x > 0 ? reconstructed[reconIdx - bytesPerPixel + c] : 0;
        const b = y > 0 ? reconstructed[reconIdx - width * bytesPerPixel + c] : 0;
        const c_val = (x > 0 && y > 0) ? reconstructed[reconIdx - width * bytesPerPixel - bytesPerPixel + c] : 0;
        
        let reconVal = 0;
        if (filter === 0) {
          reconVal = rawVal;
        } else if (filter === 1) {
          reconVal = (rawVal + a) & 0xFF;
        } else if (filter === 2) {
          reconVal = (rawVal + b) & 0xFF;
        } else if (filter === 3) {
          reconVal = (rawVal + Math.floor((a + b) / 2)) & 0xFF;
        } else if (filter === 4) {
          reconVal = (rawVal + paethPredictor(a, b, c_val)) & 0xFF;
        }
        
        reconstructed[reconIdx + c] = reconVal;
      }
    }
  }
  
  let minX = width, maxX = 0, minY = height, maxY = 0;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * bytesPerPixel;
      const alpha = reconstructed[idx + 3];
      if (alpha > 10) { // non-transparent threshold
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  
  console.log(`PNG Dimensions: ${width}x${height}`);
  console.log(`Non-transparent Bounding Box: X: ${minX}..${maxX} (${maxX - minX + 1}px), Y: ${minY}..${maxY} (${maxY - minY + 1}px)`);
} catch (e) {
  console.error("Error:", e);
}
