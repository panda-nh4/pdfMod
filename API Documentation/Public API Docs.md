### Api Documentation
## Public Api
Four endpoints:
1. /api/file/upload  
   Accepts form data with:
   1. field:files
      value: file to be uploaded
      
    Returns:
    1. JSON with new name of uploaded file
2. /api/file/view  
   Accepts query parameter:
   1. field: fileName
      value: name of uploaded file as returned from /file/upload
      
   Returns:
    1. PDF File
3. /api/file/extract  
   Accepts JSON body:
   1. fileName: name of uploaded file as returned from /file/upload  
   2. pageArray: array of page numbers (indexed from 0) in the order they are to be extracted
   
    Returns:  
      1. Returns modified PDF file


4. /api/files/download  
   Accepts query parameter:
   1. field: fileName
      value: name of modified file
      
   Returns:
    1. Modified file
   