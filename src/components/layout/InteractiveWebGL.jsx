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

    try {
      // --- 1. SETUP CORE SCENE ELEMENTS ---
      scene = new THREE.Scene();

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

      const sunLight = new THREE.DirectionalLight(0xa5b4fc, 1.0); // strong moonlight from distance
      sunLight.position.set(100, 150, -300);
      scene.add(sunLight);

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
          faceCtx.fillStyle = '#000000'; // Base non-emission
          faceCtx.fillRect(0, 0, 512, 512);
          
          // Draw bright glow outlines/panel divisions
          faceCtx.strokeStyle = '#ffffff';
          faceCtx.lineWidth = 14;
          faceCtx.strokeRect(10, 10, 492, 492); // Outer borders
          
          faceCtx.lineWidth = 8;
          drawFn(faceCtx); // Draw unique grooves
        }

        const tex = new THREE.CanvasTexture(faceCanvas);
        textures.push(tex);

        const mat = new THREE.MeshPhysicalMaterial({
          color: 0x0099ff,            // Cyan-blue glass base
          emissive: 0x00d2ff,         // Vibrant electric cyan emission
          emissiveMap: tex,
          emissiveIntensity: 3.8,     // Saturated glow
          roughness: 0.12,            // Glossy, slightly rough glass surface
          metalness: 0.1,
          transmission: 0.9,          // Refractive glass light transmission
          ior: 1.55,                  // Refractive index of glass
          thickness: 4.5,             // Thickness of refraction
          bumpMap: tex,               // Physically indent the grooves
          bumpScale: -0.06,           // Negative scale indents the lines inward
          clearcoat: 1.0,             // Clean outer lacquer layer
          clearcoatRoughness: 0.08,
          transparent: true,
          opacity: 0.96
        });
        materials.push(mat);
      });

      const centralGroup = new THREE.Group();
      const glassCube = new THREE.Mesh(glassGeo, materials);
      centralGroup.add(glassCube);

      // Local PointLight inside the cube to reflect on the ocean surface waves below
      const cubeLight = new THREE.PointLight(0x00c2ff, 25.0, 250); 
      cubeLight.position.set(0, -6, 0);
      centralGroup.add(cubeLight);

      // Position it directly on the surface of the ocean
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

      // --- 2.4 REALISTIC WAVING OCEAN (Spread wider to 1000 units for ultra-wide support) ---
      const floorWidth = 1000;
      const floorHeight = 1200;
      floorGeo = new THREE.PlaneGeometry(floorWidth, floorHeight, 180, 220); // High-density grid for silky-smooth waves
      floorMat = new THREE.MeshStandardMaterial({
        color: 0x000511, // Deep black-indigo ocean
        roughness: 0.22, // Spreads out the light reflection paths wider (glossy/wet)
        metalness: 0.8,  // Highly reflective metallic response
        flatShading: false // Smooth wave transitions
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
          u_color: { value: new THREE.Color(0x00f8ff) } 
        },
        vertexShader: `
          uniform float u_time;
          attribute vec3 randomData;
          varying float vOpacity;
          
          void main() {
            vec3 pos = position;
            float time = u_time * 1.5;
            float phase = randomData.x;
            
            // Wave heights mapping
            float swell = sin(pos.x * 0.02 + time * 0.4) * 3.2 + cos(pos.z * 0.015 + time * 0.3) * 3.2;
            float choppy = sin(pos.x * 0.08 - time * 1.2) * 1.0 + cos(pos.z * 0.06 + time * 1.0) * 1.0;
            float ripple = sin(pos.x * 0.22 + time * 2.2) * 0.25;
            
            pos.y += (swell + choppy + ripple) + randomData.y * 0.5; // Hover on wave surface
            
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
      let targetScrollZ = 0;
      let currentScrollZ = 0;

      // Maximum depth the camera can travel down the galaxy field
      const maxGalaxyDepth = -800; 

      const handleScroll = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = window.scrollY / (maxScroll || 1);
        targetScrollZ = scrollPercent * maxGalaxyDepth;
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

        // Ripple the floor grid vertices dynamically
        const posAttribute = floorGeo.attributes.position;
        const time = elapsedTime * 1.5;
        for (let i = 0; i < posAttribute.count; i++) {
          const x = posAttribute.getX(i);
          const y = posAttribute.getY(i);
          
          const swell = Math.sin(x * 0.02 + time * 0.4) * 3.2 + Math.cos(y * 0.015 + time * 0.3) * 3.2;
          const choppy = Math.sin(x * 0.08 - time * 1.2) * 1.0 + Math.cos(y * 0.06 + time * 1.0) * 1.0;
          const ripple = Math.sin(x * 0.22 + time * 2.2) * 0.25;

          posAttribute.setZ(i, swell + choppy + ripple);
        }
        floorGeo.computeVertexNormals();
        posAttribute.needsUpdate = true;

        // Update shader uniforms
        if (particleMat) {
          particleMat.uniforms.u_time.value = elapsedTime;
        }

        // Rotate and float the central cube slightly on the ocean surface waves
        if (centralGroup) {
          centralGroup.rotation.y = elapsedTime * 0.15;
          centralGroup.rotation.x = elapsedTime * 0.08;
          centralGroup.position.y = -10 + Math.sin(elapsedTime * 0.6) * 0.8;
        }

        // Rotate secondary crystals
        if (crystal1 && crystal1.mesh) {
          crystal1.mesh.rotation.y = -elapsedTime * 0.1;
          crystal1.mesh.position.y = -10 + Math.sin(elapsedTime * 0.5) * 0.5;
        }

        if (crystal2 && crystal2.mesh) {
          crystal2.mesh.rotation.x = elapsedTime * 0.12;
          crystal2.mesh.position.y = 8 + Math.cos(elapsedTime * 0.6) * 0.5;
        }

        // Linear Interpolation (Lerp) for smooth camera glide physics
        currentScrollZ += (targetScrollZ - currentScrollZ) * 0.03;
        if (camera) {
          camera.position.z = currentScrollZ;
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
          if (crystal1 && crystal1.mesh) scene.remove(crystal1.mesh);
          if (crystal2 && crystal2.mesh) scene.remove(crystal2.mesh);
          if (floorGrid) scene.remove(floorGrid);
          if (oceanParticles) scene.remove(oceanParticles);
          if (lightTarget) scene.remove(lightTarget);
        }

        if (glassGeo) glassGeo.dispose();
        if (materials) {
          materials.forEach((mat) => mat.dispose());
        }
        if (textures) {
          textures.forEach((tex) => tex.dispose());
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
