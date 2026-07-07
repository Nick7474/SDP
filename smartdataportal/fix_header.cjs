const fs = require('fs');

let code = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/Header.tsx', 'utf-8');

// Replace desktop menu onClick
const target1 = `                  <a 
                    href="#sol-map" 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('intro');
                      setTimeout(() => {
                        const el = document.getElementById('sol-map');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}`;
const replace1 = `                  <a 
                    href="#city-map" 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('cityMap');
                    }}`;
code = code.replace(target1, replace1);

// Replace mobile menu onClick
const target2 = `                    <a 
                      href="#sol-map" 
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        onNavigate('intro');
                        setTimeout(() => {
                          const el = document.getElementById('sol-map');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}`;
const replace2 = `                    <a 
                      href="#city-map" 
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        onNavigate('cityMap');
                      }}`;
code = code.replace(target2, replace2);

fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/Header.tsx', code, 'utf-8');
console.log('Fixed Header.tsx navigation to cityMap.');
