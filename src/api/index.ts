// Hàm thực hiện gọi API với các tham số như trong ảnh chụp màn hình
const callApi = async (name:string, cas:string) => {
    const url = 'https://api.tech.ec.europa.eu/search-api/prod/rest/search?apiKey=285a77fd-1257-4271-8507-f0c6b2961203&text=*&pageSize=100&pageNumber=1';
  
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,en-US;q=0.7,en;q=0.6',
      'Cache-Control': 'No-Cache',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
    };
  
    // Payload như trong phần 'Form Data' trong ảnh
    const payload = {
      bool: {
        must: [
          {
            text: {
              query: name,
              fields: [
                'inciName.exact',
                'inciUsaName',
                'innName.exact',
                'phEurName',
                'chemicalName',
                'chemicalDescription',
              ],
              defaultOperator: 'AND',
            },
          },
          {
            text: {
              query: cas,
              fields: ['casNo', 'ecNo'],
            },
          },
        ],
        terms: {
          itemType: ['ingredient', 'substance'],
        },
      },
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        return data;
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return null;
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      return null;
    }
  };
  
  export default callApi;
  