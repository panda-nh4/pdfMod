# PDFMod
An easy to use react app to extract or re-order pages from a pdf document. \
You can create an account to share or edit the modified PDFs. A live version of the app can be found [here](https://p4ndanh4.shop/).


## Install
1. Clone repo
```
git clone https://github.com/panda-nh4/pdfMod.git
```
2. Move to pdfMod directory
```
cd pdfMod
```
3. Install backend packages
```
npm i
```
5. Rename 'sample.env' to '.env' after filling setting values in it.
  > sample.env -> .env
7. Change directory to frontend Install frontend packages
```
cd frontend;
npm i
```
8. Build frontend
```
npm run build
```
9. Go back to pdfMod folder and start server by
```
cd ..;
npm run server
```

## Backend
+ Node.js and Express
+ MongoDB as database
+ multer for handling file uploads
+ jsonwebtoken package for authentication
+ bcrypt for hashing passwords
+ pdf-lib for creating and modifying PDFs

## Frontend
+ React
+ Material UI
+ react-pdf for rendering PDFs
+ react-redux for state management
+ react-router-dom for routing
+ react-dnd for drag and drop functionality
+ react-toastify for toast messages
