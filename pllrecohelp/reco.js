const fs = require('fs');

const allData = JSON.parse(fs.readFileSync('./pll-recognition.json', 'utf8'));

const fileContent = renderPage(allData);

function renderPage(allData) {
  return `<!DOCTYPE html>

<html>

<head>
  <meta charset="UTF-8">
  <title>PLL Recognition</title>
  <meta property="og:title" content="PLL Recognition">
  <meta property="og:url" content="">
  <meta property="og:site_name" content="ldez magic puzzle (rubik's)">
  <meta property="og:description" content="PLL Recognition">
  <meta name="description" content="PLL Recognition">
  <style>
    * {
      box-sizing: border-box;
    }

    .headerlink {
        color: rgba(0,0,0,.26);
        text-decoration: none;
    }

    .wrap {
      max-width: 940px;
      margin: 0 auto;
    }

    .wrapper>div {
      border: 2px solid rgb(233, 171, 88);
      border-radius: 5px;
      padding: 1em;
    }

    .wrapper {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 1em;
      grid-auto-rows: minmax(100px, auto);
    }
  </style>
</head>

<body>

  <main class="wrap">
    ${allData.map(data => renderData(data)).join('')}
  </main>

</body>

</html>
`;
}

function renderData(data) {
  return `
  <article>
    <header>
      <h2 id="${data.name}" title="${data.category}">PLL ${data.name} <a class="headerlink" href="#${data.name}" title="Permanent link">¶</a></h2>
      <pre>${data.algo}</pre>
    </header>
    ${renderCases(data)}
  </article>
`;
}

function renderCases(data) {
  for (angle of data.cases) {
    angle.solve = angle.rotation + data.algo.replace(/\s|\)|\(|\[|\]/g, '');
  }

  return `
      <section class="wrapper">
        ${data.cases.map(angle => renderCase(angle)).join('')}
      </section>
  `;
}

function renderCase(angle) {
  return `
        <section>
          <h3>Case ${angle.rotation}</h3>
          <img src="http://cube.crider.co.uk/visualcube.php?fmt=svg&size=150&pzl=3&stage=ll&case=${encodeURIComponent(angle.solve)}" alt="${angle.solve}">
          ${renderComments(angle)}
        </section>
`;
}

function renderComments(angle) {
  if (angle.comments.length === 0) {
    return `<span>NA</span>`;
  }

  return `
          <details>
            <ul>
              ${angle.comments.map(comment => `<li>${comment}</li>`).join('')}
            </ul>
          </details>
`;
}

// console.log(fileContent);

fs.writeFile('index.html', fileContent, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
