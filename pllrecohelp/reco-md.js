const fs = require('fs');

const allData = JSON.parse(fs.readFileSync('./pll-recognition.json', 'utf8'));

const fileContent = renderPage(allData);

function renderPage(allData) {
  return `# PLL Recognition
${allData.map(data => renderData(data)).join('')}`;
}

function renderData(data) {
  return `
## ${data.name}

\`\`\`
${data.algo}
\`\`\`
${renderCases(data)}
`;
}

function renderCases(data) {
  for (angle of data.cases) {
    angle.solve = angle.rotation + data.algo.replace(/\s|\)|\(|\[|\]/g, '');
  }
  return `${data.cases.map(angle => renderCase(angle)).join('')}`;
}

function renderCase(angle) {
  return `
### Case ${angle.rotation}

![](http://cube.crider.co.uk/visualcube.php?fmt=svg&size=150&pzl=3&stage=ll&case=${encodeURIComponent(angle.solve)})

${renderComments(angle)}`;
}

function renderComments(angle) {
  return `${angle.comments.length === 0 ? `Not yet available.\n` : ''}${angle.comments.map(comment => `- ${comment}\n`).join('')}`;
}

// console.log(fileContent);

fs.writeFile('pll-recognition.md', fileContent, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
