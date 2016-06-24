window.vsartShaders = {"vs-header":"\nattribute float vertexId;\n\nuniform vec2 mouse;\nuniform vec2 resolution;\nuniform vec4 background;\nuniform float time;\nuniform float vertexCount;\nuniform sampler2D sound;\nuniform sampler2D floatSound;\nuniform sampler2D touch;\nuniform vec2 soundRes;\nuniform float _dontUseDirectly_pointSize;\n\nvarying vec4 v_color;\n  ","vs":"\n#define PI radians(180.)\n#define NUM_SEGMENTS 21.0\n#define NUM_POINTS (NUM_SEGMENTS * 2.0)\n#define STEP 5.0\n\nvec3 hsv2rgb(vec3 c) {\n  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));\n  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nvoid main() {\n  float point = mod(floor(vertexId / 2.0) + mod(vertexId, 2.0) * STEP, NUM_SEGMENTS);\n  float count = floor(vertexId / NUM_POINTS);\n  float offset = count * 0.02;\n  float angle = point * PI * 2.0 / NUM_SEGMENTS + offset;\n  float radius = 0.2;\n  float c = cos(angle + time) * radius;\n  float s = sin(angle + time) * radius;\n  float orbitAngle = count * 0.01;\n  float oC = cos(orbitAngle + time * count * 0.01) * sin(orbitAngle);\n  float oS = sin(orbitAngle + time * count * 0.01) * sin(orbitAngle);\n\n  vec2 aspect = vec2(1, resolution.x / resolution.y);\n  vec2 xy = vec2(\n      oC + c,\n      oS + s);\n  gl_Position = vec4(xy * aspect + mouse * 0.1, 0, 1);\n\n  float hue = (time * 0.01 + count * 1.001);\n  v_color = vec4(hsv2rgb(vec3(hue, 1, 1)), 1);\n}\n  ","vs2":"\n#define PI radians(180.)\n#define NUM_SEGMENTS 4.0\n#define NUM_POINTS (NUM_SEGMENTS * 2.0)\n#define STEP 5.0\n\nvec3 hsv2rgb(vec3 c) {\n  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));\n  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nvoid main() {\n  float point = mod(floor(vertexId / 2.0) + mod(vertexId, 2.0) * STEP, NUM_SEGMENTS);\n  float count = floor(vertexId / NUM_POINTS);\n  float snd = texture2D(sound, vec2(fract(count / 128.0), fract(count / 20000.0))).a;\n  float offset = count * 0.02;\n  float angle = point * PI * 2.0 / NUM_SEGMENTS + offset;\n  float radius = 0.2 * pow(snd, 5.0);\n  float c = cos(angle + time) * radius;\n  float s = sin(angle + time) * radius;\n  float orbitAngle =  count * 0.0;\n  float innerRadius = count * 0.001;\n  float oC = cos(orbitAngle + time * 0.4 + count * 0.1) * innerRadius;\n  float oS = sin(orbitAngle + time + count * 0.1) * innerRadius;\n\n  vec2 aspect = vec2(1, resolution.x / resolution.y);\n  vec2 xy = vec2(\n      oC + c,\n      oS + s);\n  gl_Position = vec4(xy * aspect + mouse * 0.1, 0, 1);\n\n  float hue = (time * 0.01 + count * 1.001);\n  v_color = vec4(hsv2rgb(vec3(hue, 1, 1)), 1);\n}\n  ","vs3":"\n#define NUM_SEGMENTS 128.0\n#define NUM_POINTS (NUM_SEGMENTS * 2.0)\n\nvec3 hsv2rgb(vec3 c) {\n  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));\n  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nvoid main() {\n  float numLinesDown = floor(vertexCount / NUM_POINTS);\n  // produces 0,1, 1,2, 2,3, ...\n  float point = floor(mod(vertexId, NUM_POINTS) / 2.0) + mod(vertexId, 2.0);\n  // line count\n  float count = floor(vertexId / NUM_POINTS);\n\n  float u = point / NUM_SEGMENTS;  // 0 <-> 1 across line\n  float v = count / numLinesDown;  // 0 <-> 1 by line\n  float invV = 1.0 - v;\n\n  // Only use the left most 1/4th of the sound texture\n  // because there's no action on the right\n  float historyX = u * 0.25;\n  // Match each line to a specific row in the sound texture\n  float historyV = (v * numLinesDown + 0.5) / soundRes.y;\n  float snd = texture2D(sound, vec2(historyX, historyV)).a;\n\n  float x = u * 2.0 - 1.0;\n  float y = v * 2.0 - 1.0;\n  vec2 xy = vec2(\n      x * mix(0.5, 1.0, invV),\n      y + pow(snd, 5.0) * 1.0) / (v + 0.5);\n  gl_Position = vec4(xy * 0.5, 0, 1);\n\n  float hue = u;\n  float sat = invV;\n  float val = invV;\n  v_color = mix(vec4(hsv2rgb(vec3(hue, sat, val)), 1), background, v * v);\n}\n  ","vs4":"\n#define PI radians(180.)\n#define NUM_SEGMENTS 2.0\n#define NUM_POINTS (NUM_SEGMENTS * 2.0)\n#define STEP 1.0\n\nvoid main() {\n  float point = mod(floor(vertexId / 2.0) + mod(vertexId, 2.0) * STEP, NUM_SEGMENTS);\n  float count = floor(vertexId / NUM_POINTS);\n  float offset = count * sin(time * 0.01) + 5.0;\n  float angle = point * PI * 2.0 / NUM_SEGMENTS + offset;\n  float radius = pow(count * 0.00014, 1.0);\n  float c = cos(angle + time) * radius;\n  float s = sin(angle + time) * radius;\n  float orbitAngle =  pow(count * 0.025, 0.8);\n  float innerRadius = pow(count * 0.0005, 1.2);\n  float oC = cos(orbitAngle + count * 0.0001) * innerRadius;\n  float oS = sin(orbitAngle + count * 0.0001) * innerRadius;\n\n  vec2 aspect = vec2(1, resolution.x / resolution.y);\n  vec2 xy = vec2(\n      oC + c,\n      oS + s);\n  gl_Position = vec4(xy * aspect + mouse * 0.1, 0, 1);\n\n  float b = 1.0 - pow(sin(count * 0.4) * 0.5 + 0.5, 10.0);\n  b = 0.0;mix(0.0, 0.7, b);\n  v_color = vec4(b, b, b, 1);\n}\n  ","wave-vs":"\nvec3 hsv2rgb(vec3 c) {\n  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));\n  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nfloat select(float v, float t) {\n  return step(t * 0.9, v) * step(v, t * 1.1);\n}\n\nvoid main() {\n  float GRID_YOFF = 1./40.;\n  float GRID_DOWN = 17.;\n  float GRID_ACROSS = 64.0;\n  float NUM_PER_DOWN = GRID_DOWN * 2.;\n  float NUM_PER_ACROSS = GRID_ACROSS * 2.;\n  float NUM_PER_GRID = NUM_PER_DOWN + NUM_PER_ACROSS;\n  float NUM_GRIDS = 4.;\n  float NUM_GRID_TOTAL = NUM_PER_GRID * NUM_GRIDS;\n  float NUM_POINTS = (vertexCount - NUM_GRID_TOTAL) / 4.;\n  float NUM_SEGMENTS = NUM_POINTS / 2.;\n\n\n  float id = vertexId - NUM_GRID_TOTAL;\n\n  // produces 0,1, 1,2, 2,3, ...\n  float point = floor(mod(id, NUM_POINTS) / 2.0) + mod(id, 2.0);\n  // line count\n  float grid = floor(id / NUM_POINTS);\n\n  float u = point / (NUM_SEGMENTS - 1.);    // 0 <-> 1 across line\n  float v = grid / NUM_GRIDS;      // 0 <-> 1 by line\n\n  float snd0 = texture2D(sound, vec2(u * 1., 0)).a;\n  float snd1 = texture2D(sound, vec2(u * 0.5, 0)).a;\n  float snd2 = texture2D(sound, vec2(u * 0.25, 0)).a;\n  float snd3 = texture2D(sound, vec2(u * 0.125, 0)).a;\n\n  float s =\n    snd0 * select(grid, 0.) +\n    snd1 * select(grid, 1.) +\n    snd2 * select(grid, 2.) +\n    snd3 * select(grid, 3.) +\n    0.;\n\n  float x = u * 2.0 - 1.0;\n  float y = v * 2.0 - 1.0;\n  vec2 xy = vec2(\n      x,\n      s * 0.4 + y + GRID_YOFF);\n  gl_Position = vec4(xy, 0, 1);\n\n  float hue = grid * 0.25;\n  float sat = 1.0;\n  float val = 1.0;\n\n  if (id < 0.0) {\n    if (vertexId < NUM_PER_DOWN * NUM_GRIDS) {\n      float hgx = mod(vertexId, 2.0);\n      float hgy = mod(floor(vertexId / 2.), GRID_DOWN);\n      float hgId = floor(vertexId / NUM_PER_DOWN);\n      gl_Position = vec4(\n        hgx * 2. - 1.,\n        hgy / (GRID_DOWN - 1.) * 0.4 +\n        (hgId / NUM_GRIDS * 2. - 1.) + GRID_YOFF,\n        0.1,\n        1);\n\n      hue = hgId * 0.25;\n      sat = 0.5;\n      val = 0.3;\n    } else {\n      float vid = vertexId - NUM_PER_DOWN * NUM_GRIDS;\n      float vgy = mod(vid, 2.0);\n      float vgx = mod(floor(vid / 2.), GRID_ACROSS);\n      float vgId = floor(vid / NUM_PER_ACROSS);\n      gl_Position = vec4(\n        ((vgx / GRID_ACROSS) * 2. - 1.) * pow(2., vgId),\n        vgy * 0.4 +\n        (vgId / NUM_GRIDS * 2. - 1.) + GRID_YOFF,\n        0.1,\n        1);\n\n      hue = vgId * 0.25;\n      sat = 0.5;\n      val = 0.3;\n\n    }\n  }\n\n  v_color = vec4(hsv2rgb(vec3(hue, sat, val)), 1);\n}\n  ","fs":"\nprecision mediump float;\n\nvarying vec4 v_color;\n\nvoid main() {\n  gl_FragColor = v_color;\n}\n  ","history-vs":"\nattribute vec4 position;\nattribute vec2 texcoord;\nuniform mat4 u_matrix;\nvarying vec2 v_texcoord;\n\nvoid main() {\n  gl_Position = u_matrix * position;\n  v_texcoord = texcoord;\n}\n  ","history-fs":"\nprecision mediump float;\n\nuniform sampler2D u_texture;\nuniform float u_mix;\nuniform float u_mult;\nvarying vec2 v_texcoord;\n\nvoid main() {\n  vec4 color = texture2D(u_texture, v_texcoord);\n  gl_FragColor = mix(color.aaaa, color.rgba, u_mix) * u_mult;\n}\n  ","rect-vs":"\nattribute vec4 position;\nuniform mat4 u_matrix;\n\nvoid main() {\n  gl_Position = u_matrix * position;\n}\n  ","rect-fs":"\nprecision mediump float;\n\nuniform vec4 u_color;\n\nvoid main() {\n  gl_FragColor = u_color;\n}\n  "}