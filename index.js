var camera, scene, renderer,
    geometry, material, light, sphere, velocity = new THREE.Vector3(0.020, 0.021, 0.022),
    mesh, texture, t=0,
    OReffect, webrift, treadmill, stats;
var old_webrift = {x: null, y: null, z: null, w: null};
var old_treadmill = null;
var ep = 0.0001;
var track_circ = 400;
var track_radius = track_circ / 2 / Math.PI;
var i = 0;

init();
animate();

function init() {

    webrift = new Webrift("ws://localhost:1981");
    treadmill = new Treadmill('ws://localhost:1982');

    camera = new THREE.PerspectiveCamera(75, 1280/800, 0.3, 10000.0);
    camera.position.set(0, track_radius + 1.62, 0);

    scene = new THREE.Scene();

    gnd_geo = new THREE.CylinderGeometry(track_radius, track_radius, 4, 256, 1, true);
    gnd_tex = new THREE.ImageUtils.loadTexture('grid.png');
    gnd_tex.wrapS = THREE.RepeatWrapping;
    gnd_tex.wrapT = THREE.RepeatWrapping;
    gnd_tex.repeat.x = 12.5;
    gnd_mat = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        ambient: 0xffff00,
        side: THREE.DoubleSide,
        map: gnd_tex,
    });
    gnd = new THREE.Mesh(gnd_geo, gnd_mat);
    gnd.rotation.z = Math.PI / 2;
    scene.add(gnd);

    sky_geo = new THREE.SphereGeometry(10000, 8, 8);
    sky_tex = new THREE.ImageUtils.loadTexture('stars.jpg');
    sky_tex.wrapS = THREE.RepeatWrapping;
    sky_tex.wrapT = THREE.RepeatWrapping;
    sky_tex.repeat.x = 1;
    sky_tex.repeat.y = 1;
    sky_mat = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        ambient: 0xffffff,
        side: THREE.DoubleSide,
        map: sky_tex,
    });
    sky = new THREE.Mesh(sky_geo, sky_mat);
    sky.position.set(0, 4, 0);
    scene.add(sky);

    mrk_geo = new THREE.CubeGeometry(4, 1, 1);
    mrk_mat = new THREE.MeshPhongMaterial({ambient: 0xff0000});
    mrk = new THREE.Mesh(mrk_geo, mrk_mat);
    mrk.position.set(0, track_radius, 0);
    scene.add(mrk);

    light = new THREE.AmbientLight(0xffffff);
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
        //camera.quaternion.set(webrift.x, webrift.y, webrift.z, webrift.w);
        //camera.position.z -= treadmill.distance / 100;
        i += 0.03;

        camera.position.z = Math.sin(i/track_circ * Math.PI * 2) / -2 * (1.62 + track_radius * 2);
        camera.position.y = Math.cos(i/track_circ * Math.PI * 2) / 2 * (1.62 + track_radius * 2);
        camera.rotation.x = i / track_circ * Math.PI * -2;
        if (i >= track_circ) { i = 0; }

        OReffect.render(scene, camera);

        old_webrift.x = webrift.x;
        old_webrift.y = webrift.y;
        old_webrift.z = webrift.z;
        old_webrift.w = webrift.w;
        old_treadmill = treadmill.distance;
    }

    stats.end();
}
