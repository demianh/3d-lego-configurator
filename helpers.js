
function randomObject(obj){
  if (typeof obj === 'object'){
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
  } else {
    return obj[Math.floor(Math.random()*obj.length)];

  }
}

function getMaterialByName(name){
  var ret;
  scene.traverse( function(child) {
    if(child.material && child.material.name == name) {
      ret = child.material
      return false;
    }
  });
  return ret;
}

function getAllMaterials(){
  var materials = [];
  scene.traverse( function(child) {
    if(child.material) {
      materials.push(child.material);
    }
  });
  return materials;
}

function setDoubleSideRendering(){
  // Fix double side rendering
  var materials = getAllMaterials();
  materials.forEach(function(mat) {
    mat.side = THREE.DoubleSide
  });
}

function setTshirtImage(img){
  var texture = THREE.ImageUtils.loadTexture('img/tshirt/'+img, undefined, function(){ render(); });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  var material = getMaterialByName('Mat.Tshirt');
  material.map = texture;
}