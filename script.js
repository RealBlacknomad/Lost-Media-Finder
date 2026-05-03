resultsDiv.innerHTML = "";

if (data.Heading && data.AbstractText) {
  resultsDiv.innerHTML += `
    <div class="result-item">
      <h2>${data.Heading}</h2>
      <p>${data.AbstractText}</p>
      ${data.AbstractURL ? `<p><a href="${data.AbstractURL}" target="_blank">Más información</a></p>` : ""}
    </div>
  `;
}

if (data.RelatedTopics && data.RelatedTopics.length > 0) {
  data.RelatedTopics.forEach(item => {
    if (item.Text && item.FirstURL) {
      resultsDiv.innerHTML += `
        <div class="result-item">
          <h3><a href="${item.FirstURL}" target="_blank">${item.Text}</a></h3>
          <p>${item.Text}</p>
        </div>
      `;
    }
  });
}
