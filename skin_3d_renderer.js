/**
 * KBLauncher - 3D Minecraft Skin & Cape WebGL Renderer
 * Renders authentic Minecraft skins with exact pixel-perfect UV mapping,
 * correct body proportions, slender camera perspective, authentic cape physics,
 * and full support for both Classic (4px) and Slim/Alex (3px) 64x64 / 64x32 models.
 */

class MinecraftSkin3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: true }) ||
              canvas.getContext('experimental-webgl', { alpha: true, antialias: false, depth: true });

    if (!this.gl) {
      console.warn('WebGL not supported for 3D skin viewer.');
      return;
    }

    this.skinTexture = null;
    this.capeTexture = null;
    this.currentSkinUrl = 'assets/kbl-skin.png';
    this.currentCapeUrl = 'assets/cape-founder.png';
    this.showCape = true;

    this.isSlim = false;
    this.is64x64 = false;

    // View & Camera parameters (Slender Minecraft perspective)
    this.rotY = 0.42; // Yaw (comfortable 3/4 front view)
    this.rotX = 0.08; // Pitch
    this.defaultZoom = 66.0;
    this.zoom = 66.0; // Distance matched to FOV 26 for orthographic-like proportions
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.animating = true;
    this.animTime = 0;

    // Geometry buffers
    this.buffers = {};
    this.capeMesh = null;

    this.initGL();
    this.capeMesh = this.buildCapeMesh(10, 16, 1);
    this.initGeometry(this.isSlim, this.is64x64);
    this.initEvents();
    this.loadSkin(this.currentSkinUrl, false);
    this.loadCape(this.currentCapeUrl);

    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);
  }

  initGL() {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const vsSource = `
      attribute vec3 aPosition;
      attribute vec2 aTexCoord;
      attribute vec3 aNormal;

      uniform mat4 uProjectionMatrix;
      uniform mat4 uModelViewMatrix;
      uniform mat3 uNormalMatrix;

      varying vec2 vTexCoord;
      varying float vLight;

      void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
        vTexCoord = aTexCoord;

        vec3 normal = normalize(uNormalMatrix * aNormal);
        // Soft directional light from upper front-right
        vec3 lightDir = normalize(vec3(0.3, 0.8, 0.55));
        float diff = max(dot(normal, lightDir), 0.0);
        vLight = 0.68 + 0.32 * diff;
      }
    `;

    const fsSource = `
      precision mediump float;

      varying vec2 vTexCoord;
      varying float vLight;

      uniform sampler2D uSampler;

      void main(void) {
        vec4 texColor = texture2D(uSampler, vTexCoord);
        if (texColor.a < 0.1) {
          discard;
        }
        gl_FragColor = vec4(texColor.rgb * vLight, texColor.a);
      }
    `;

    const vs = this.compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader link error:', gl.getProgramInfoLog(program));
      return;
    }

    this.program = program;
    this.attribs = {
      position: gl.getAttribLocation(program, 'aPosition'),
      texCoord: gl.getAttribLocation(program, 'aTexCoord'),
      normal: gl.getAttribLocation(program, 'aNormal')
    };
    this.uniforms = {
      projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(program, 'uNormalMatrix'),
      sampler: gl.getUniformLocation(program, 'uSampler')
    };
  }

  compileShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  /**
   * Cleans up GPU buffers to prevent memory leaks during skin switches
   */
  cleanBuffers() {
    const gl = this.gl;
    if (!gl) return;
    for (let key in this.buffers) {
      if (this.buffers[key]) {
        if (this.buffers[key].pos) gl.deleteBuffer(this.buffers[key].pos);
        if (this.buffers[key].norm) gl.deleteBuffer(this.buffers[key].norm);
        if (this.buffers[key].uv) gl.deleteBuffer(this.buffers[key].uv);
      }
    }
    this.buffers = {};
  }

  /**
   * Builds a Minecraft 3D Box.
   * Separates physical 3D dimensions (w, h, d) from texture UV dimensions (tw, th, td)
   * to guarantee that expanded overlay meshes (like hat 8.5) never sample out-of-bounds pixels!
   */
  buildBoxMesh(w, h, d, u, v, mirror = false, texW = 64, texH = 32, tw = null, th = null, td = null) {
    const gl = this.gl;
    const x0 = -w / 2, x1 = w / 2;
    const y0 = -h / 2, y1 = h / 2;
    const z0 = -d / 2, z1 = d / 2;

    const uvW = tw !== null ? tw : w;
    const uvH = th !== null ? th : h;
    const uvD = td !== null ? td : d;

    const positions = [];
    const normals = [];
    const uvs = [];

    const addFace = (p, n, uv) => {
      const indices = [0, 1, 2, 0, 2, 3];
      for (let i of indices) {
        positions.push(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]);
        normals.push(n[0], n[1], n[2]);
        uvs.push(uv[i * 2], uv[i * 2 + 1]);
      }
    };

    // Calculate exact UV integer coordinate bounds
    let uRight0 = u, uRight1 = u + uvD;
    let uFront0 = u + uvD, uFront1 = u + uvD + uvW;
    let uLeft0 = u + uvD + uvW, uLeft1 = u + 2 * uvD + uvW;
    let uBack0 = u + 2 * uvD + uvW, uBack1 = u + 2 * uvD + 2 * uvW;

    if (mirror) {
      let temp = uRight0; uRight0 = uLeft1; uLeft1 = temp;
      temp = uRight1; uRight1 = uLeft0; uLeft0 = temp;
      let f0 = uFront1, f1 = uFront0; uFront0 = f0; uFront1 = f1;
      let b0 = uBack1, b1 = uBack0; uBack0 = b0; uBack1 = b1;
    }

    const vSide0 = (v + uvD) / texH, vSide1 = (v + uvD + uvH) / texH;
    const vTop0 = v / texH, vTop1 = (v + uvD) / texH;

    // 1. Front (+Z)
    addFace(
      [x0, y1, z1,  x0, y0, z1,  x1, y0, z1,  x1, y1, z1],
      [0, 0, 1],
      [uFront0 / texW, vSide0,  uFront0 / texW, vSide1,  uFront1 / texW, vSide1,  uFront1 / texW, vSide0]
    );

    // 2. Back (-Z)
    addFace(
      [x1, y1, z0,  x1, y0, z0,  x0, y0, z0,  x0, y1, z0],
      [0, 0, -1],
      [uBack0 / texW, vSide0,  uBack0 / texW, vSide1,  uBack1 / texW, vSide1,  uBack1 / texW, vSide0]
    );

    // 3. Top (+Y)
    addFace(
      [x0, y1, z0,  x0, y1, z1,  x1, y1, z1,  x1, y1, z0],
      [0, 1, 0],
      [(u + uvD) / texW, vTop0,  (u + uvD) / texW, vTop1,  (u + uvD + uvW) / texW, vTop1,  (u + uvD + uvW) / texW, vTop0]
    );

    // 4. Bottom (-Y)
    addFace(
      [x0, y0, z1,  x0, y0, z0,  x1, y0, z0,  x1, y0, z1],
      [0, -1, 0],
      [(u + uvD + uvW) / texW, vTop0,  (u + uvD + uvW) / texW, vTop1,  (u + 2 * uvD + uvW) / texW, vTop1,  (u + 2 * uvD + uvW) / texW, vTop0]
    );

    // 5. Left/Outer Face in +X direction
    addFace(
      [x1, y1, z1,  x1, y0, z1,  x1, y0, z0,  x1, y1, z0],
      [1, 0, 0],
      [uLeft0 / texW, vSide0,  uLeft0 / texW, vSide1,  uLeft1 / texW, vSide1,  uLeft1 / texW, vSide0]
    );

    // 6. Right/Inner Face in -X direction
    addFace(
      [x0, y1, z0,  x0, y0, z0,  x0, y0, z1,  x0, y1, z1],
      [-1, 0, 0],
      [uRight0 / texW, vSide0,  uRight0 / texW, vSide1,  uRight1 / texW, vSide1,  uRight1 / texW, vSide0]
    );

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const normBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    const uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

    return { pos: posBuf, norm: normBuf, uv: uvBuf, count: positions.length / 3 };
  }

  /**
   * Dedicated Cape Mesh with top-front anchor at (0, 0, 0).
   * Cape hangs down (y: 0 to -h) and extends slightly backward (z: 0 to -d).
   */
  buildCapeMesh(w = 10, h = 16, d = 1) {
    const gl = this.gl;
    const x0 = -w / 2, x1 = w / 2;
    const y0 = -h, y1 = 0;
    const z0 = -d, z1 = 0;

    const positions = [];
    const normals = [];
    const uvs = [];

    const addFace = (p, n, uv) => {
      const indices = [0, 1, 2, 0, 2, 3];
      for (let i of indices) {
        positions.push(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]);
        normals.push(n[0], n[1], n[2]);
        uvs.push(uv[i * 2], uv[i * 2 + 1]);
      }
    };

    const texW = 64, texH = 32;

    // 1. Front (+Z, facing player's back)
    addFace(
      [x0, y1, z1,  x0, y0, z1,  x1, y0, z1,  x1, y1, z1],
      [0, 0, 1],
      [1 / texW, 1 / texH,  1 / texW, 17 / texH,  11 / texW, 17 / texH,  11 / texW, 1 / texH]
    );

    // 2. Back (-Z, visible from behind player)
    addFace(
      [x1, y1, z0,  x1, y0, z0,  x0, y0, z0,  x0, y1, z0],
      [0, 0, -1],
      [12 / texW, 1 / texH,  12 / texW, 17 / texH,  22 / texW, 17 / texH,  22 / texW, 1 / texH]
    );

    // 3. Top (+Y)
    addFace(
      [x0, y1, z0,  x0, y1, z1,  x1, y1, z1,  x1, y1, z0],
      [0, 1, 0],
      [1 / texW, 0 / texH,  1 / texW, 1 / texH,  11 / texW, 1 / texH,  11 / texW, 0 / texH]
    );

    // 4. Bottom (-Y)
    addFace(
      [x0, y0, z1,  x0, y0, z0,  x1, y0, z0,  x1, y0, z1],
      [0, -1, 0],
      [11 / texW, 0 / texH,  11 / texW, 1 / texH,  21 / texW, 1 / texH,  21 / texW, 0 / texH]
    );

    // 5. Right (+X)
    addFace(
      [x1, y1, z1,  x1, y0, z1,  x1, y0, z0,  x1, y1, z0],
      [1, 0, 0],
      [11 / texW, 1 / texH,  11 / texW, 17 / texH,  12 / texW, 17 / texH,  12 / texW, 1 / texH]
    );

    // 6. Left (-X)
    addFace(
      [x0, y1, z0,  x0, y0, z0,  x0, y0, z1,  x0, y1, z1],
      [-1, 0, 0],
      [0 / texW, 1 / texH,  0 / texW, 17 / texH,  1 / texW, 17 / texH,  1 / texW, 1 / texH]
    );

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const normBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    const uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

    return { pos: posBuf, norm: normBuf, uv: uvBuf, count: positions.length / 3 };
  }

  /**
   * Initializes or rebuilds body geometry depending on Classic (4px) vs Alex (3px)
   * and 64x32 vs 64x64 texture formats.
   */
  initGeometry(isSlim = false, is64 = false) {
    this.cleanBuffers();

    const texH = is64 ? 64 : 32;
    const texW = 64;
    const armW = isSlim ? 3 : 4;

    // 1. Head (8x8x8, u=0, v=0)
    this.buffers.head = this.buildBoxMesh(8, 8, 8, 0, 0, false, texW, texH, 8, 8, 8);

    // 2. Hat Layer (3D size 8.5, UV dimensions STRICTLY 8x8x8 from u=32, v=0)
    // Guarantees zero pixel bleeding into row 16-17!
    this.buffers.hat = this.buildBoxMesh(8.5, 8.5, 8.5, 32, 0, false, texW, texH, 8, 8, 8);

    // 3. Torso (8x12x4, u=16, v=16)
    this.buffers.torso = this.buildBoxMesh(8, 12, 4, 16, 16, false, texW, texH, 8, 12, 4);

    // 4. Right Arm (armW x 12 x 4, u=40, v=16)
    this.buffers.rightArm = this.buildBoxMesh(armW, 12, 4, 40, 16, false, texW, texH, armW, 12, 4);

    // 5. Right Leg (4x12x4, u=0, v=16)
    this.buffers.rightLeg = this.buildBoxMesh(4, 12, 4, 0, 16, false, texW, texH, 4, 12, 4);

    if (is64) {
      // 64x64 Modern 1.8+ format: Dedicated non-mirrored Left Arm and Left Leg textures
      // 6. Left Arm (armW x 12 x 4, u=32, v=48)
      this.buffers.leftArm = this.buildBoxMesh(armW, 12, 4, 32, 48, false, texW, texH, armW, 12, 4);

      // 7. Left Leg (4x12x4, u=16, v=48)
      this.buffers.leftLeg = this.buildBoxMesh(4, 12, 4, 16, 48, false, texW, texH, 4, 12, 4);

      // 8. 64x64 Outer Overlays (Jacket, Sleeves, Pants)
      this.buffers.jacket = this.buildBoxMesh(8.5, 12.5, 4.5, 16, 32, false, texW, texH, 8, 12, 4);
      this.buffers.rightSleeve = this.buildBoxMesh(armW + 0.5, 12.5, 4.5, 40, 32, false, texW, texH, armW, 12, 4);
      this.buffers.leftSleeve = this.buildBoxMesh(armW + 0.5, 12.5, 4.5, 48, 48, false, texW, texH, armW, 12, 4);
      this.buffers.rightPants = this.buildBoxMesh(4.5, 12.5, 4.5, 0, 32, false, texW, texH, 4, 12, 4);
      this.buffers.leftPants = this.buildBoxMesh(4.5, 12.5, 4.5, 0, 48, false, texW, texH, 4, 12, 4);
    } else {
      // 64x32 Classic format: Mirrored Left Arm and Left Leg from Right limbs
      this.buffers.leftArm = this.buildBoxMesh(4, 12, 4, 40, 16, true, texW, texH, 4, 12, 4);
      this.buffers.leftLeg = this.buildBoxMesh(4, 12, 4, 0, 16, true, texW, texH, 4, 12, 4);
    }
  }

  /**
   * Helper to detect slim (3px arm) model in 64x64 skins.
   * If columns 54-55 in rows 20-31 are transparent, it is a 3px slim arm model!
   */
  detectSlimSkin(img) {
    try {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(54, 20, 2, 12).data;
      let hasAlpha = false;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 10) {
          hasAlpha = true;
          break;
        }
      }
      return !hasAlpha;
    } catch (e) {
      return false;
    }
  }

  loadSkin(url, isSlim = null) {
    const gl = this.gl;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      // Pixel-art nearest-neighbor filter (sharp Minecraft pixels)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      if (this.skinTexture) gl.deleteTexture(this.skinTexture);
      this.skinTexture = tex;
      this.currentSkinUrl = url;

      const is64 = (img.height === 64);
      let slim = false;
      if (isSlim !== null) {
        slim = !!isSlim;
      } else if (is64) {
        slim = this.detectSlimSkin(img);
      }
      this.isSlim = slim;
      this.is64x64 = is64;
      this.initGeometry(this.isSlim, this.is64x64);
    };
    img.src = url;
  }

  loadCape(url) {
    if (!url || url === 'none') {
      this.showCape = false;
      return;
    }
    const gl = this.gl;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      if (this.capeTexture) gl.deleteTexture(this.capeTexture);
      this.capeTexture = tex;
      this.currentCapeUrl = url;
      this.showCape = true;
    };
    img.src = url;
  }

  initEvents() {
    const canvas = this.canvas;
    canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.rotY += dx * 0.012;
      this.rotX += dy * 0.01;
      this.rotX = Math.max(-0.65, Math.min(0.65, this.rotX));
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.zoom += e.deltaY * 0.05;
      this.zoom = Math.max(45.0, Math.min(95.0, this.zoom));
    }, { passive: false });
  }

  drawMesh(mesh, matrix, texture) {
    if (!mesh || !mesh.pos) return;
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.pos);
    gl.vertexAttribPointer(this.attribs.position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.attribs.position);

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uv);
    gl.vertexAttribPointer(this.attribs.texCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.attribs.texCoord);

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.norm);
    gl.vertexAttribPointer(this.attribs.normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.attribs.normal);

    gl.uniformMatrix4fv(this.uniforms.modelViewMatrix, false, matrix);

    const normMat = [
      matrix[0], matrix[1], matrix[2],
      matrix[4], matrix[5], matrix[6],
      matrix[8], matrix[9], matrix[10]
    ];
    gl.uniformMatrix3fv(this.uniforms.normalMatrix, false, new Float32Array(normMat));

    gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
  }

  render() {
    const gl = this.gl;
    if (!gl || !this.program || !this.skinTexture) {
      requestAnimationFrame(this.render);
      return;
    }

    // Dynamic resolution matching: prevents horizontal squashing or stretching
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayW = Math.round(rect.width * dpr);
    const displayH = Math.round(rect.height * dpr);

    if (displayW > 0 && displayH > 0 && (this.canvas.width !== displayW || this.canvas.height !== displayH)) {
      this.canvas.width = displayW;
      this.canvas.height = displayH;
    }

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.program);

    if (this.animating && !this.isDragging) {
      this.animTime += 0.032;
      this.rotY += 0.004; // Smooth ambient rotation
    }

    // Walking animation angles
    const armSwing = Math.sin(this.animTime) * 0.38;
    const legSwing = Math.cos(this.animTime) * 0.38;
    const headBob = Math.sin(this.animTime * 2.0) * 0.25;

    // Cape flutter angle (always flutters backward behind the player)
    const capeAngle = 0.12 + Math.abs(Math.sin(this.animTime)) * 0.22;

    // Slender perspective projection matrix (FOV 26° eliminates wide-angle distortion)
    const aspect = this.canvas.width / this.canvas.height;
    const pMat = Mat4.perspective(26, aspect, 0.1, 300.0);
    gl.uniformMatrix4fv(this.uniforms.projectionMatrix, false, pMat);

    // Global ModelView Matrix
    let baseMat = Mat4.identity();
    baseMat = Mat4.translate(baseMat, 0, 0, -this.zoom);
    baseMat = Mat4.rotateX(baseMat, this.rotX);
    baseMat = Mat4.rotateY(baseMat, this.rotY);
    // Center character vertically
    baseMat = Mat4.translate(baseMat, 0, -2.4, 0);

    // Dynamic shoulder placement:
    // Torso width is 8.0 (from -4 to +4).
    // Classic arm is width 4.0: center is at +/- 6.0 (offset 5.95)
    // Slim arm is width 3.0: center is at +/- 5.5 (offset 5.45)
    const armPivotX = this.isSlim ? 5.45 : 5.95;

    // 1. Torso (centered at y=2, height 12: spans y in [-4, +8], z in [-2, +2])
    let torsoMat = Mat4.translate(baseMat, 0, 2.0, 0);
    this.drawMesh(this.buffers.torso, torsoMat, this.skinTexture);
    if (this.buffers.jacket) {
      this.drawMesh(this.buffers.jacket, torsoMat, this.skinTexture);
    }

    // 2. Head & Hat (neck pivot at y=8.0)
    let headMat = Mat4.translate(baseMat, 0, 8.0 + headBob, 0);
    headMat = Mat4.translate(headMat, 0, 4.0, 0); // Center head box
    this.drawMesh(this.buffers.head, headMat, this.skinTexture);
    this.drawMesh(this.buffers.hat, headMat, this.skinTexture);

    // 3. Right Arm (shoulder pivot at x=-armPivotX, y=7.5 flush with torso)
    let rArmMat = Mat4.translate(baseMat, -armPivotX, 7.5, 0);
    rArmMat = Mat4.rotateX(rArmMat, -armSwing);
    rArmMat = Mat4.translate(rArmMat, 0, -5.5, 0);
    this.drawMesh(this.buffers.rightArm, rArmMat, this.skinTexture);
    if (this.buffers.rightSleeve) {
      this.drawMesh(this.buffers.rightSleeve, rArmMat, this.skinTexture);
    }

    // 4. Left Arm (shoulder pivot at x=+armPivotX, y=7.5 flush with torso)
    let lArmMat = Mat4.translate(baseMat, armPivotX, 7.5, 0);
    lArmMat = Mat4.rotateX(lArmMat, armSwing);
    lArmMat = Mat4.translate(lArmMat, 0, -5.5, 0);
    this.drawMesh(this.buffers.leftArm, lArmMat, this.skinTexture);
    if (this.buffers.leftSleeve) {
      this.drawMesh(this.buffers.leftSleeve, lArmMat, this.skinTexture);
    }

    // 5. Right Leg (hip pivot at x=-1.95, y=-4.0)
    let rLegMat = Mat4.translate(baseMat, -1.95, -4.0, 0);
    rLegMat = Mat4.rotateX(rLegMat, legSwing);
    rLegMat = Mat4.translate(rLegMat, 0, -6.0, 0);
    this.drawMesh(this.buffers.rightLeg, rLegMat, this.skinTexture);
    if (this.buffers.rightPants) {
      this.drawMesh(this.buffers.rightPants, rLegMat, this.skinTexture);
    }

    // 6. Left Leg (hip pivot at x=+1.95, y=-4.0)
    let lLegMat = Mat4.translate(baseMat, 1.95, -4.0, 0);
    lLegMat = Mat4.rotateX(lLegMat, -legSwing);
    lLegMat = Mat4.translate(lLegMat, 0, -6.0, 0);
    this.drawMesh(this.buffers.leftLeg, lLegMat, this.skinTexture);
    if (this.buffers.leftPants) {
      this.drawMesh(this.buffers.leftPants, lLegMat, this.skinTexture);
    }

    // 7. Cape (attached at upper back of torso: x=0, y=7.9, z=-2.05)
    // Rotates strictly backward into negative Z, hanging down smoothly over back and legs
    if (this.showCape && this.capeTexture && this.capeMesh) {
      let capeMat = Mat4.translate(baseMat, 0, 7.9, -2.05);
      capeMat = Mat4.rotateX(capeMat, capeAngle);
      this.drawMesh(this.capeMesh, capeMat, this.capeTexture);
    }

    requestAnimationFrame(this.render);
  }
}

// 4x4 Matrix Utilities for WebGL 3D Transformations
const Mat4 = {
  identity() {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  },

  perspective(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan((fovy * Math.PI) / 360.0);
    const nf = 1.0 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, (2 * far * near) * nf, 0
    ]);
  },

  translate(m, x, y, z) {
    const res = new Float32Array(m);
    res[12] = m[0] * x + m[4] * y + m[8] * z + m[12];
    res[13] = m[1] * x + m[5] * y + m[9] * z + m[13];
    res[14] = m[2] * x + m[6] * y + m[10] * z + m[14];
    res[15] = m[3] * x + m[7] * y + m[11] * z + m[15];
    return res;
  },

  rotateX(m, rad) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const res = new Float32Array(m);
    res[4] = m[4] * c + m[8] * s;
    res[5] = m[5] * c + m[9] * s;
    res[6] = m[6] * c + m[10] * s;
    res[7] = m[7] * c + m[11] * s;
    res[8] = m[8] * c - m[4] * s;
    res[9] = m[9] * c - m[5] * s;
    res[10] = m[10] * c - m[6] * s;
    res[11] = m[11] * c - m[7] * s;
    return res;
  },

  rotateY(m, rad) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const res = new Float32Array(m);
    res[0] = m[0] * c - m[8] * s;
    res[1] = m[1] * c - m[9] * s;
    res[2] = m[2] * c - m[10] * s;
    res[3] = m[3] * c - m[11] * s;
    res[8] = m[0] * s + m[8] * c;
    res[9] = m[1] * s + m[9] * c;
    res[10] = m[2] * s + m[10] * c;
    res[11] = m[3] * s + m[11] * c;
    return res;
  }
};

window.MinecraftSkin3D = MinecraftSkin3D;
