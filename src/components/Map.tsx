import { useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';

import CityIcon from './CityIcon';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const LoadingScreen = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: url('loading-background.jpeg');
  background-size: cover;
  background-repeat: no-repeat;

  transition: box-shadow 2s;

  &.fade-out {
    box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 1);

    .loader {
      display: none;
    }
  }

  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 8px solid #f3f3f3;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

const LeftSidebar = styled.div<{ isLoading: boolean }>`
  width: 30px;
  color: white;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #010a13;
  opacity: 0.6;
  padding: 15px;
  overflow: hidden;
  ${({ isLoading }) => isLoading && 'opacity: 0;'}

  .logo {
    height: 26px;
    width: 26px;
    fill: #c8aa6e;
  }
`;
type CityInfo = {
  name: string;
  slogan?: string;
  desc?: string;
  pos: { x: number; y: number; z: number };
  sideLabel?: boolean;
};
const RightSidebar = styled.div<{ city?: CityInfo }>`
  width: 275px;
  color: white;
  position: absolute;
  top: 0;
  right: -320px;
  background-color: #010a13;
  opacity: 0.6;
  padding: 15px;
  overflow: hidden;

  &.open {
    animation: open 0.5s;
    animation-direction: normal;
    top: 0;
    right: 0;
  }

  @keyframes open {
    0% {
      top: 0;
      right: -320px;
    }
    100% {
      top: 0;
      right: 0;
    }
  }

  .top-section {
    display: flex;
    align-items: center;
    .icon {
      width: 50%;
      height: 50%;
    }
    .name-info {
      font-weight: bold;
      .name {
        font-size: 25px;
      }
      .slogan {
        font-size: 8px;
      }
    }
  }
  .full-desc {
    font-size: 14px;
  }
  .closer {
    position: absolute;
    top: 5px;
    left: 10px;
    width: 25px;
    height: 25px;
    font-weight: bold;
    font-size: 25px;
  }
`;

const citiesInfo: CityInfo[] = [
  {
    name: 'demacia',
    slogan: 'PROUD MILITARY KINGDOM',
    desc: 'Demacia is a proud, lawful kingdom with a prestigious military history. Founded as a refuge from magic after the Rune Wars, some might suggest that the golden age of Demacia has passed, unless it proves able to adapt to a changing world. Self-sufficient and agrarian, its society is inherently defensive and insular, valuing justice, honor, and duty above all else.',
    pos: { x: -0.48, y: 0, z: -0.125 },
  },
  {
    name: 'freljord',
    slogan: 'HARSH FROZEN LAND',
    desc: 'The Freljord is a harsh and unforgiving land, where demi-gods walk the earth and the people are born warriors. While there are many individual tribes, the three greatest are the Avarosans, the Winter’s Claw, and the Frostguard, each uniquely shaped by their will to survive. It is also the only place on Runeterra where True Ice can be found.',
    pos: { x: -0.4, y: 0, z: -0.325 },
  },
  {
    name: 'noxus',
    slogan: 'BRUTAL EXPANSIONIST EMPIRE',
    desc: 'Noxus is a brutal, expansionist empire, yet those who look beyond its warlike exterior will find an unusually inclusive society. Anyone can rise to a position of power and respect if they display the necessary aptitude, regardless of social standing, background, or wealth. Noxians value strength above all, though that strength can manifest in many different ways.',
    pos: { x: -0.1, y: 0, z: -0.225 },
  },
  {
    name: 'ionia',
    slogan: 'THE FIRST LANDS',
    desc: 'Known as the First Lands, Ionia is an island continent of natural beauty and magic. Its inhabitants, living in loosely collected provinces, are a spiritual people, seeking harmony with the world. They remained largely neutral until their land was invaded by Noxus—this brutal occupation forced Ionia to reassess its place in the world, and its future path remains undetermined.',
    pos: { x: 0.41, y: 0, z: -0.275 },
  },
  {
    name: 'piltover-zaun',
    slogan: 'DUAL CITY-STATES',
    desc: 'Dual city-states that control the major trade routes between Valoran and Shurima. Home both to visionary inventors and their wealthy patrons, the divide between social classes is becoming more dangerous.',
    pos: { x: 0.1, y: 0, z: 0.01 },
    sideLabel: true,
  },
  {
    name: 'targon',
    slogan: 'SPRAWLING WESTERN MOUNTAINS',
    desc: 'A mountainous and sparsely inhabited region to the west of Shurima, Targon boasts the tallest peak in Runeterra. Located far from civilization, Mount Targon is all but impossible to reach, save by the most determined pilgrims, chasing some soul-deep yearning to reach its summit. Those hardy few who survive the climb return haunted and empty, or changed beyond all recognition.',
    pos: { x: -0.325, y: 0, z: 0.28 },
  },
  {
    name: 'shurima',
    slogan: 'FALLEN DESERT EMPIRE',
    desc: 'Shurima was once a thriving civilization that spanned the southern continent, left in ruins by the fall of its god-emperor. Over millennia, tales of its former glory became myth and ritual. Now, its nomadic inhabitants eke out a life in the deserts, or turn to mercenary work. Still, some dare to dream of a return to the old ways.',
    pos: { x: -0.065, y: 0, z: 0.25 },
  },
  {
    name: 'ixtal',
    slogan: 'PERILOUS EASTERN JUNGLES',
    desc: 'Secluded deep in the wilderness of eastern Shurima, the sophisticated arcology-city of Ixaocan remains mostly free of outside influence. Having witnessed from afar the ruination of the Blessed Isles, and the softening of Buhru culture, the Ixtali view the other factions of Runeterra as little more than upstarts and pretenders, and use their powerful elemental magic to keep any intruders at bay.',
    pos: { x: 0.135, y: 0, z: 0.23 },
  },
  {
    name: 'bilgewater',
    slogan: 'LAWLESS PORT CITY',
    desc: 'Bilgewater is a port city like no other—home to monster hunters, dock-gangs, indigenous peoples, and traders from across the known world. Almost anything can be purchased here, from outlawed hextech to the favor of local crime lords. There is no better place to seek fame and fortune, though death lurks in every alleyway, and the law is almost non-existent.',
    pos: { x: 0.375, y: 0, z: 0.08 },
  },
  {
    name: 'shadow-isles',
    slogan: 'LANDS SHROUDED BY THE BLACK MIST',
    desc: 'The Shadow Isles were once a beautiful realm, long since shattered by a magical cataclysm. Now, Black Mist permanently shrouds the land, tainting and corrupting with its malevolent sorcery. Those who perish within it are condemned to become part of it for all eternity… and worse still, each year the Mist extends its grasp to reap more souls across Runeterra.',
    pos: { x: 0.575, y: 0, z: 0.28 },
  },
];

const Map: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadingScreenRef = useRef<HTMLDivElement>(null);
  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const rightSidebarRef = useRef<HTMLDivElement>(null);

  const citiesRef = useRef<{ [name: string]: HTMLDivElement }>({});

  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<CityInfo>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const loadingScreen = loadingScreenRef.current;
    const leftSidebar = leftSidebarRef.current;
    const rightSidebar = rightSidebarRef.current;

    const cities = citiesRef.current;

    if (
      !canvas ||
      !loadingScreen ||
      !leftSidebar ||
      !rightSidebar ||
      Object.keys(cities).length === 0
    ) {
      return;
    }

    leftSidebar.style.height = window.innerHeight + 'px';
    rightSidebar.style.height = window.innerHeight + 'px';

    const points = citiesInfo.map((cityInfo) => ({
      position: new THREE.Vector3(
        cityInfo.pos.x,
        cityInfo.pos.y,
        cityInfo.pos.z
      ),
      element: cities[cityInfo.name],
    }));

    const scene = new THREE.Scene();

    const loadingManager = new THREE.LoadingManager(() => {
      loadingScreen.classList.add('fade-out');

      loadingScreen.addEventListener('transitionend', (e) => {
        (e?.target as any).remove();
        setLoading(false);
      });
    });

    const textureLoader = new THREE.TextureLoader(loadingManager);

    const dracoLoader = new DRACOLoader(loadingManager);
    dracoLoader.setDecoderPath('draco/');

    const gltfLoader = new GLTFLoader(loadingManager);
    gltfLoader.setDRACOLoader(dracoLoader);

    const texture = textureLoader.load('terrian.png');
    texture.flipY = false;

    const material = new THREE.MeshBasicMaterial({ map: texture });

    gltfLoader.load('my-terrian.glb', (gltf) => {
      gltf.scene.traverse((child: any) => {
        child.material = material;
      });
      scene.add(gltf.scene);
    });

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

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

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = false;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
  }, []);

  useEffect(() => {
    if (!rightSidebarRef.current) {
      return;
    }
    const rightSidebar = rightSidebarRef.current;
    if (!selectedCity) {
      rightSidebar.classList.remove('open');
    } else {
      rightSidebar.classList.add('open');
    }
  }, [selectedCity]);

  return (
    <Wrapper>
      <LoadingScreen ref={loadingScreenRef}>
        <div className="loader" />
      </LoadingScreen>

      <LeftSidebar ref={leftSidebarRef} isLoading={loading}>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://universe.leagueoflegends.com/en_US/?_gl=1*8n9kfi*_ga*MTE1ODUwMTg4NS4xNjUxMDQyNjk5*_ga_FXBJE5DEDD*MTY1MjYxOTA1My45LjAuMTY1MjYxOTA1NC41OQ..&_ga=2.175324130.1119984492.1652591127-1158501885.1651042699"
        >
          <svg
            height="200px"
            viewBox="0 0 200 200"
            width="200px"
            x="0px"
            y="0px"
            className="logo"
          >
            <path d="M82.1,34.4V0H21.4l14.3,17.9v153.6v0.2c0,0,0,0-0.1-0.1L21.4,200h135.7l21.4-28.6H82.1V34.4z"></path>
            <path d="M181.3,107.1c0,22.3-9,42.4-23.6,57.1h13.1c12.6-15.6,20.2-35.5,20.2-57.1c0-50.2-40.9-91.1-91.1-91.1 c-3.6,0-7.2,0.2-10.7,0.6v9.8c3.5-0.5,7.1-0.7,10.7-0.7C144.9,25.8,181.3,62.3,181.3,107.1z"></path>
            <path d="M35.6,171.4c0,0,0.1,0.1,0.1,0.1l0.1-0.1H35.6z"></path>
            <path d="M28.6,50.8C16.3,66.3,8.9,85.9,8.9,107.1c0,21.3,7.4,40.9,19.6,56.4V146c-6.3-11.5-9.9-24.8-9.9-38.8s3.6-27.3,9.9-38.8 V50.8z"></path>
            <path d="M28.6,84.5c-2.3,7.1-3.6,14.7-3.6,22.6s1.3,15.5,3.6,22.6V84.5z"></path>
            <path d="M175,107.1c0-14.2-4-27.4-10.8-38.7l0-0.1c0,0-0.1,0-0.1,0c-31.9-0.4-31.9,24.6-31.9,24.6c0,57.1-42.9,65.2-42.9,65.2v2.7 v3.6h59.1C164.6,150.5,175,130.1,175,107.1z"></path>
            <path d="M95.7,147c2.2-1.1,4.4-2.3,6.4-3.7c2.5-1.7,4.9-3.6,7.2-5.6c2.5-2.4,4.9-5,6.9-7.9c2.3-3.2,4.1-6.7,5.5-10.4 c1.6-4.2,2.6-8.7,3.1-13.1c0.2-2.1,0.2-4.2,0.3-6.3c0-2.1,0-4.3,0.2-6.4c0.2-2.5,0.6-5,1.2-7.4c0.7-2.9,1.7-5.7,3-8.4 c1.4-2.9,3.2-5.6,5.5-8c2.5-2.6,5.5-4.7,8.7-6.1c4-1.8,8.4-2.6,12.7-2.9c0.8,0,1.6-0.1,2.5-0.1c-0.3-0.3-0.5-0.7-0.7-1 c-13.8-16.9-34.7-27.7-58.1-27.7c-3.6,0-7.2,0.3-10.7,0.8v70.6c0,0,0,46,0,46c0-0.1,1.7-0.6,1.8-0.6 C92.6,148.4,94.2,147.7,95.7,147z"></path>
          </svg>
        </a>
      </LeftSidebar>

      {citiesInfo.map((cityInfo) => (
        <CityIcon
          key={cityInfo.name}
          label={cityInfo.name}
          icon={`/${cityInfo.name}.png`}
          hoverIcon={`/${cityInfo.name}-hover.png`}
          onClick={() => setSelectedCity(cityInfo)}
          sideLabel={cityInfo.sideLabel}
          ref={(el) => {
            if (el) {
              citiesRef.current[cityInfo.name] = el;
            }
          }}
        />
      ))}

      <canvas ref={canvasRef}></canvas>

      <RightSidebar ref={rightSidebarRef} city={selectedCity}>
        <div className="top-section">
          <div className="icon">
            <img
              src={`/${selectedCity?.name}-hover.png`}
              alt={selectedCity?.name}
            />
          </div>
          <div className="name-info">
            <div className="name">{selectedCity?.name?.toUpperCase()}</div>
            <div className="slogan">{selectedCity?.slogan?.toUpperCase()}</div>
          </div>
        </div>
        <div className="full-desc">{selectedCity?.desc}</div>
        <div
          className="closer"
          onClick={() => {
            setSelectedCity(undefined);
          }}
        >
          {'X'}
        </div>
      </RightSidebar>
    </Wrapper>
  );
};

export default Map;
