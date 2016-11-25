var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 1000;


var counter = 0;


var res = 1000;
var pt_interval = 5;
var num_lines = 14;
var v_height = 75;
var x_offset = res*pt_interval/2;
var y_offset =  Math.floor(v_height*num_lines/2);
//y_offsett = 0;
var lines = []

for (var i = 0; i < num_lines; i++){
  var mat = new THREE.LineBasicMaterial({color:"#"+((1<<24)*Math.random()|0).toString(16)});
  //mat.color = "#FF0000";
  mat.linewidth = 5;
  var obj = new THREE.Line( new THREE.Geometry(), mat);
  var y = i*v_height - y_offset;
  for (var j = 0; j < res; j++){
    var x = j*pt_interval - x_offset;
    var z = 0;
    obj.geometry.vertices.push(new THREE.Vector3(x,y,z));
  }
  lines.push(obj);
  scene.add(obj);
}

var wave_mag = 30;
var freq = 1.0/100.0;


function update_lines(){

  for (var line in lines){
    var obj = lines[line];
    var new_pos = [];
    var l_freq = 1/(1/freq + line*4);
    for (var i =1; i < res; i++){
      var x =  i*pt_interval - x_offset;
      var y = (line*v_height - y_offset) + Math.sin((i + counter + line*(1.0/freq)/num_lines)*l_freq*2*Math.PI)*wave_mag;
      var z = 0;
      new_pos.push(new THREE.Vector3(x,y,z));
    }
    obj.material.linewidth = Math.abs(1*Math.sin(counter*line/num_lines*2*Math.PI*freq));
    obj.geometry.vertices = new_pos;
    obj.geometry.verticesNeedUpdate = true;

  }

}
function render() {
  counter++;
  update_lines();
  requestAnimationFrame( render );
	renderer.render( scene, camera );
}
render();

