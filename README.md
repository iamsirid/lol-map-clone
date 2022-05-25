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

### แบบ online deployment

สำหรับกรณีที่บนเครื่องไม่มี Node.js หรือไม่สามารถ run ตาม 2 แบบข้างต้นได้

project นี้ได้ทำการ deployed บน Vercel ไว้แล้ว

https://guildfi-assignment-fhiz6sqwb-iamsirid.vercel.app/

## Project Walkthrough

หน้าแรกจะพบกับส่วนของการ login ด้วย MetaMask

![](https://user-images.githubusercontent.com/6850971/168804269-96e013dc-46a4-48e6-89fa-64985f2d92e6.png)

หลักการคือจะเก็บ state เป็น userAddress ของ user ไว้โดยได้มาจาการเช็ค ethereum account ของ user จาก MetaMask extension บน browser

App.tsx

![](https://user-images.githubusercontent.com/6850971/168804516-844610d4-e7a1-4590-9aaa-8cc097d81a8c.png)

ถ้า window.ethereum มีค่าแสดงว่ามี metamask extension บน browser

```
 if ((window as any).ethereum) {
   ...}
```

ทำการ request account มาและเก็บไว้ใน state

```
        const accounts = await (window as any).ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
        }
      }
```

ส่วนของการ render เป็นการเช็คว่า state userAddress มีค่าหรือไม่ ถ้าไม่มีให้โชว์ Login component ถ้ามี ให้โชว์ Map component ซึ่งก็คือ component หลักของ Project นี้นั้นเอง

```
return userAddress ? (
    <Map />
  ) : (
    <Login
      login={async () => {
        ...
      }}
    />
  );
```

### Login component

ส่วนของ component สำหรับการ login (components/Login.tsx) จะแสดง ปุ่ม Login with MetaMask พร้อม css styling ด้วย @emotion/styled โดยหลักการตัว component จะรับ prop ฟังชั่น login มาแล้ว callback กลับไปเมื่อปุ่มถูกกด

![](https://user-images.githubusercontent.com/6850971/168804650-0e4a057b-02f0-4df5-a768-c418438a86d7.png)

เพราะฉะนั้น logic ของการ login จะไปอยู่ที่ parent (App.tsx)

![](https://user-images.githubusercontent.com/6850971/168804780-3eff2456-9320-4f0c-81c9-d506a9244125.png)

เช็คว่า browser มี MetaMask extension หรือไม่ ถ้าไม่ให้ alert แจ้งเตือนและ return ออก

```
        if (!(window as any).ethereum) {
          alert('Get MetaMask!');
          return;
        }
```

request account และ set userAddress state

```
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });

        setUserAddress(accounts[0]);
```

เมื่อผ่านขั้นตอนการ authen ด้วย MetaMask แล้ว component Map (components/Map.tsx) จะถูก render

![](https://user-images.githubusercontent.com/6850971/168804875-f46f5faa-6020-4a49-80ea-20e475624d3b.gif)

### Map component

component Map คือส่วนหลักของ Project นี้

โดย Map.tsx (components/Map.tsx)

จะแบ่งเป็น 3 ส่วนหลักๆคือ

![](https://user-images.githubusercontent.com/6850971/168805029-705029a4-2e91-499b-9e85-4194deec3b88.png)

1. css styling for overlay JSX element

2. data ของ map

3. ตัว react component ที่จะ render

#### React component

![](https://user-images.githubusercontent.com/6850971/168805086-743cc717-99b1-4169-b695-190e684698f2.png)

ส่วนของ react จะมีการใช้ hook อยู่ 3 ตัวคือ useRef, useState, useEffect,

useRef เป็น reference ไปยัง canvas ที่จะให้ Three.js วาด และ dom ที่จะ overlay อยู่บน 3D space (จะกล่าวรายละเอียดอีกที)

![](https://user-images.githubusercontent.com/6850971/168805144-fc49fa3e-2cdd-4ab2-9a77-39c51e171dd0.png)

useState เก็บ 2 states คือ

![](https://user-images.githubusercontent.com/6850971/168805156-9071d40d-1a08-486b-8926-d25fa51222fe.png)

- loading สำหรับการ load 3D space ซึ่งเหตุผลที่ต้องเก็บเป็น state และต้องมี loading screen จะกล่าวอีกที

- selectedCity เป็นการเก็บ city data ที่ถูก selected บน map เพื่อโชว์รายละเอียดบน overlay

useEffect 2 ตัว ตัวแรกไม่มี dependencies คือจะทำงานเมื่อ component นี้ถูก render ข้างในจะเป็น logic ของ Three.js

![](https://user-images.githubusercontent.com/6850971/168805163-4b6b89f4-1fd1-4573-84a2-a6a642a18ee6.png)

ตัวที่สองจะ trigger เมื่อ selectedCity เปลี่ยนโดยมี logic เกี่ยวกับแสดงรายละเอียดของ city data บน overlay

![](https://user-images.githubusercontent.com/6850971/168805176-76a4e8b1-c494-4014-8c9a-5eeca9baf043.png)

(ทั้งสองตัวจะกล่าวถึง logic โดยละเอียดอีกที)

สุดท้ายคือส่วน render

![](https://user-images.githubusercontent.com/6850971/168805197-f6256863-8461-4a7e-b426-d235dffd0a05.png)

ส่วนที่เป็นถูกวาด 3D space ลงไปด้วย Three.js คือ `<canvas ...>` โดยมีการ assign ref เพื่อให้ Three.js access DOM ได้

![](https://user-images.githubusercontent.com/6850971/168805207-b3fe85ce-2baf-4077-8e69-959aa8c9f4a4.png)

![](https://user-images.githubusercontent.com/6850971/168805211-19acd7e7-d002-4257-920b-e6565eb418b1.png)

ส่วนอื่นที่เป็น React Component คือ HTML Overlay บน 3D space โดยจะมี

- LoadingScreen หน้า loading ก่อนที่ 3D space จะ load เรียบร้อย

  ![](https://user-images.githubusercontent.com/6850971/168807102-1ecc984f-0324-47b5-86d8-6ff6a2a16d72.gif)

- LeftSidebar overlay แสดง sidebar ทางซ้าย

  ![](https://user-images.githubusercontent.com/6850971/168805236-3f9b801a-f147-4206-8329-c2e8dfee0939.png)

- RightSidebar overlay แสดง sidebar ทางขวาแสดงข้อมูลของ city ที่ถูกเลือก

  ![](https://user-images.githubusercontent.com/6850971/168807078-7ddcbeb2-56a8-4bb2-9bd9-a3d552385aa2.gif)

##### Three.js Logic

ใน useEffect อันแรกจะเป็น logic ทั้งหมดของ Three.js ทั้งหมดซึ่งจะถูก execute แค่ครั้งเดียวตอน react component render (คล้าย componentDidMount ใน React Class) เหตุผลคือการ setup logic ของ Three.js ทำครั้งแค่ครั้งเดียวในการ render ของ react และส่วนของการ update แต่ละ frame เช่นการ control ของ camera จะใช้หลักการของการ call ตัวเองในทุกๆ frame ด้วย `window.requestAnimationFrame`
![](https://user-images.githubusercontent.com/6850971/168805245-732a1ebe-316e-4a92-ad00-cf4235178ca0.png)

ส่วนแรกของ logic จะเป็นการ access ref ที่มาจาก useRef ที่กล่าวไปข้างต้น
![](https://user-images.githubusercontent.com/6850971/168805259-d010380b-1928-4e3c-a0f3-b9a3cb70fc35.png)

ส่วนของ if block เป็นการเช็ค current ref ว่าต้องมีค่าถึงจะให้ทำงานต่อ เนื่องจาก ref.current ไม่การัณตีว่าจะมีค่า แต่ในกรณีของการเข้า `useEffect(() => {...},[])` ref.current จะมีค่าแน่นอนเพราะผ่านการ render มาแล้ว 1 ที (หลักการของ React) แต่ต้องเช็คอยู่เพื่อเป็น type check (typescript) และส่วนล่างสุดเป็นการ set ให้ sidebar ทั้ง 2 ไม่ overflow viewport (styling)

ส่วนต่อไปคือการเก็บตัวแปร points คือเป็น การ represent จุดเป็น 3D space ที่เราจะเอา HTML Overlay ลงไปวาง เนื่องจาก overlay นั้นอึงกับ viewport ไม่ได้อิงกับ 3D space ถ้าเราต้องการให้ Overlay นั้นเหมือนอยู่บน 3D space เช่นเมื่อ pan camera แล้ว overlay ลอยตาม ต้องมีการ map position และ logic เพิ่มเติม

![](https://user-images.githubusercontent.com/6850971/168805277-96447edf-e7d2-4ff5-b616-fd6aeb934238.png)

![](https://user-images.githubusercontent.com/6850971/168807030-8761bde0-eb4f-41aa-9fff-5a98a182100a.gif)

โดยเก็บ 2 ค่าคือ Vector3 represent จุดของ point นั้นบน 3D space และ element คือ ref ไปยัง HTML overlay โดยค่าทั้ง 2 ได้เก็บเป็น data ของ city บน map ตามที่ได้กล่าวไว้ข้างต้น รายละเอียดของแต่ละ city จะมีดังนี้
![](https://user-images.githubusercontent.com/6850971/168805288-58bd9c20-7349-4a4a-80f9-95b3e84f82ac.png)

![](https://user-images.githubusercontent.com/6850971/168805295-0f169e19-38c9-4e33-b6a8-ee95a8b3fa3a.png)

- name ชื่อ city ใช้สำหรับแสดงเป็น label และอ้างอิงถึง icon file ซึ่งเป็นไฟล์ใน public directory ของ react

  ![](https://user-images.githubusercontent.com/6850971/168805309-ed4c3715-6383-4e37-b008-af1dd88dbdb5.png) ![](https://user-images.githubusercontent.com/6850971/168805319-167ba048-bff7-4268-961d-6d666662ec7e.png)

  ![](https://user-images.githubusercontent.com/6850971/168805336-07c1d92c-6b34-4470-b9c6-53c158a7fcfd.png)

- slogan และ desc แสดงใน RightSidebar

  ![](https://user-images.githubusercontent.com/6850971/168805346-f858490d-908c-4fae-a542-98176573bfc4.png)

- pos คือ Vector3 represent ตำแหน่งบน 3D space
- sideLabel เป็น optional property สำหรับ Piltover & Zaun city ที่ต้องการแสดง label ด้านข้างแทนด้านล่าง

![](https://user-images.githubusercontent.com/6850971/168805356-482c08ea-30b3-450a-a736-646fee1d9240.png)

ส่วนต่อไปเป็นส่วนแรกที่เริ่มเรียกใช้ Three.js library
![](https://user-images.githubusercontent.com/6850971/168805371-fae8ebec-3467-443f-877a-82bd13220929.png)

เริ่มจากการ initialize new Three.js scene

ส่วนของ LoadingManager คือการจัดการ load 3D space โดยมี callback function เมื่อ load เสร็จ
![](https://user-images.githubusercontent.com/6850971/168805385-be462a81-901e-4c4f-9c6b-8ee5c3891c9b.png)

โดย logic ด้านในคือการเอา loadingScreen overlay ออกไปจาก DOM โดยเริ่มจากการ add element class เพื่อ trigger css animation
และ listen event เมื่อ transition เสร็จก็ remove loadingScreen ออกจาก DOM Tree และเสร็จ state loading เป็น false

ซึ่ง state loading นั้นใช้ในการทำ work around ปัญหา Sidebar overlay แสดงออกมาตั้งแต่ loadingScreen เนื่องจาก Overlay ไม่ได้ต้องถูกรอ 3D space load เสร็จก่อน แต่เพื่อความสวยงามจึงใช้การเก็บ state และ set opacity ให้มองไม่เห็นเมื่อยัง load อยู่แทน
![](https://user-images.githubusercontent.com/6850971/168805402-2cfe15c8-7f2a-4d88-8f70-c0e0b011328d.png)

![](https://user-images.githubusercontent.com/6850971/168805408-a3ca4278-71b0-42bc-8666-9364ec77fd30.png)

ส่วนของ 3D model loader (mesh & texture)

3D ใน Project นี้คือ terrian นั้นเอง

ตัว terrian นั้นเป็น 3D model มาจาก blender โดยหลักการมาจาก plane ที่มี texture เป็นรูปภาพของ map ของเกม LOL และใช้ sculpt mode ใน blender ในการสร้างความนูนให้ terrian

![](https://user-images.githubusercontent.com/6850971/168806986-28e00cf5-00e3-405e-9a40-d112c7bbfb8a.gif)

![](https://user-images.githubusercontent.com/6850971/168806923-3164dd66-3767-406c-a91e-f249dc369e0f.png)

initialize TextureLoader

```
    const textureLoader = new THREE.TextureLoader(loadingManager);
```

เนื่องจากตัว model export เป็นสกุล .glb (gLTF) จึงต้องใช้ DracoLoader และ GLTFLoader

```
    const dracoLoader = new DRACOLoader(loadingManager);
    dracoLoader.setDecoderPath('draco/');

    const gltfLoader = new GLTFLoader(loadingManager);
    gltfLoader.setDRACOLoader(dracoLoader);
```

ทำการ load texture 'terrian.png'
และสั่ง flipY เป็น false (default เป็น true) เนื่องจากใช้ GLTFLoader ทำให้ไม่มีปัญหาของ conflict แกน Y ที่บางที่ + เป็นขึ้น บางที่ + เป็นลง (เนื่องจาก GLTFLoader สามารถ configure texture ได้ถูกต้อง ref: https://threejs.org/docs/index.html#examples/en/loaders/GLTFLoader)

และสร้าง material แบบ basic (MeshBasicMaterial) และใส่ texture เข้าไป

```
    const texture = textureLoader.load('terrian.png');
    texture.flipY = false;

    const material = new THREE.MeshBasicMaterial({ map: texture });
```

สุดท้ายทำการ load model ด้วย gltfLoader และใส่ material ให้กับ model (ในที่นี้ mesh ที่จะถูกใส่ material คือ child ของ scene ใน model เลย tranverse child แล้ว assign material เข้าไป) สุดท้ายคือ add model เข้าไปใน scene ของ Three.js

```
    gltfLoader.load('my-terrian.glb', (gltf) => {
      gltf.scene.traverse((child: any) => {
        child.material = material;
      });
      scene.add(gltf.scene);
    });
```

ส่วนของการ render และการ control
![](https://user-images.githubusercontent.com/6850971/168805426-105082c2-d5c3-433b-bd99-424b0b9a1926.png)

ทำการ initialize new WebGLRenderer และส่ง ref ของ canvas element เข้าไป

```
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
```

ทำการสร้างตัวแปร literal object อันนึงขึ้นมาชื่อ sizes เก็บค่าขนาดของ viewport เพื่อใช้ในการคำนวณในส่วนอื่น ๆ

```
const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
};
```

ส่วนของ camera คือมุมมองที่ user จะเห็นการ render ของ 3D space โดย initialize เป็นแบบ Perspective เพื่อให้เห็น dept ของ 3D (ต่างจาก Orthographic ที่จะไม่เห็น dept)

```
    const camera = new THREE.PerspectiveCamera(
      50,
      sizes.width / sizes.height,
      0.1,
      100
    );

    camera.position.x = 0;
    camera.position.y = 1;
    camera.position.z = 0;

    scene.add(camera);
```

โดยรับ arguments 4 ตัวคือ
![](https://user-images.githubusercontent.com/6850971/168805437-d43b38ba-cf06-4597-8dd7-a81f55ec29f8.png)

- fov ใช้ค่า default ที่ 50
- aspect ration หาได้จากการเอา width / height
- near ใช้ค่า default ที่ 0.1
- far เนื่องจากเราไม่ต้องการ zoom out ไกลจาก terrian มาก ค่า 100 จึงเพียงพอ

ต่อไปคือ position ของ camera เนื่องจากค่า default อยู่ที่ (0,0,0) และ terrian อยู่ที่ (0,0,0) camera จึงต้องถอยออกมาเพื่อให้เห็น terrian โดยเนื่องจาก terrian วางอยู่ในลักษณะหงายขึ้น และแกน Y ใน Three.js คือแนว verticle จึง set position ของ y ของ camera เป็น 1

![xyz-axis](https://user-images.githubusercontent.com/6850971/168806855-060669ee-105e-4130-9f2e-7a8cfd7fce3f.png)

![](https://user-images.githubusercontent.com/6850971/168805445-f21f9f1f-0337-4cde-a8e8-ae249a29340d.png)

และสุดท้ายคือ add camera เข้า scene ของ Three.js

ส่วนของ resize event listener ส่วนนี้คือ watch event การ resize หน้าต่าง browser และปรับ camera และ renderer ให้ตรง

```
 window.addEventListener('resize', () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
```

![](https://user-images.githubusercontent.com/6850971/168806820-b5e35ec7-74e5-4f06-910e-0a65b0069ab7.gif)

ส่วนของ control คือการควบคุม camera โดยในทีนี้จะใช้ OrbitControls ที่ custom ปุ่มของเมาส์ที่ใช้ควบคุมเพื่อให้ใกล้เคียง reference ที่สุด

```
    const controls = new OrbitControls(camera, canvas);
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
```

โดยทั้ง left และ right click and hold เป็นการ pan

![](https://user-images.githubusercontent.com/6850971/168806741-3e0451c6-d5f6-4c89-837c-739e1ac1c5f6.gif)

ลูกกลิ้ง middle mouse เป็นการ zoom

![](https://user-images.githubusercontent.com/6850971/168806696-e644fad7-2f78-4c9a-a442-9ac4bb568a11.gif)

สังเกตุว่าจะไม่มีปุ่มควบคุม rotate เนื่องจากใน case ของ project นี้ไม่ต้องการควบคุมการ rotate ของ camera ด้วยปุ่มใดปุ่มนึงของ mouse แต่จะมีการ rotate ไปพร้อมกับการ zoom เข้า/ออก เพื่อให้เหมือนตาม reference ซึ่ง logic ตรงนี้จะพูดถึงอีกทีในฟังก์ชั่น tick

ส่วนของ renderer

```
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

จะมีการ set size ซึ่งก็คือ width และ height ของ viewport นั้นเอง
และมีการ set pixel ratio อย่างมาก 2 หรือตามค่า device เพื่อป้องกันการ blur ของการ render

ส่วนสุดท้ายคือ update function ชื่อ tick ที่จะ called ทุก frame

```
const tick = () => {
      controls.update();

      if (camera.position.y <= 0.8) {
        camera.rotation.x = -Math.PI * 0.5 + (0.8 - camera.position.y);
      } else {
        camera.rotation.x = -Math.PI * 0.5;
      }

      if (camera.position.y < 0.2) {
        camera.position.y = 0.2;
      } else if (camera.position.y > 1) {
        camera.position.y = 1;
      }

      for (const point of points) {
        const screenPosition = point.position.clone();
        screenPosition.project(camera);

        let x = (screenPosition.x * 0.5 + 0.5) * sizes.width;
        let y = (screenPosition.y * -0.5 + 0.5) * sizes.height;

        point.element.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
      }

      renderer.render(scene, camera);

      window.requestAnimationFrame(tick);
    };

    tick();
```

มีการเรียก

```
controls.update();
```

ในทุก frame เพื่อให้สามารถ control ได้

ส่วนของปรับ rotation และ limit ของ camera

ส่วนแรกคือ logic ในการทำให้ camera rotate ด้วยเวลา zoom ตามตัวอย่างที่เห็นไปข้างต้น

```
      if (camera.position.y <= 0.8) {
        camera.rotation.x = -Math.PI * 0.5 + (0.8 - camera.position.y);
      } else {
        camera.rotation.x = -Math.PI * 0.5;
      }
```

หลักการคือเมื่อ zoom เข้าไปถึงระยะนึง (ในที่นี้คือ y = 0.8) ให้ทำการเริ่ม rotate camera ในแกน x

![](https://user-images.githubusercontent.com/6850971/168805477-74fd1852-fde8-444c-a96d-e697c0360656.png)

โดย Math.PI \* 0.5 คือ 1/4 รอบ เนื่องจาก rotation คำนวณแบบ euler หน่วย radian โดย 1 รอบคือ Math.PI \* 2 เพราะฉะนั้น Math.PI \* 0.5 คือ 1/4 รอบ ส่วน ลบด้านหน้าคือให้หมุนไปในทิศตามเข็มถ้ามองจากทิศตามรูป

![](https://user-images.githubusercontent.com/6850971/168805482-ad3f9c9c-a52f-44b2-903a-4fb5caab450f.png)

ส่วน + (0.8 - camera.position.y); คือ offset การ rotate ที่เพิ่มขึ้นเรื่อยๆตามสัดส่วนของการ zoom แกน y

ใน else คือจะไม่มี offset คือ camera จะหันหน้าทิ่มลง terrian

อีกส่วนนึงคือเป็น limit ของการ zoom เข้าออกของ camera ไม่ให้เกินระยะที่กำหนด (คนละอันกับ near, far arguments ที่ใส่ไปตอน initiaize camara อันนั้นคือระยะที่ camera มองเห็น ส่วนอันนี้ระยะที่ camara สามารถ zoom เข้าไปได้)

```
      if (camera.position.y < 0.2) {
        camera.position.y = 0.2;
      } else if (camera.position.y > 1) {
        camera.position.y = 1;
      }
```

ส่วนนี้เป็น logic ที่ทำให้ point จาก points ที่กำหนดไปในข้างต้น translate ไปบน viewport ให้เหมือนว่าจุด ๆ นั้น เกาะติดอยู่กับ 3D space เวลา pan หรือ zoom
ref: https://r105.threejsfundamentals.org/threejs/lessons/threejs-align-html-elements-to-3d.html

```
   for (const point of points) {
        const screenPosition = point.position.clone();
        screenPosition.project(camera);

        let x = (screenPosition.x * 0.5 + 0.5) * sizes.width;
        let y = (screenPosition.y * -0.5 + 0.5) * sizes.height;

        point.element.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
      }
```

โดย clone position ของแต่ละ point ออกมาเพื่อไม่ให้ค่าจริงถูก mutate แล้วเอาค่านั้นมา project กับ camera จะได้ค่า screen coordiate ที่มีค่า x,y อยู่ในช่วง -1 กับ 1 โดยมีทิศตามรูป

![](https://user-images.githubusercontent.com/6850971/168805497-ee2abec8-7596-4fcc-8d09-eb047a4aaa59.png)

แต่ที่ต้องการไม่ใช่ screen coordiate ระหว่าง -1 กับ 1 แต่เป็นระยะ pixel ตาม CSS coordinates ซึ่ง y จะกลับด้าน

![](https://user-images.githubusercontent.com/6850971/168805510-bec0d2e8-3803-4594-ae3e-700110a891b7.png)

ทำให้ในส่วนของ y ต้องคูณด้วย -1 ไปเพื่อกลับด้าน

และสุดท้ายคือ apply css transform ให้ translate x,y ไปตามค่าที่คำนวณได้

ส่วนสุดท้ายของฟังก์ชั่น tick

```
      renderer.render(scene, camera);

      window.requestAnimationFrame(tick);
```

คือสั่ง render ในทุก ๆ frame และ call ตัวเองใน frame ถัดไป

##### useEffect Logic เมื่อ selectedCity เปลี่ยน

![](https://user-images.githubusercontent.com/6850971/168805526-4587d9e5-fcb0-461c-8d3b-cb1291365f51.png)

ส่วนนี้จะเป็นการ trigger slide in CSS Animation โดยการ add class open ให้ RightSidebar โดย logic ของการ set selectedCity state จะอยู่กับ CityIcon component

![](https://user-images.githubusercontent.com/6850971/168806620-82cb6217-90bb-47cc-93dd-3665c9cfb36c.gif)

### CityIcon Component

![](https://user-images.githubusercontent.com/6850971/168805543-c8936536-fffe-4eb5-8e71-742f08df3b04.png)

ใน CityIcon.tsx (components/CityIcon.tsx) จะ render ส่วนของ icon city และ label city

![](https://user-images.githubusercontent.com/6850971/168805559-6cfbf495-5eaa-46f6-a8c9-4fd83db055aa.png)

โดย icon จะมี version ปกติและ version hover เมื่อเอา cursor ไปวางทับ

![](https://user-images.githubusercontent.com/6850971/168806559-3394a81a-7a58-4124-89a5-72cee87ec27e.gif)

โดยจะรับ props ดังนี้

```
interface CityIconProps {
  label: string;
  icon: string;
  hoverIcon: string;
  onClick: () => void;
  sideLabel?: boolean;
}
```

- label คือ string สำหรับแสดง label ด้านล่างหรือด้านข้าง icon
- icon คือ string ชื่อไฟล์รูป icon ที่อยู่ใน public folder
- hoverIcon คือ string ชื่อรูป icon เวอร์ชั่น hover ที่อยู่ใน public folder
- onClick คือ callback function เมื่อตัว component ถูก click
- sideLabel คือ boolean บอกว่าให้แสดง label ด้านข้างแทนด้านล่างดังตัวอย่างที่เคยกล่าวไปข้างต้น

โดย CityIcon จะถูกเรียกจาก Map components โดยเป็นการ map จาก array data ของ citiesInfo แล้วส่ง props มาดังนี้

![](https://user-images.githubusercontent.com/6850971/168805583-e2d4908e-2dca-453e-8fa1-90a7b450c0d4.png)

จะเห็นว่า name ของ cityInfo จะถูกเอามาใช้เป็นชื่อไฟล์ของ icon ด้วย และ onClick จะเป็นการ setState selectedCity โดยส่ง cityInfo ทั้งก้อนเข้าไปเพื่อใช้แสดงใน RightSidebar

## Known Bug

เมื่อ zoom จะเห็นว่า city overlay จะดูกระตุกไม่อยู่กับที่ หรือเวลา pan ในขณะที่ zoom เข้าอยู่ก็จะเป็นเช่นกัน คาดว่าเกิดจากการที่ camera rotate ตอน zoom แต่ยังหาสาเหตุที่แน่ชัดไม่เจอจึงยังไม่สามารถแก้ไขได้

![](https://user-images.githubusercontent.com/6850971/168818870-9b9e8916-e208-41b3-89b6-edca110a96fe.gif)
