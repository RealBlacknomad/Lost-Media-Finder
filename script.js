// Mostrar Abstract principal
if (data.Heading && data.AbstractText) {
  const div = document.createElement("div");
  div.className = "result-item";
  div.innerHTML = `
    <h2>${data.Heading}</h2>
    <p>${data.AbstractText}</p>
    ${data.AbstractURL ? `<p><a href="${data.AbstractURL}" target="_blank">Más información</a></p>` : ""}
  `;
  resultsDiv.appendChild(div);
}

// Mostrar RelatedTopics
if (data.RelatedTopics && data.RelatedTopics.length > 0) {
  data.RelatedTopics.forEach(item => {
    if (item.Text && item.FirstURL) {
      const div = document.createElement("div");
      div.className = "result-item";
      div.innerHTML = `
        <h3><a href="${item.FirstURL}" target="_blank">${item.Text}</a></h3>
        <p>${item.Text}</p>
      `;
      resultsDiv.appendChild(div);
    }
  });
}
