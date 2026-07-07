const fs = require('fs');

const cityFile = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\CityDataMap.tsx';
const mileFile = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDataMap.tsx';

const cityContent = fs.readFileSync(cityFile, 'utf8');
const mileContent = fs.readFileSync(mileFile, 'utf8');

// Extract Card 1 from MileDataMap
const card1Start = mileContent.indexOf('{/* Card 1: 분야별 도시지표 현황 */}');
const card2StartMile = mileContent.indexOf('{/* Card 2: 광명시 종합 도시지수 */}');
const card3StartMile = mileContent.indexOf('{/* Card 3: 광명시 데이터 알림 */}');

if (card1Start === -1 || card2StartMile === -1 || card3StartMile === -1) {
  console.log("Could not find cards in MileDataMap");
  process.exit(1);
}

const mileCard1 = mileContent.substring(card1Start, card2StartMile);
const mileCard2 = mileContent.substring(card2StartMile, card3StartMile);

// Replace in CityDataMap
const cityCard1Start = cityContent.indexOf('{/* Card 1: 분야별 도시지표 현황 */}');
const cityCard2Start = cityContent.indexOf('{/* Card 2: 광명시 종합 도시지수 */}');
const cityCard3Start = cityContent.indexOf('{/* Card 3: 광명시 데이터 알림 */}');

if (cityCard1Start === -1 || cityCard2Start === -1 || cityCard3Start === -1) {
  console.log("Could not find cards in CityDataMap");
  process.exit(1);
}

const newCityContent = 
  cityContent.substring(0, cityCard1Start) + 
  mileCard1 + 
  mileCard2 + 
  cityContent.substring(cityCard3Start);

fs.writeFileSync(cityFile, newCityContent, 'utf8');
console.log("Cards successfully replaced in CityDataMap!");
