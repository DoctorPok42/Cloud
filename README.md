<div align="center">
    <img src="public/favicon.ico" width="30%">
</div>

# NAS CLOUD

## Description

This project is a simple cloud that allows you to upload files to a remote server using SFTP. It is built with Next.js and TypeScript. It uses the SSH2 library to connect to the server and upload the files. The project is still in development and will be updated regularly.

## Features

- [x] Upload files to a remote server
- [x] Download files from a remote server
- [x] Delete files from a remote server
- [x] Create directories on a remote server
- [x] Delete directories from a remote server

## Requirements

1. Node JS 12.16.1 or higher

```bash
$ node -v
v12.16.1
 ```

## Installation

1. Clone the repository

```bash
git clone git@github.com:DoctorPok42/cloud.git
```

2. Install dependencies

```bash
npm install
```

3. Change the `.env.example` file name to `.env` and fill the values with your own. The `.env` file should look like this:

```bash
SFTP_URL="" # "192.168.1.1"
SFTP_PORT= # 22
ENCODED_KEY="" # "goodkey"
PATH= # "/path/to/remote/directory"
```

5. Run the project

```bash
npm run dev
```

## Usage

1. Go to http://localhost:3000

2. Login with your ssh credentials

⚠️ Be sure that the user is in the **ssh** group of your server : `sudo usermod -aG ssh <username>` ⚠️

3. Upload your files

4. Enjoy your cloud

## Tech

- [Next.js](https://nextjs.org/)
- [TS](https://www.typescriptlang.org/)
- [SASS](https://sass-lang.com/)
- [SSH2](https://www.npmjs.com/package/ssh2)

## Folder structure

- **components** - Contains all the components used in the project
- **pages** - Contains all the pages used in the project
- **public** - Contains all the static files used in the project
- **styles** - Contains all the styles used in the project
- **api** - Contains all the api used in the project

## License

[MIT](https://github.com/DoctorPok42/cloud/blob/develop/LICENSE)
