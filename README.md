# GuildFi Assignment

Repository นี้เป็นส่วนหนึ่งของ GuildFi Assignment สำหรับ Job Interview

โดยเป็นการ Clone map ของเกม League of legends https://map.leagueoflegends.com/ โดยใช้ React, Three.js และ MetaMask (ในการทำ auth)

## How to run

project นี้ได้ใช้ react ในการพัฒนาโดยได้ใช้ boilerplate ของ create-react-app (typescript version)

### แบบ local development server

```
yarn install
yarn start
```

ไปที่ http://localhost:3000

### แบบ production build

```
yarn build
yarn global add serve
serve -s build
```

ไปที่ http://localhost:3000
