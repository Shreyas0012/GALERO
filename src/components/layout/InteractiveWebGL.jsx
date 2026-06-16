import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function InteractiveWebGL() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer, scene, camera, animationFrameId;
    let glassGeo, materials = [], textures = [];
    let crystal1, crystal2, floorGeo, floorMat, floorGrid;
    let particleGeo, particleMat, oceanParticles;
    let lightTarget;
    let auraGeos = [], auraMats = [], auras = [];
    let flowOffset = 0;
    let pillars = [], pillarGeo, pillarMat;
    let mountains = [], mountainGeo, mountainMat;
    let lightBars = [], lightBarGeo, lightBarMat;
    let moon, moonAuraGroup, stars, starGeo, starMat, moonGeo, moonMat;

    try {
       // --- 1. SETUP CORE SCENE ELEMENTS ---
       scene = new THREE.Scene();
       scene.background = new THREE.Color(0x030816);

      // Camera setup
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 0; // Start at origin

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for performance
      container.appendChild(renderer.domElement);

      // --- 2. SETUP LIGHTING ---
      const ambientLight = new THREE.AmbientLight(0x0e111a, 0.35); // soft ambient indigo night sky fill
      scene.add(ambientLight);

       const sunLight = new THREE.DirectionalLight(0xa5b4fc, 1.8); // strong moonlight from distance
       sunLight.position.set(220, 240, -850); // Aligned exactly with the large moon's position
       scene.add(sunLight);
 
       // Cyan rim light placed behind the mountains to trace their ridges in neon blue glow
       const mountainGlowLight = new THREE.DirectionalLight(0x00d2ff, 1.6);
       mountainGlowLight.position.set(0, 100, -900);
       scene.add(mountainGlowLight);

       // --- 2.1 CELESTIAL BACKGROUND (STARFIELD & MOON) ---
       // Starry Night Sky (300 twinkling stars far in the background)
       const starCount = 350;
       starGeo = new THREE.BufferGeometry();
       const starPositions = new Float32Array(starCount * 3);
       for (let i = 0; i < starCount; i++) {
         starPositions[i * 3] = (Math.random() - 0.5) * 800; // X
         starPositions[i * 3 + 1] = Math.random() * 400 + 40; // Y (high in sky)
         starPositions[i * 3 + 2] = -950 - Math.random() * 40; // Z (far back)
       }
       starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
       starMat = new THREE.PointsMaterial({
         color: 0xffffff,
         size: 1.6,
         transparent: true,
         opacity: 0.65,
         sizeAttenuation: true
       });
       stars = new THREE.Points(starGeo, starMat);
       scene.add(stars);

       // Pale Moonlight Source (The Moon - Large and Luminous)
       moonGeo = new THREE.SphereGeometry(45, 32, 32); // Increased to radius 45 for a massive, dramatic presence
       
       // High-quality procedural fallback texture map
       const moonCanvas = document.createElement('canvas');
       moonCanvas.width = 512;
       moonCanvas.height = 512;
       const moonCtx = moonCanvas.getContext('2d');
       if (moonCtx) {
         // Spherical shading base gradient
         const grad = moonCtx.createRadialGradient(256, 256, 120, 256, 256, 256);
         grad.addColorStop(0, '#ffffff'); 
         grad.addColorStop(0.85, '#e2e5ec'); 
         grad.addColorStop(1, '#a1a8b8'); 
         moonCtx.fillStyle = grad;
         moonCtx.fillRect(0, 0, 512, 512);

         // Maria spots (dark geological patches)
         moonCtx.fillStyle = 'rgba(110, 115, 128, 0.15)';
         for (let i = 0; i < 15; i++) {
           moonCtx.beginPath();
           moonCtx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 80 + 30, 0, Math.PI * 2);
           moonCtx.fill();
         }

         // Crater outlines
         for (let i = 0; i < 25; i++) {
           const cx = Math.random() * 512;
           const cy = Math.random() * 512;
           const cr = Math.random() * 12 + 3;

           moonCtx.strokeStyle = 'rgba(80, 85, 95, 0.3)';
           moonCtx.lineWidth = cr * 0.12;
           moonCtx.beginPath();
           moonCtx.arc(cx, cy, cr, Math.PI * 0.25, Math.PI * 1.25);
           moonCtx.stroke();

           moonCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
           moonCtx.lineWidth = cr * 0.12;
           moonCtx.beginPath();
           moonCtx.arc(cx, cy, cr, Math.PI * 1.25, Math.PI * 0.25);
           moonCtx.stroke();
         }
       }

       const fallbackTexture = new THREE.CanvasTexture(moonCanvas);
       moonMat = new THREE.MeshBasicMaterial({
         map: fallbackTexture
       });

       // Load high-resolution realistic moon map from GitHub remote asset in the background
       const texLoader = new THREE.TextureLoader();
       texLoader.load(
         'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg',
         (loadedTexture) => {
           if (moonMat) {
             moonMat.map = loadedTexture;
             moonMat.needsUpdate = true;
           }
         },
         undefined,
         (err) => console.log('Using procedural moon texture fallback')
       );

       moon = new THREE.Mesh(moonGeo, moonMat);
       moon.position.set(220, 240, -850); // Massive, placed high up in the canyon sky
       scene.add(moon);

       // Layered Glowing Moon Aura (Spreads luminous moonlight across the night sky)
       moonAuraGroup = new THREE.Group();
       const moonAuraSizes = [56, 85, 120, 180]; // Scaled up to match large moon
       const moonAuraOpacities = [0.45, 0.25, 0.12, 0.04];
       moonAuraSizes.forEach((r, idx) => {
         const auraGeo = new THREE.SphereGeometry(r, 16, 16);
         const auraMat = new THREE.MeshBasicMaterial({
           color: 0xa5b4fc, // Soft blue-indigo moonlight
           transparent: true,
           opacity: moonAuraOpacities[idx],
           blending: THREE.AdditiveBlending,
           side: THREE.BackSide,
           depthWrite: false
         });
         const auraMesh = new THREE.Mesh(auraGeo, auraMat);
         moonAuraGroup.add(auraMesh);
       });
       moonAuraGroup.position.copy(moon.position);
       scene.add(moonAuraGroup);

       // --- 2.2 SCENE FOG ---
       scene.fog = new THREE.FogExp2(0x030816, 0.0018);

      // --- 2.3 ADD REALISTIC GLASS CUBE WITH INDENTED GLOWING GROOVES ---
      // Define unique drawing patterns for each of the 6 cube faces to look like an asymmetric tech core
      const faceDrawings = [
        // 1. Right Face (T-junction circuit style)
        (ctx) => {
          ctx.beginPath();
          ctx.moveTo(256, 10); ctx.lineTo(256, 502);
          ctx.moveTo(256, 256); ctx.lineTo(502, 256);
          ctx.stroke();
        },
        // 2. Left Face (L-shape panel split)
        (ctx) => {
          ctx.beginPath();
          ctx.moveTo(150, 10); ctx.lineTo(150, 350);
          ctx.lineTo(502, 350);
          ctx.stroke();
        },
        // 3. Top Face (Diagonal angular cutouts)
        (ctx) => {
          ctx.beginPath();
          ctx.moveTo(10, 10); ctx.lineTo(220, 220);
          ctx.lineTo(220, 502);
          ctx.moveTo(502, 10); ctx.lineTo(350, 220);
          ctx.stroke();
        },
        // 4. Bottom Face (Centered crosshair)
        (ctx) => {
          ctx.beginPath();
          ctx.moveTo(256, 10); ctx.lineTo(256, 502);
          ctx.moveTo(10, 256); ctx.lineTo(502, 256);
          ctx.stroke();
        },
        // 5. Front Face (Main visible face - L-shape with parallel offset tech grooves)
        (ctx) => {
          ctx.beginPath();
          // Main structural L-cut
          ctx.moveTo(130, 10); ctx.lineTo(130, 380);
          ctx.lineTo(380, 380); ctx.lineTo(380, 502);
          // Parallel secondary groove
          ctx.moveTo(270, 10); ctx.lineTo(270, 260);
          ctx.lineTo(502, 260);
          ctx.stroke();
        },
        // 6. Back Face (Offset grid overlay)
        (ctx) => {
          ctx.beginPath();
          ctx.moveTo(10, 180); ctx.lineTo(502, 180);
          ctx.moveTo(220, 180); ctx.lineTo(220, 502);
          ctx.stroke();
        }
      ];

      // Build BoxGeometry and 6 unique MeshPhysicalMaterials
      glassGeo = new THREE.BoxGeometry(15, 15, 15);

      faceDrawings.forEach((drawFn) => {
        const faceCanvas = document.createElement('canvas');
        faceCanvas.width = 512;
        faceCanvas.height = 512;
        const faceCtx = faceCanvas.getContext('2d');
        
        if (faceCtx) {
          faceCtx.fillStyle = '#ffffff'; // White base (full emission/glow)
          faceCtx.fillRect(0, 0, 512, 512);
          
          // Draw dark lines (non-emission/black grooves)
          faceCtx.strokeStyle = '#000000';
          faceCtx.lineWidth = 14;
          faceCtx.strokeRect(10, 10, 492, 492); // Outer borders
          
          faceCtx.lineWidth = 8;
          drawFn(faceCtx); // Draw unique grooves
        }

        const tex = new THREE.CanvasTexture(faceCanvas);
        textures.push(tex);

        const mat = new THREE.MeshPhysicalMaterial({
          color: 0x0044ff,            // Deep cobalt blue
          emissive: 0x0099ff,         // Vibrant blue glow color
          emissiveMap: tex,           // Tells it to glow where the canvas is white
          emissiveIntensity: 6.5,     // Strong glow
          roughness: 0.1,             
          metalness: 0.1,
          transmission: 0.0,          // Not transparent
          transparent: false,         // Fully solid
          opacity: 1.0,
          bumpMap: tex,               // Keep the detailed tech grooves
          bumpScale: 0.06,            // Positive bump scale indents the dark lines
          clearcoat: 1.0,             
          clearcoatRoughness: 0.08
        });
        materials.push(mat);
      });

      const centralGroup = new THREE.Group();
      const glassCube = new THREE.Mesh(glassGeo, materials);
      centralGroup.add(glassCube);

      const isMobile = window.innerWidth < 768;

      // Create multiple layered glowing spherical shells (aura) around the cube
      // to mimic a sun corona/bloom effect.
      const auraSizes = [11, 14, 18, 24];
      const auraOpacities = isMobile ? [0.3, 0.2, 0.1, 0.03] : [0.65, 0.45, 0.22, 0.08];
      const auraColors = [0x00d2ff, 0x008cff, 0x0044ff, 0x0011ff];

      auraSizes.forEach((radius, index) => {
        const aGeo = new THREE.SphereGeometry(radius, 32, 32);
        const aMat = new THREE.MeshBasicMaterial({
          color: auraColors[index],
          transparent: true,
          opacity: auraOpacities[index],
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
          depthWrite: false
        });
        const aMesh = new THREE.Mesh(aGeo, aMat);
        centralGroup.add(aMesh);
        
        auraGeos.push(aGeo);
        auraMats.push(aMat);
        auras.push({ mesh: aMesh, baseOpacity: auraOpacities[index], index });
      });

      // Local PointLight inside the cube to reflect on the ocean surface waves below
      const cubeLight = new THREE.PointLight(0x00bfff, 45.0, 300); 
      cubeLight.position.set(0, -6, 0);
      centralGroup.add(cubeLight);

      // Position it directly on the surface of the ocean
      if (isMobile) {
        centralGroup.scale.set(0.5, 0.5, 0.5);
      }
      centralGroup.position.set(0, -10, -180);
      scene.add(centralGroup);

      // Spawn secondary floating crystals down the path (Z: -400, -650)
      const createCrystal = (size, x, y, z, colorHex) => {
        const crystalGeo = new THREE.OctahedronGeometry(size, 0);
        const crystalMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          roughness: 0.15,
          metalness: 0.85,
          flatShading: false
        });
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.position.set(x, y, z);
        scene.add(crystal);

        return { geo: crystalGeo, mat: crystalMat, mesh: crystal };
      };

      crystal1 = createCrystal(5, 22, -10, -420, 0x818cf8);
      crystal2 = createCrystal(4, -20, 8, -650, 0x38bdf8);

      // Create stationary glowing guide pillars along the margins to serve as absolute Y references
      // as the camera and water plunge down the waterfall.
      pillarGeo = new THREE.CylinderGeometry(0.1, 1.5, 75, 4); // Tall, tapered obelisks
      pillarMat = new THREE.MeshBasicMaterial({
        color: 0x0099ff,
        transparent: true,
        opacity: 0.35,
        wireframe: true
      });

      for (let i = 0; i < 6; i++) {
        const zPos = -150 - i * 150; // Spaced out along Z
        
        // Left side pillar
        const pLeft = new THREE.Mesh(pillarGeo, pillarMat);
        pLeft.position.set(-65, 0, zPos);
        scene.add(pLeft);
        pillars.push(pLeft);

        // Right side pillar
        const pRight = new THREE.Mesh(pillarGeo, pillarMat);
        pRight.position.set(65, 0, zPos);
        scene.add(pRight);
        pillars.push(pRight);
      }

      // Create organic, realistic dark mountain peaks with procedural ridge displacement
      // Using a narrower base (radius 90) and higher peak (height 360) to avoid center clipping
      mountainGeo = new THREE.ConeGeometry(90, 360, 32, 32); // High-density grid for organic details
      const mPos = mountainGeo.attributes.position;
      for (let i = 0; i < mPos.count; i++) {
        const x = mPos.getX(i);
        const y = mPos.getY(i);
        const z = mPos.getZ(i);

        // Base is at y = -180, peak is at y = 180. Height ranges over 360 units.
        const heightFactor = (y + 180) / 360; 

        // Apply fractal noise displacement on the mountain body, leaving base and tip sharp
        if (heightFactor > 0.05 && heightFactor < 0.95) {
          const angle = Math.atan2(z, x);
          const noise = Math.sin(angle * 5.0) * Math.cos(y * 0.08) * 16.0 + 
                        Math.cos(angle * 12.0) * Math.sin(y * 0.15) * 8.0 + 
                        Math.sin(angle * 2.0) * 10.0;

          // Scale displacement so it tapers off towards the base and tip
          const scale = Math.sin(heightFactor * Math.PI);
          
          mPos.setX(i, x + Math.cos(angle) * noise * scale * 0.85);
          mPos.setZ(i, z + Math.sin(angle) * noise * scale * 0.85);
        }
      }
      mountainGeo.computeVertexNormals();

      mountainMat = new THREE.MeshStandardMaterial({
        color: 0x010307,      // Ominous matte black-indigo rock
        roughness: 0.85,      // Rough rock texture
        metalness: 0.15,
        flatShading: true     // Faceted rock cliffs
      });

      // Left Peak: camera passes it on the left
      const m1 = new THREE.Mesh(mountainGeo, mountainMat);
      m1.position.set(-150, 80, -680);
      m1.scale.set(1.1, 1.1, 1.1);
      scene.add(m1);
      mountains.push(m1);

      // Right Peak: camera passes it on the right
      const m3 = new THREE.Mesh(mountainGeo, mountainMat);
      m3.position.set(150, 60, -720);
      scene.add(m3);
      mountains.push(m3);

      // Center Peak: far background mountain to look at down the path
      const m2 = new THREE.Mesh(mountainGeo, mountainMat);
      m2.position.set(0, 100, -960); 
      m2.scale.set(1.5, 1.5, 1.5);
      scene.add(m2);
      mountains.push(m2);

      // Add 4 more flanking mountains for a dense canyon silhouette
      const m4 = new THREE.Mesh(mountainGeo, mountainMat);
      m4.position.set(-280, 90, -950);
      m4.scale.set(1.3, 1.3, 1.3);
      scene.add(m4);
      mountains.push(m4);

      const m5 = new THREE.Mesh(mountainGeo, mountainMat);
      m5.position.set(280, 70, -940);
      m5.scale.set(1.2, 1.2, 1.2);
      scene.add(m5);
      mountains.push(m5);

      const m6 = new THREE.Mesh(mountainGeo, mountainMat);
      m6.position.set(-160, 60, -820);
      scene.add(m6);
      mountains.push(m6);

      const m7 = new THREE.Mesh(mountainGeo, mountainMat);
      m7.position.set(160, 50, -850);
      m7.scale.set(0.95, 0.95, 0.95);
      scene.add(m7);
      mountains.push(m7);

      // Add 6 more sideways mountains flanking the river banks closer to the camera
      const m8 = new THREE.Mesh(mountainGeo, mountainMat);
      m8.position.set(-135, 50, -380);
      m8.scale.set(0.85, 0.85, 0.85);
      scene.add(m8);
      mountains.push(m8);

      const m9 = new THREE.Mesh(mountainGeo, mountainMat);
      m9.position.set(135, 40, -420);
      m9.scale.set(0.8, 0.8, 0.8);
      scene.add(m9);
      mountains.push(m9);

      const m10 = new THREE.Mesh(mountainGeo, mountainMat);
      m10.position.set(-145, 60, -540);
      m10.scale.set(0.95, 0.95, 0.95);
      scene.add(m10);
      mountains.push(m10);

      const m11 = new THREE.Mesh(mountainGeo, mountainMat);
      m11.position.set(145, 50, -560);
      m11.scale.set(0.9, 0.9, 0.9);
      scene.add(m11);
      mountains.push(m11);

      const m12 = new THREE.Mesh(mountainGeo, mountainMat);
      m12.position.set(-120, 30, -250);
      m12.scale.set(0.7, 0.7, 0.7);
      scene.add(m12);
      mountains.push(m12);

      const m13 = new THREE.Mesh(mountainGeo, mountainMat);
      m13.position.set(120, 20, -280);
      m13.scale.set(0.65, 0.65, 0.65);
      scene.add(m13);
      mountains.push(m13);

      // --- 2.3.5 ROUTE OF LIGHT Tech Sleepers/Guides ---
      // Thin glowing horizontal bar guides along the river bed forming a runway/route of light
      lightBarGeo = new THREE.BoxGeometry(80, 0.4, 1.2);
      lightBarMat = new THREE.MeshBasicMaterial({
        color: 0x00f8ff, // Bright neon cyan
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      for (let i = 0; i < 20; i++) {
        const zPos = -150 - i * 50; // Spaced 50 units apart along Z (covers -150 to -1100)
        const bar = new THREE.Mesh(lightBarGeo, lightBarMat);
        bar.position.set(0, -22, zPos);
        scene.add(bar);
        lightBars.push(bar);
      }

      // --- 2.4 REALISTIC WAVING OCEAN (Spread wider to 1000 units for ultra-wide support) ---
      const floorWidth = 1000;
      const floorHeight = 1200;
      floorGeo = new THREE.PlaneGeometry(floorWidth, floorHeight, 180, 220); // High-density grid for silky-smooth waves
      floorMat = new THREE.MeshPhysicalMaterial({
        color: 0x000511, // Deep black-indigo ocean
        roughness: 0.12, // Slick, glossy surface
        metalness: 0.95, // Highly reflective response
        clearcoat: 1.0,  // Glossy clearcoat layer to simulate water wetness
        clearcoatRoughness: 0.08,
        flatShading: false
      });
      floorGrid = new THREE.Mesh(floorGeo, floorMat);
      floorGrid.rotation.x = -Math.PI / 2;
      floorGrid.position.set(0, -22, -500); // centered along Z-axis
      scene.add(floorGrid);

      // Spotlight pointing down from behind the cube to create a reflective path towards the camera
      lightTarget = new THREE.Object3D();
      lightTarget.position.set(0, -22, -180);
      scene.add(lightTarget);

      const moonLight = new THREE.SpotLight(0xa5b4fc, 8.0, 800, Math.PI / 8, 0.5, 0.8);
      moonLight.position.set(0, 150, -450);
      moonLight.target = lightTarget;
      scene.add(moonLight);

      // --- 2.6 OCEAN GLOWING PARTICLES (GPU Waving, spread wider to match the floor) ---
      const particleCount = 1200; 
      particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const randomData = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        // Cluster particles closer to center (X = 0) to align with reflection path, but allow wider distribution
        const randNorm = Math.pow(Math.random() - 0.5, 3) * 2.0; 
        const x = randNorm * floorWidth;
        const z = -Math.random() * floorHeight;
        const y = -22; // ocean floor baseline
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        randomData[i * 3] = Math.random() * 100.0; // phase offset
        randomData[i * 3 + 1] = Math.random() * 2.5 + 0.5; // height factor
        randomData[i * 3 + 2] = Math.random(); // size factor
      }
      
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('randomData', new THREE.BufferAttribute(randomData, 3));
      
      particleMat = new THREE.ShaderMaterial({
        uniforms: {
          u_time: { value: 0 },
          u_flowOffset: { value: 0 },
          u_fallEase: { value: 0 },
          u_color: { value: new THREE.Color(0x00f8ff) } 
        },
        vertexShader: `
          uniform float u_time;
          uniform float u_flowOffset;
          uniform float u_fallEase;
          attribute vec3 randomData;
          varying float vOpacity;
          
          void main() {
            vec3 pos = position;
            float time = u_time * 1.5;
            float phase = randomData.x;
            
            // Downstream flowing coordinate
            float zFlow = pos.z + u_flowOffset;
            
            // Wave heights mapping
            float swell = sin(pos.x * 0.02 + time * 0.4) * 3.2 + cos(zFlow * 0.015 + time * 0.3) * 3.2;
            float choppy = sin(pos.x * 0.08 - time * 1.2) * 1.0 + cos(zFlow * 0.06 + time * 1.0) * 1.0;
            float ripple = sin(pos.x * 0.22 + time * 2.2) * 0.25;
            
            // Waterfall bend: bend particles down dynamically based on fall ease factor
            float waterfallBend = 0.0;
            if (pos.z < -450.0) {
              float dist = pos.z + 450.0;
              waterfallBend = dist * dist * -0.0018 * u_fallEase;
            }
            
            pos.y += (swell + choppy + ripple) + randomData.y * 0.5 + waterfallBend;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            gl_PointSize = (randomData.z * 4.5 + 1.5) * (300.0 / -mvPosition.z);
            vOpacity = 0.15 + 0.45 * sin(u_time * 3.0 + phase); 
          }
        `,
        fragmentShader: `
          uniform vec3 u_color;
          varying float vOpacity;
          void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
            gl_FragColor = vec4(u_color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      oceanParticles = new THREE.Points(particleGeo, particleMat);
      scene.add(oceanParticles);

      // --- 3. SCROLL HANDLING & INTERACTION ---
      let targetScrollPercent = 0;
      let currentScrollPercent = 0;
      let targetScrollZ = 0;
      let currentScrollZ = 0;

      // Maximum depth the camera can travel down the galaxy field
      const maxGalaxyDepth = -800; 

      const handleScroll = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetScrollPercent = window.scrollY / (maxScroll || 1);
        targetScrollZ = targetScrollPercent * maxGalaxyDepth;
      };
      window.addEventListener('scroll', handleScroll);

      // --- 4. RESPONSIVE WINDOW RESIZING ---
      const handleResize = () => {
        if (camera && renderer) {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }
      };
      window.addEventListener('resize', handleResize);

      // --- 5. ANIMATION LOOP ---
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();

        // Linear Interpolation (Lerp) for smooth scroll percentages
        currentScrollPercent += (targetScrollPercent - currentScrollPercent) * 0.03;

        // Two-phase camera control based on remapped scroll progress:
        const progress = currentScrollPercent;
        let dropProgress = 0.0;
        let cameraZ = 0.0;
        let cameraY = 0.0;
        let shake = 0.0;
        let fovOffset = 0.0;
        let fogDensity = 0.0018;

        if (progress < 0.5) {
          // Phase 1: Intro phase (0% to 50% scroll) - stable centered camera, subtle forward Z drift
          cameraZ = (progress / 0.5) * -180.0; // Subtle Z drift
          cameraY = Math.sin(elapsedTime * 0.35) * 0.4; // Organic floating drift
        } else {
          // Phase 2: Descent phase (50% to 100% scroll) - fall down the waterfall
          dropProgress = (progress - 0.5) / 0.5;
          const dropEase = Math.pow(dropProgress, 2.5); // Ease-in plunge

          cameraZ = -180.0 - (dropEase * 620.0); // Smooth Z translation forward
          
          // Calculate camera Y height dynamically based on the water physical bend curve at cameraZ
          let waterfallBendAtCamera = 0.0;
          if (cameraZ < -450.0) {
            const camDist = cameraZ + 450.0;
            waterfallBendAtCamera = camDist * camDist * -0.0018; // Physically aligned descent
          }
          cameraY = waterfallBendAtCamera;

          // Camera shake at the beginning of the fall (decaying after 25% of descent)
          if (dropProgress < 0.25) {
            const shakeFactor = Math.max(0, 1.0 - (dropProgress / 0.25));
            shake = Math.sin(elapsedTime * 48.0) * 0.38 * shakeFactor;
          }

          // Widen FOV by up to 14 degrees for speed immersion
          fovOffset = dropEase * 14.0;

          // Increase fog density for volumetric depth in the canyon
          fogDensity = 0.0018 + (dropEase * 0.0032);
        }

        const fallEase = Math.pow(dropProgress, 2.5);

        // Dynamic downstream current flow: pick up speed as we plunge
        const baseFlowSpeed = 12.0;
        const flowSpeed = baseFlowSpeed + (fallEase * 85.0); // accelerates up to ~100 units/sec!
        flowOffset += 0.016 * flowSpeed; // integrate flow offset over time (approx 60fps)

        // Update shader uniforms
        if (particleMat) {
          particleMat.uniforms.u_time.value = elapsedTime;
          particleMat.uniforms.u_flowOffset.value = flowOffset;
          particleMat.uniforms.u_fallEase.value = fallEase;
        }

        // Ripple the floor grid vertices dynamically + apply downstream flow and waterfall bend
        const posAttribute = floorGeo.attributes.position;
        const time = elapsedTime * 1.5;
        for (let i = 0; i < posAttribute.count; i++) {
          const x = posAttribute.getX(i);
          const y = posAttribute.getY(i); // represents Z in world space
          
          // Downstream flowing coordinate
          const flowY = y + flowOffset;
          
          // Wave heights mapping
          const swell = Math.sin(x * 0.02 + time * 0.4) * 3.2 + Math.cos(flowY * 0.015 + time * 0.3) * 3.2;
          const choppy = Math.sin(x * 0.08 - time * 1.2) * 1.0 + Math.cos(flowY * 0.06 + time * 1.0) * 1.0;
          const ripple = Math.sin(x * 0.22 + time * 2.2) * 0.25;

          // Waterfall bend: bend grid down dynamically based on scroll fallEase starting at world Z = -450 (local y = -50.0)
          let waterfallBend = 0.0;
          if (y > -50.0) {
            const dist = -50.0 - y;
            waterfallBend = dist * dist * -0.0018 * fallEase; // bend downwards in Z (world height)
          }

          posAttribute.setZ(i, swell + choppy + ripple + waterfallBend);
        }
        floorGeo.computeVertexNormals();
        posAttribute.needsUpdate = true;

        // Keep the base positions of floor grid and particles stationary (upstream river stays high)
        if (floorGrid) {
          floorGrid.position.y = -22.0;
        }
        if (oceanParticles) {
          oceanParticles.position.y = 0.0;
        }
        if (lightTarget) {
          lightTarget.position.y = -22.0;
        }

        // Calculate exact wave height at the center (X = 0, Z = -180) to float the cube on
        const swellCenter = Math.sin(time * 0.4) * 3.2 + Math.cos((320 + flowOffset) * 0.015 + time * 0.3) * 3.2;
        const choppyCenter = Math.sin(-time * 1.2) * 1.0 + Math.cos((320 + flowOffset) * 0.06 + time * 1.0) * 1.0;
        const rippleCenter = Math.sin(time * 2.2) * 0.25;
        const localWaveHeight = swellCenter + choppyCenter + rippleCenter;
        
        // Read dynamic floor grid position
        const waterY = (floorGrid ? floorGrid.position.y : -22.0) + localWaveHeight;

        // Rotate and float the central cube dynamically on the actual water wave height
        if (centralGroup) {
          centralGroup.rotation.y = elapsedTime * 0.15;
          centralGroup.rotation.x = elapsedTime * 0.08;
          // Levitating cleanly above the wave peaks so it never clips or immerses in the water
          centralGroup.position.y = waterY + (isMobile ? 22.0 : 28.0); 
        }

        // Pulse the glowing auras to make it feel alive and sun-like
        auras.forEach(a => {
          if (a.mesh && a.mesh.material) {
            // Pulse opacity slightly
            const pulse = Math.sin(elapsedTime * 1.5 + a.index) * 0.05;
            a.mesh.material.opacity = Math.max(0.01, a.baseOpacity + pulse);
            // Pulse scale slightly
            const scalePulse = 1.0 + Math.sin(elapsedTime * 0.8 + a.index) * 0.03;
            a.mesh.scale.set(scalePulse, scalePulse, scalePulse);
          }
        });

        // Rotate secondary crystals
        if (crystal1 && crystal1.mesh) {
          crystal1.mesh.rotation.y = -elapsedTime * 0.1;
          crystal1.mesh.position.y = -10 + Math.sin(elapsedTime * 0.5) * 0.5;
        }

        if (crystal2 && crystal2.mesh) {
          crystal2.mesh.rotation.x = elapsedTime * 0.12;
          crystal2.mesh.position.y = 8 + Math.cos(elapsedTime * 0.6) * 0.5;
        }

        // Update tech light bars along the route of light to follow the waterfall bend
        if (lightBars) {
          lightBars.forEach((bar) => {
            const z = bar.position.z;
            let waterfallBend = 0.0;
            if (z < -450.0) {
              const dist = z + 450.0;
              waterfallBend = dist * dist * -0.0018 * fallEase; // matches waterfall curve
            }
            bar.position.y = -22.0 + waterfallBend;

            // Downstream light wave ripple effect
            const travelOffset = Math.abs((z - flowOffset * 2.0) % 200.0);
            const pulse = Math.sin(travelOffset * 0.04) * 0.4 + 0.6;
            if (bar.material) {
              bar.material.opacity = Math.max(0.15, pulse * 0.85);
            }
          });
        }

        // Apply smooth camera glide physics (Z translation + vertical waterfall plunge)
        if (camera) {
          camera.position.z = cameraZ;
          camera.position.y = cameraY;
          camera.position.x = shake;

          // Apply dynamic FOV widening
          camera.fov = 60 + fovOffset;
          camera.updateProjectionMatrix();

          // Camera looks down/forward along the descent path
          const lookAtTargetZ = cameraZ - 200.0;
          let waterfallBendAtLookAt = 0.0;
          if (lookAtTargetZ < -450.0) {
            const lookAtDist = lookAtTargetZ + 450.0;
            waterfallBendAtLookAt = lookAtDist * lookAtDist * -0.0018 * fallEase;
          }
          const lookAtTargetY = -22.0 + waterfallBendAtLookAt + 12.0; // Point slightly higher to raise camera angle and make text clearly visible
          camera.lookAt(new THREE.Vector3(0, lookAtTargetY, lookAtTargetZ));
        }

        if (scene) {
          if (scene.fog) {
            scene.fog.density = fogDensity;
            scene.fog.color.lerpColors(new THREE.Color(0x030816), new THREE.Color(0x000103), fallEase);
          }
          if (scene.background) {
            scene.background.lerpColors(new THREE.Color(0x030816), new THREE.Color(0x000103), fallEase);
          }
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      // Fire up the loop
      animate();

      // Cleanup registration
      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        if (renderer && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        
        // Clean up meshes, geometries, and materials
        if (scene) {
          if (centralGroup) {
            scene.remove(centralGroup);
          }
          if (lightBars) {
            lightBars.forEach((bar) => scene.remove(bar));
          }
          if (crystal1 && crystal1.mesh) scene.remove(crystal1.mesh);
          if (crystal2 && crystal2.mesh) scene.remove(crystal2.mesh);
          if (floorGrid) scene.remove(floorGrid);
          if (oceanParticles) scene.remove(oceanParticles);
          if (lightTarget) scene.remove(lightTarget);
          if (moon) scene.remove(moon);
          if (moonAuraGroup) scene.remove(moonAuraGroup);
          if (stars) scene.remove(stars);
          if (pillars) {
            pillars.forEach((p) => scene.remove(p));
          }
          if (mountains) {
            mountains.forEach((m) => scene.remove(m));
          }
        }

        if (glassGeo) glassGeo.dispose();
        if (materials) {
          materials.forEach((mat) => mat.dispose());
        }
        if (textures) {
          textures.forEach((tex) => tex.dispose());
        }
        if (pillarGeo) pillarGeo.dispose();
        if (pillarMat) pillarMat.dispose();
        if (mountainGeo) mountainGeo.dispose();
        if (mountainMat) mountainMat.dispose();
        if (lightBarGeo) lightBarGeo.dispose();
        if (lightBarMat) lightBarMat.dispose();
        if (moonGeo) moonGeo.dispose();
        if (moonMat) moonMat.dispose();
        if (starGeo) starGeo.dispose();
        if (starMat) starMat.dispose();
        if (auraGeos) {
          auraGeos.forEach((geo) => geo.dispose());
        }
        if (auraMats) {
          auraMats.forEach((mat) => mat.dispose());
        }

        if (crystal1) {
          if (crystal1.geo) crystal1.geo.dispose();
          if (crystal1.mat) crystal1.mat.dispose();
        }
        if (crystal2) {
          if (crystal2.geo) crystal2.geo.dispose();
          if (crystal2.mat) crystal2.mat.dispose();
        }

        if (floorGeo) floorGeo.dispose();
        if (floorMat) floorMat.dispose();

        if (particleGeo) particleGeo.dispose();
        if (particleMat) particleMat.dispose();
      };
    } catch (e) {
      console.error("WebGL Initialization failed: ", e);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, // Keep behind content
        background: 'radial-gradient(circle at 50% 70%, #00f0ff -20%, #05337c 35%, #010410 80%, #000000 100%)',
        pointerEvents: 'none'
      }}
    />
  );
}
