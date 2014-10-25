// scene Setup
var viewport_width = 500;
var viewport_height = 500;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, viewport_width/viewport_height, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setClearColor(0xFFFFFF, 1.0);
renderer.setSize(viewport_width, viewport_height);
var webglContainer = document.getElementById('webgl-container');
webglContainer.appendChild(renderer.domElement);

// camera controls
var camControls = new THREE.OrbitControls(camera, renderer.domElement);
camControls.damping = 0.2;
camControls.addEventListener('change', render);

// window resize handler
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

var axes = new THREE.AxisHelper(20);
//scene.add(axes);

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);

var texture = THREE.ImageUtils.loadTexture('img/lego_bg.jpg', null, function(){ render(); });
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 3, 3 );
var planeMaterial = new THREE.MeshBasicMaterial( { map: texture} );
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 0.7;
plane.position.y = -22.2;
plane.position.z = -3.2;
scene.add(plane);

// ---- 3D CONTENT CREATION -----------------------------------------------------

var tshirtMaterial;

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load('lego_man.dae', function (collada) {
  var dae = collada.scene;
  var skin = collada.skins[0];
  dae.position.set(0, 0, 0); //x,z,y- if you think in blender dimensions ;)
  dae.rotation.y = -0.5 * Math.PI;
  dae.scale.set(0.06, 0.06, 0.06);
  scene.add(dae);

  // Scaling
  var s = 15.2;

  // T-Shirt Object
  var rectShape = new THREE.Shape();
  rectShape.moveTo( 0/s,0/s );
  rectShape.lineTo( 0/s,1/s );
  rectShape.lineTo( 1.85/s, 12/s );
  rectShape.lineTo( 13.45/s, 12/s );
  rectShape.lineTo( 15.35/s, 1/s );
  rectShape.lineTo( 15.35/s, 0/s );
  rectShape.lineTo( 2.35/s, 0/s );

  // T-Shirt Texture
  var rectGeom = new THREE.ShapeGeometry( rectShape );
  var texture = THREE.ImageUtils.loadTexture('img/tshirt/lego.gif', undefined, function(){ render(); });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  tshirtMaterial = new THREE.MeshBasicMaterial( {
    map: texture,
    name: 'Mat.Tshirt',
    specular: 0x333333,
    shininess: 50,
    transparent: true
  } );
  var rectMesh = new THREE.Mesh( rectGeom, tshirtMaterial ) ;

  // Add Object
  rectMesh.position.z = 4.4+0;
  rectMesh.position.x = -7.35;
  rectMesh.position.y = -6;
  rectMesh.scale.set(s, s, s);
  scene.add( rectMesh );

  setDoubleSideRendering();

  render();
});

// ---- END OF 3D CONTENT CREATION ---------------------------------------------

// position and point the camera to the center of the scene
camera.position.x = 10;
camera.position.y = 30;
camera.position.z = 60;
camera.lookAt(scene.position);

// add subtle ambient lighting
var ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

// add spotlight
var spotLight = new THREE.SpotLight(0xdddddd);
spotLight.position.set(-70, 90, 35);
scene.add(spotLight);

// add headlight
var headLight = new THREE.PointLight(0x777777, 1.0);
headLight.position.set(camera.position.x, camera.position.y, camera.position.z);
scene.add(headLight);

var randomize = function(){
  var leg_color = new THREE.Color(randomObject(legoColors));
  var torso_color = new THREE.Color(randomObject(legoColors));
  var skin_color = new THREE.Color(randomObject(skinColors));
  var hair_color = new THREE.Color(randomObject(hairColors));

  var skin_material = getMaterialByName('Mat.Skin');
  skin_material.color = skin_color;
  guiControls.colorSkin = '#'+skin_color.getHexString();
  $('#colorselector_skin').colorselector('setColor', '#'+skin_color.getHexString().toUpperCase());

  var leg_material = getMaterialByName('Mat.Legs');
  leg_material.color = leg_color;
  guiControls.colorLegs = '#'+leg_color.getHexString();
  $('#colorselector_legs').colorselector('setColor', '#'+leg_color.getHexString().toUpperCase());

  var torso_material = getMaterialByName('Mat.Torso');
  torso_material.color = torso_color;
  guiControls.colorBody = '#'+torso_color.getHexString();
  $('#colorselector_body').colorselector('setColor', '#'+torso_color.getHexString().toUpperCase());

  var hair_material = getMaterialByName('Mat.Hair');
  hair_material.color = hair_color;
  guiControls.colorHair = '#'+hair_color.getHexString();
  $('#colorselector_hair').colorselector('setColor', '#'+hair_color.getHexString().toUpperCase());

  var tshirtImg = randomObject(tshirtImages);
  setTshirtImage(tshirtImg);
  guiControls.TShirt = tshirtImg;

  // update values in GUI
  for (var i in gui.__controllers) {
    gui.__controllers[i].updateDisplay();
  }

  render();
}

// add GUI control elements
var guiControls = new function () {
  this.showHead = true;
  this.showTorso = true;
  this.showLegs = true;
  this.colorBody = '#FF0000';
  this.colorLegs = '#002aFF';
  this.colorHair = '#733f00';
  this.colorSkin = '#FFFF00';
  this.TShirt = 'lego.gif';
  this.Randomize = randomize;

  this.showAxes = false;
  this.withAmbient = true;
  this.withSpotLight = true;
  this.withHeadLight = true;
};

var gui = new dat.GUI({
  autoPlace: false
});
var guiContainer = document.getElementById('gui-container');
guiContainer.appendChild(gui.domElement);

gui.add(guiControls, 'showHead').onChange(function (e) {
  scene.getObjectByName('Head', true).visible = e;
  render();
});
gui.add(guiControls, 'showTorso').onChange(function (e) {
  scene.getObjectByName('L_Hand', true).visible = e;
  scene.getObjectByName('R_Hand', true).visible = e;
  scene.getObjectByName('L_Arm', true).visible = e;
  scene.getObjectByName('R_Arm', true).visible = e;
  scene.getObjectByName('Torso', true).visible = e;
  render();
});
gui.add(guiControls, 'showLegs').onChange(function (e) {
  scene.getObjectByName('Legs', true).visible = e;
  render();
});
gui.addColor(guiControls, 'colorBody').onChange(function (e) {
  setMaterialColor('Mat.Torso', e);
});
gui.addColor(guiControls, 'colorLegs').onChange(function (e) {
  setMaterialColor('Mat.Legs', e);
});
gui.addColor(guiControls, 'colorHair').onChange(function (e) {
  setMaterialColor('Mat.Hair', e);
});
gui.addColor(guiControls, 'colorSkin').onChange(function (e) {
  setMaterialColor('Mat.Skin', e);
});
gui.add(guiControls, 'TShirt', tshirtImages).onChange(function (e) {
  setTshirtImage(e);
});
gui.add(guiControls, 'Randomize');

guiView = gui.addFolder('VIEW');
guiView.add(guiControls, 'showAxes').onChange(function (e) {
  showAxes = e;
  if (showAxes) {
    scene.add(axes);
  } else {
    scene.remove(axes);
  }
  render();
});
guiView.add(guiControls, 'withAmbient').onChange(function (e) {
  withAmbient = e;
  if (withAmbient) {
    scene.add(ambientLight);
  } else {
    scene.remove(ambientLight);
  }
  render();
});
guiView.add(guiControls, 'withSpotLight').onChange(function (e) {
  withSpotLight = e;
  if (withSpotLight) {
    scene.add(spotLight);
  } else {
    scene.remove(spotLight);
  }
  render();
});
guiView.add(guiControls, 'withHeadLight').onChange(function (e) {
  withHeadLight = e;
  if (withHeadLight) {
    scene.add(headLight);
  } else {
    scene.remove(headLight);
  }
  render();
});

var clock = new THREE.Clock();

// init and call render function
function render() {
  headLight.position.set(camera.position.x, camera.position.y, camera.position.z);
  renderer.render(scene, camera);
}
render();
