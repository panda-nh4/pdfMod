### Api Documentation
## Public Api
Four endpoints:
1. /api/file/upload  
   Used to upload file to server.  
   Accepts form data with:
   1. field:files
      value: file to be uploaded
      
    Returns:
    1. JSON with new name of uploaded file
3. /api/file/view
   Used to view uploaded file from server.  
   Accepts query parameter:
   1. field: fileName
      value: name of uploaded file as returned from /file/upload
      
   Returns:
    1. PDF File
5. /api/file/extract  
   Used to make new PDF dowcument based on the previously uploaded file and the selected pages and page order.  
   Accepts JSON body:
   1. fileName: name of uploaded file as returned from /file/upload  
   2. pageArray: array of page numbers (indexed from 0) in the order they are to be extracted
   
    Returns:  
      1. Returns modified PDF file


7. /api/files/download  
   Used to get the new modified PDF from server.  
   Accepts query parameter:
   1. field: fileName
      value: name of modified file
      
   Returns:
    1. Modified file
   
