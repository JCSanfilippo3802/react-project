/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('message').classList.remove('hidden');
  };
  
  /* Sends post requests to the server using fetch. Will look for various
     entries in the response JSON object, and will handle them appropriately.
  */
  const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    document.getElementById('message').classList.add('hidden');
  
    if(result.redirect) {
      window.location = result.redirect;
    }
  
    if(result.error) {
      handleError(result.error);
    }

    if(handler) {
        handler(result);
    }
  };
    
  const uploadFile = async (e, handler) => {

    const response = await fetch('/upload',{
        method: 'POST',
        body: new FormData(e),
    });

    const result = await response.json();
  
    if(result.redirect) {
      window.location = result.redirect;
    }
  
    if(result.error) {
      handleError(result.error);
    }

    if(handler) {
      handler(result);
    }

    return false;
  };

  const hideError = () => {
    document.getElementById('message').classList.add('hidden');
   };

   module.exports = {
    handleError,
    sendPost,
    uploadFile,
    hideError,
   };
