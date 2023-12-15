# PDFMod
An easy to use react app to extract or re-order pages from a pdf document. \
You can create an account to share or edit the modified PDFs. A live version of the app can be found [here](https://p4ndanh4.shop/).

## What it looks like
### On mobile:
![](/Screenshots/Mobile/4.gif)
### On desktop:
![](/Screenshots/Desktop/1.png)
![](/Screenshots/Desktop/3.png)
![](/Screenshots/Desktop/6.png)
![](/Screenshots/Desktop/8.png)

More screenshots [here](/Screenshots)

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
4. Rename 'sample.env' to '.env' after filling setting values in it.
  > sample.env -> .env
5. Change directory to frontend Install frontend packages
```
cd frontend;
npm i
```
6. Build frontend
```
npm run build
```
7. Go back to pdfMod folder and start server by
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
+ API Docs [here](API%20Documentation/Public%20API%20Docs.md)

## Frontend
+ React
+ Material UI
+ react-pdf for rendering PDFs
+ react-redux for state management
+ react-router-dom for routing
+ react-dnd for drag and drop functionality
+ react-toastify for toast messages
