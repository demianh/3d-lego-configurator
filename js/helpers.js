
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

function setMaterialColor(materialName, hexcolor){
  var color = new THREE.Color(hexcolor);
  var material = getMaterialByName(materialName);
  if(material){
    material.color = color;
    render();
  }
}

function setTshirtImage(img){
  var texture = THREE.ImageUtils.loadTexture('img/tshirt/'+img, undefined, function(){ render(); });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  var material = getMaterialByName('Mat.Tshirt');
  material.map = texture;
}

function fillColorPicker(element_id, colorset){
  for (var i in colorset){
    $(element_id).append('<option value="'+colorset[i]+'" data-color="'+colorset[i]+'">'+colorset[i]+'</option>');
  }
}

function fillImageSelector(element_id, images){
  for (var i in images){
    $(element_id).append('<img src="img/tshirt/'+images[i]+'" onclick="setTshirtImage(\''+images[i]+'\')"/>');
  }
}