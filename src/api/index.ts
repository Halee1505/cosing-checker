/* eslint-disable no-useless-escape */

const callApi = async (searchBy: "name" | "cas" | "all", name: string, cas: string) => {
  let response: any = null;
  if (searchBy === "all" && cas) {
    console.log("search by all");
    response = await fetch("https://api.tech.ec.europa.eu/search-api/prod/rest/search?apiKey=285a77fd-1257-4271-8507-f0c6b2961203&text=*&pageSize=100&pageNumber=1", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        "cache-control": "No-Cache",
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryKga4Sa7bVWObrwUw",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
      },
      "referrer": "https://ec.europa.eu/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": `------WebKitFormBoundaryKga4Sa7bVWObrwUw\r\nContent-Disposition: form-data; name=\"query\"; filename=\"blob\"\r\nContent-Type: application/json\r\n\r\n{\"bool\":{\"must\":[{\"text\":{\"query\":\"${name}\",\"fields\":[\"inciName.exact\",\"inciUsaName\",\"innName.exact\",\"phEurName\",\"chemicalName\",\"chemicalDescription\"],\"defaultOperator\":\"AND\"}},{\"text\":{\"query\":\"*${cas}*\",\"fields\":[\"casNo\",\"ecNo\"]}},{\"terms\":{\"itemType\":[\"ingredient\",\"substance\"]}}]}}\r\n------WebKitFormBoundaryKga4Sa7bVWObrwUw--\r\n`,
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    });
  }
  else if(searchBy === "cas" && cas) {
    console.log("search by cas");
    response = await fetch("https://api.tech.ec.europa.eu/search-api/prod/rest/search?apiKey=285a77fd-1257-4271-8507-f0c6b2961203&text=*&pageSize=100&pageNumber=1", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        "cache-control": "No-Cache",
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryAUeEzKqWIsdNZdJj",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
      },
      "referrer": "https://ec.europa.eu/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": `------WebKitFormBoundaryAUeEzKqWIsdNZdJj\r\nContent-Disposition: form-data; name=\"query\"; filename=\"blob\"\r\nContent-Type: application/json\r\n\r\n{\"bool\":{\"must\":[{\"text\":{\"query\":\"***\",\"fields\":[\"inciName.exact\",\"inciUsaName\",\"innName.exact\",\"phEurName\",\"chemicalName\",\"chemicalDescription\"],\"defaultOperator\":\"AND\"}},{\"text\":{\"query\":\"*${cas}*\",\"fields\":[\"casNo\",\"ecNo\"]}},{\"terms\":{\"itemType\":[\"ingredient\",\"substance\"]}}]}}\r\n------WebKitFormBoundaryAUeEzKqWIsdNZdJj--\r\n`,
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    });
  }
  
  else if(searchBy === "name" || !cas) {
    console.log("search by name");
    response = await fetch("https://api.tech.ec.europa.eu/search-api/prod/rest/search?apiKey=285a77fd-1257-4271-8507-f0c6b2961203&text=*&pageSize=100&pageNumber=1", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        "cache-control": "No-Cache",
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryAjf3Vet2Hk0qTjYh",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
      },
      "referrer": "https://ec.europa.eu/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": `------WebKitFormBoundaryAjf3Vet2Hk0qTjYh\r\nContent-Disposition: form-data; name=\"query\"; filename=\"blob\"\r\nContent-Type: application/json\r\n\r\n{\"bool\":{\"must\":[{\"text\":{\"query\":\"${name}\",\"fields\":[\"inciName.exact\",\"inciUsaName\",\"innName.exact\",\"phEurName\",\"chemicalName\",\"chemicalDescription\"],\"defaultOperator\":\"AND\"}},{\"terms\":{\"itemType\":[\"ingredient\",\"substance\"]}}]}}\r\n------WebKitFormBoundaryAjf3Vet2Hk0qTjYh--\r\n`,
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    });
  }
  
  const data = await response.json();
  return data;
};

export default callApi;
