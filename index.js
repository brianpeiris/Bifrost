var camera, scene, renderer,
    geometry, material, light, sphere, velocity = new THREE.Vector3(0.020, 0.021, 0.022),
    mesh, texture, t=0,
    OReffect, webrift, treadmill, stats;
var old_webrift = {x: null, y: null, z: null, w: null};
var old_treadmill = null;
var ep = 0.0001;

init();
animate();

function init() {

    webrift = new Webrift("ws://localhost:1981");
    treadmill = new Treadmill('ws://localhost:1982');

    camera = new THREE.PerspectiveCamera(75, 1280/800, 0.3, 10000.0);
    camera.position.set(0, 1.62, 3.0);

    scene = new THREE.Scene();

    /*
    geometry = new THREE.CubeGeometry(8, 8 ,8);
    geometry.computeTangents();
    texture = new THREE.ImageUtils.loadTexture( 'grid.png' );
    normal = new THREE.ImageUtils.loadTexture( 'normalmap.png' );
    material = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
        map: texture,
        normalMap: normal,
        shininess: 100,
        metal: false,
        specular: 0xffffff
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 4, 0);
    scene.add(mesh);
    */

    gnd_geo = new THREE.CylinderGeometry(4, 1, 500);
    gnd_tex = new THREE.ImageUtils.loadTexture('grid.png');
    gnd_mat = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
        map: gnd_tex,
    });
    gnd = new THREE.Mesh(gnd_geo, gnd_mat);
    gnd.position.set(0, 0, 0);
    scene.add(gnd);

    sky_geo = new THREE.SphereGeometry(500, 8, 8);
    sky_tex = new THREE.ImageUtils.loadTexture('grid.png');
    sky_mat = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
        map: sky_tex,
    });
    sky = new THREE.Mesh(sky_geo, sky_mat);
    sky.position.set(0, 4, 0);
    scene.add(sky);

    for (var i = 0; i < 10; i++) {
        mrk_geo = new THREE.CubeGeometry(1, Math.random() * 10 + 4, 1);
        mrk_color = new THREE.Color();
        mrk_color.setHSL(Math.random(), 1, 0.2);
        mrk_mat = new THREE.MeshPhongMaterial({color: mrk_color.getHex()});
        mrk = new THREE.Mesh(mrk_geo, mrk_mat);
        mrk.position.set(4, 0, -i * 5);
        scene.add(mrk);

        mrk_geo = new THREE.CubeGeometry(1, Math.random() * 10 + 4, 1);
        mrk_color = new THREE.Color();
        mrk_color.setHSL(Math.random(), 1, 0.2);
        mrk_mat = new THREE.MeshPhongMaterial({color: mrk_color.getHex()});
        mrk = new THREE.Mesh(mrk_geo, mrk_mat);
        mrk.position.set(-4, 0, -i * 5);
        scene.add(mrk);
    }

    light = new THREE.PointLight(0xffffff);
    light.position.set(0, 4, 0);
    scene.add(light);

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

    stats = new Stats();
    document.body.appendChild(stats.domElement);

}

function animate() {
    requestAnimationFrame(animate);

    stats.begin();

    if (
        true ||
        Math.abs(webrift.x - old_webrift.x) > ep ||
        Math.abs(webrift.y -  old_webrift.y) > ep ||
        Math.abs(webrift.z -  old_webrift.z) > ep ||
        Math.abs(webrift.w -  old_webrift.w) > ep ||
        old_treadmill != treadmill.distance
    ){
        camera.quaternion.set(webrift.x, webrift.y, webrift.z, webrift.w);
        //camera.position.z -= treadmill.distance / 100;
        camera.position.z -= 0.02;
        OReffect.render(scene, camera);
        old_webrift.x = webrift.x;
        old_webrift.y = webrift.y;
        old_webrift.z = webrift.z;
        old_webrift.w = webrift.w;
        old_treadmill = treadmill.distance;
    }

    stats.end();
}
