var camera, scene, renderer,
    geometry, material, light, sphere, velocity = new THREE.Vector3(0.020, 0.021, 0.022),
    mesh, texture, t=0,
    OReffect, webrift;

init();
animate();

function init() {

    webrift = new Webrift("ws://localhost:1981");

    camera = new THREE.PerspectiveCamera(75, 1280/800, 0.3, 10000.0);
    camera.position.set(0, 1.62, 3.0);

    scene = new THREE.Scene();

    geometry = new THREE.CubeGeometry(8, 8 ,8);
    geometry.computeTangents();
    texture = new THREE.ImageUtils.loadTexture( 'grid.png' );
    normal = new THREE.ImageUtils.loadTexture( 'normalmap.png' );
    material = new THREE.MeshPhongMaterial({color: 0xffff00, side: THREE.DoubleSide, map: texture, normalMap: normal, shininess: 100, metal: false, specular: 0xffffff});
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 4, 0);
    scene.add(mesh);

    geometry = new THREE.SphereGeometry(0.1, 16, 32)
    material = new THREE.MeshBasicMaterial({color: 0xffffff});
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 4, 0);
    scene.add(sphere);

    light = new THREE.PointLight(0xffffff, 1.0, 48.0);
    light.position.set(0, 4, 0);
    scene.add(light)

    var canvas = document.getElementById("renderCanvas");
    renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize(1280, 800);
    renderer.setClearColor(0xffffff);

    var HMD = {
        hResolution: 1280,
        vResolution: 800,
        hScreenSize: 0.14976,
        vScreenSize: 0.0936,
        interpupillaryDistance: 0.064,
        lensSeparationDistance: 0.064,
        eyeToScreenDistance: 0.041,
        distortionK : [1.0, 0.22, 0.24, 0.0],
        chromaAbParameter: [ 0.996, -0.004, 1.014, 0.0]
    };
    OReffect = new THREE.OculusRiftEffect(renderer, {HMD: HMD, worldFactor: 1.0});
    OReffect.setSize(1280, 800);

    document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);
    sphere.position.add(velocity);
    if (sphere.position.x > 4 - 0.1 || sphere.position.x < -4 + 0.1) {
        velocity.x *= -1;
    }
    if (sphere.position.y > 8 - 0.1 || sphere.position.y < 0 + 0.1) {
        velocity.y *= -1;
    }
    if (sphere.position.z > 4 - 0.1 || sphere.position.z < -4 + 0.1) {
        velocity.z *= -1;
    }
    camera.quaternion.set(webrift.x, webrift.y, webrift.z, webrift.w);
    light.position = sphere.position.clone();
    OReffect.render(scene, camera);

}