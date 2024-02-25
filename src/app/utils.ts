export const sizeBySimilarity = (str: string, similarity: number) => {
  const size = similarity * 40;
  return `<span style="font-size: ${size}px">${str}</span>`
}

export const getSimilarity = async (sentence1: string, sentence2: string) => {
  if (sentence1 === '' || sentence2 === '') {
    return 0;
  }

  const response = await fetch('/api/sentence_similarity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sentence1,
      sentence2
    })
  });

  return response.json();
}