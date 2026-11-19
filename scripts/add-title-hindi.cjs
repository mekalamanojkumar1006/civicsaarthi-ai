const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'src', 'data', 'schemesData.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('titleHindi?: string')) {
  content = content.replace('titleTelugu: string\n', 'titleTelugu: string\n  titleHindi?: string\n');
}

const map = {
  'pm-kisan': 'पीएम किसान सम्मान निधि योजना',
  'ayushman-bharat': 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (पीएम-जय)',
  'pm-surya-ghar': 'पीएम सूर्य घर: मुफ्त बिजली योजना',
  'rythu-bandhu': 'रैतु भरोसा / रैतु बंधु योजना (तेलंगाना)',
  'kalyana-lakshmi': 'कल्याणा लक्ष्मी / शादी मुबारक योजना',
  'pm-mudra': 'प्रधानमंत्री मुद्रा योजना (PMMY)',
  'pm-awas-gramin': 'प्रधानमंत्री आवास योजना (ग्रामीण)',
  'post-matric-scholarship': 'एससी/एसटी/ओबीसी छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति',
  'sukanya-samriddhi': 'सुकन्या समृद्धि योजना (SSY)',
  'mgnrega': 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (मनरेगा)',
};

for (const [id, titleHi] of Object.entries(map)) {
  if (content.includes(`'${id}'`) && !content.includes(titleHi)) {
    const reg = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?titleTelugu:\\s*['"][^'"]*['"])`, 'm');
    content = content.replace(reg, `$1,\n    titleHindi: '${titleHi}'`);
  }
}

fs.writeFileSync(file, content);
console.log('Successfully updated schemesData.ts with titleHindi!');
