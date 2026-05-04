resultsDiv.innerHTML = "";

if (data.Heading && data.AbstractText) {
  resultsDiv.innerHTML += `
    <div class="result-item">
      <h2><a href="${data.AbstractURL}" target="_blank">${data.Heading}</a></h2>
      <p>${data.AbstractText}</p>
    </div>
  `;
}

if (data.RelatedTopics) {
  data.RelatedTopics.forEach(item => {
    if (item.Text && item.FirstURL) {
      resultsDiv.innerHTML += `
        <div class="result-item">
          <h3><a href="${item.FirstURL}" target="_blank">${item.Text}</a></h3>
        </div>
      `;
    }
  });
}
