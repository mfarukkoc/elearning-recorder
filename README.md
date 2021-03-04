# elearning recorder

## What is this project ?

- This project is a graduation project.

- The aim of the project is to collect short record data from distance education students.

## How the site works ?

1. Student opens the website.

2. The user presses the record button and the site asks for confirmation to turn on the camera.

3. Once confirmed, recording begins. The recording continues until the user presses the stop button.

4. Clicking the stop button, the site saves the video to its server using the **POST** request method.

5. Finally, the student will choose his / her feelings in the recorded video from the buttons provided by the site. In addition, the site will record this data.

### Important note

The fifth step is currently being discussed. The instructor will be asked whether the emotion will be chosen during or after the student's recording.

## What was used for the site ?

### Frontend

- [Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/download/) and [jquery](https://jquery.com/download/) packages are used for front-end of the site.

- [Webrtc](https://webrtc.org/) package is used for video recording.

- SVG Images on the website are taken from [storyset](https://storyset.com/)

- [typed](https://github.com/mattboldt/typed.js/) package is used for animations within the site.

### Backend

- [Node.js](https://nodejs.org/en/download/) JavaScript runtime engine.

- [express](https://www.npmjs.com/package/express) unopinionated, minimalist web framework.

- [multer](https://www.npmjs.com/package/multer) middleware for handling `multipart/form-data` and file uploading.

- [yarn](https://yarnpkg.com/) is used for package management

- [uuid](https://github.com/uuidjs/uuid) is used to create the folder id for each **POST** operation.

- [body parser](https://github.com/expressjs/body-parser) parses every incoming **REQUEST**.

## So what do we do with this data ?

- We are planning to build a model that can understand the emotions of the students with the camera with the video images we have taken from the user in the future.

- In this way, we think that we will contribute to distance education.

## Site Limitations

- Recordings are recorded in video **webm** format and **480p** quality. The reason for recording with such low resolution is that our servers do not have the capacity to store high quality video yet. If we record high resolution video, our servers can record very few videos.