
var firstCanvas = document.querySelector('#scene');
var width = Math.max(1200,firstCanvas.offsetWidth),
    height = firstCanvas.offsetHeight;

var renderer = new THREE.WebGLRenderer({
    canvas: firstCanvas,
    antialias: true,
    alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor(0xFFFFFF,0);

var scene = new THREE.Scene();

var requestId = true;


// var camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000);
var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 10000 );
camera.position.set(0, 0, 420);

var light1 = new THREE.DirectionalLight(0xFFFFFF, 0.2);
light1.position.set(200, 300, 1000); 
scene.add(light1);

var light2 = new THREE.DirectionalLight(0xFFFFFF, 0.2);
light2.position.set(-200, 300, -1000); 
scene.add(light2);


// var geometry = new THREE.IcosahedronGeometry(120,2);
var geometry = new THREE.BoxBufferGeometry( 50, 50, 50 );
var material = new THREE.MeshPhongMaterial({
    emissive: 0xD1CEBB, 
    bumpScale:1,
    emissiveIntensity: 0.85,
    flatShading:true,
    shininess: 100
});
var cube = new THREE.Mesh(geometry, material);

var geometry2 = new THREE.ConeBufferGeometry( 40, 55, 3 );
var material2 = new THREE.MeshPhongMaterial({
    emissive: 0x917E7A, 
    bumpScale:1,
    emissiveIntensity: 1.05,
    flatShading:true,
    shininess: 100
});
var tricone = new THREE.Mesh( geometry2, material2 );

var geometry3 = new THREE.IcosahedronBufferGeometry(30,0);
var material3 = new THREE.MeshPhongMaterial({
    emissive: 0xA7A6AF, 
    bumpScale:1,
    emissiveIntensity: 1.05,
    flatShading:true,
    shininess: 100
});
var sixCone = new THREE.Mesh( geometry3, material3 );

var geometry4 = new THREE.IcosahedronBufferGeometry(420,1);
var material4 = new THREE.MeshPhongMaterial({
    emissive: 0xDFDFDF, 
    bumpScale:1,
    emissiveIntensity: 0.9,
    flatShading:true,
    shininess: 100
});
var ballCone = new THREE.Mesh( geometry4, material4 );

var geometry5 = new THREE.CylinderBufferGeometry(10,10,30,30,30,false);
var material5 = new THREE.MeshPhongMaterial({
    emissive: 0x9EABB2, 
    bumpScale:1,
    emissiveIntensity: 0.85,
    flatShading:true,
    shininess: 100
});
var cylinder = new THREE.Mesh( geometry5, material5 );

var geometry6 = new THREE.TorusBufferGeometry(20,10,50,50,6.283185);
var material6 = new THREE.MeshPhongMaterial({
    emissive: 0xA9B8A9, 
    bumpScale:1,
    emissiveIntensity: 0.85,
    flatShading:true,
    shininess: 100
});
var tour = new THREE.Mesh( geometry6, material6 );

// 八面体
var geometry7 = new THREE.OctahedronBufferGeometry(30,0);
var material7 = new THREE.MeshPhongMaterial({
    emissive: 0xB4B6B6, 
    bumpScale:1,
    emissiveIntensity: 0.85,
    flatShading:true,
    shininess: 100
});
var octahedron = new THREE.Mesh( geometry7, material7 );

var geometry8 = new THREE.DodecahedronBufferGeometry(20,0);
var material8 = new THREE.MeshPhongMaterial({
    emissive: 0xB8ABAB, 
    bumpScale:1,
    emissiveIntensity: 1.05,
    flatShading:true,
    shininess: 100
});
var dodecahedron = new THREE.Mesh( geometry8, material8 );


var geometry9 = new THREE.SphereBufferGeometry(20,16,16);
var material9 = new THREE.MeshPhongMaterial({
    emissive: 0x404040, 
    bumpScale:1,
    emissiveIntensity: 1.25,
    flatShading:true,
    shininess: 200
});
var sphere = new THREE.Mesh( geometry9,material9);

// pencil
var geometry10 = new THREE.ConeBufferGeometry(25,40,0);
var material10 = new THREE.MeshPhongMaterial({
    emissive: 0x99A6A3, 
    bumpScale:1,
    emissiveIntensity: 0.95,
    flatShading:true,
    shininess: 100
});
var sphere2 = new THREE.Mesh( geometry10,material10);



scene.add(tricone);
scene.add(cube);
scene.add(sixCone);
scene.add(ballCone);
scene.add(cylinder);
scene.add(tour);
scene.add(octahedron);
scene.add(dodecahedron)
scene.add(sphere);
scene.add(sphere2);

var surfaceFactor = 0.;
var zoomFactor = 1.;

function updateShape (geo,factor) {
    geo.rotation.x += 0.005*factor;
    geo.rotation.y += 0.005*factor;
    geo.rotation.z += 0.005*factor;
}

function render(a) {
    if(requestId){
        requestId = requestAnimationFrame(render);
    }

    updateShape(cube,2.)
    updateShape(tricone,1.)
    updateShape(sixCone,-1.5)
    updateShape(ballCone,-0.8)
    updateShape(cylinder,Math.random())
    updateShape(tour,0.6)
    updateShape(octahedron,-0.4)
    updateShape(dodecahedron,-1.2)
    updateShape(sphere,1.4)
    updateShape(sphere2,2.0)

    cube.position.x = 150
    cube.position.y = 0 + 50
    cube.position.z = 200
    tricone.position.x = 200
    tricone.position.y = 200 + 150
    sixCone.position.x = 300
    sixCone.position.y = -150 - 40
    sixCone.position.z = 300
    ballCone.position.x = 550;
    ballCone.position.y = -20 + 50
    ballCone.position.z = -10
    cylinder.position.x = 170;
    cylinder.position.y = 100 + 100
    cylinder.position.z = -200;
    tour.position.x = 90;
    tour.position.y = -200 + 50
    octahedron.position.x = 200
    octahedron.position.y = -280

    dodecahedron.position.x = 500
    dodecahedron.position.y = -250
    dodecahedron.position.z = 300
    sphere.position.x = 20
    sphere.position.y = 20
    sphere2.position.x = 50
    sphere2.position.y = 180
    sphere2.position.z = 200 + 100

    renderer.render(scene, camera);
}

function onResize() {
    // canvas.style.width = '';
    // canvas.style.height = '';
    // width = canvas.offsetWidth;
    // height = canvas.offsetHeight;
    // camera.aspect = width / height;
    // camera.updateProjectionMatrix();  
    // renderer.setSize(width, height);
}

// Mouse Interaction
var mouse = new THREE.Vector2(0.8, 0.5);
function onMouseMove(e) {
    TweenMax.to(mouse, 0.8, {
        y: (e.clientY / height),
        x : (e.clientX / width),
        ease: Power1.easeOut
    });
}

// Final Main Loop
requestAnimationFrame(render);
window.addEventListener("mousemove", onMouseMove);
var resizeTm;
window.addEventListener("resize", function(){
    resizeTm = clearTimeout(resizeTm);
    resizeTm = setTimeout(onResize, 200);
});