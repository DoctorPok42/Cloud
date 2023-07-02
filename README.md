<div align="center">
    <img src="public/favicon.ico" width="30%">
</div>

# NAS CLOUD

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

3. Add .env file

```bash
touch .env
```

4. Add the following variables to the .env file

```bash
SFTP_URL="YOUR_URL"
SFTP_PORT=YOUR_PORT
ENCODED_KEY="YOUR_ENCODED_KEY"
```

5. Run the project

```bash
npm run dev
```

## Usage

1. Go to http://localhost:3000

2. Login with your ssh credentials

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
