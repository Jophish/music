var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x222222 );
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({antialiasing: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 1000;

var base_line_width = 1;
var line_width_val = 1;
var counter = 0;

var num_bars = 15;

var bar_width = 100;

var lineArray = new Array();

var wave_mag = 30;
var freq = 1.0/200.0;

var res = 10;
var pt_interval = 5;
var num_lines = 10;
var v_height = 100;
var x_offset = res*pt_interval/2;
var y_offset =  Math.floor(v_height*num_lines/2);
var bar_offset = -(res*pt_interval+bar_width)*num_bars/3.5;

for (var k = 0; k<num_bars; k++){
  var bar = new Array(); //list of lines in single bar
  for (var i = 0; i < num_lines; i++){


    var sat = 1;
    var hue = (k*1.0)/num_bars;
    console.log(hue);
    var val = ((i*1.0)/num_lines)/2.0 + .5;
    var color = tinycolor.fromRatio({h:hue, s:sat, v:val});
    color = color.toHexString();
    var mat = new THREE.LineBasicMaterial({color:color});
    //mat.color = color;
    mat.linewidth = 1;
    var obj = new THREE.Line( new THREE.Geometry(), mat); //single line in one bar
    var y = i*v_height - y_offset;

    for (var j = 0; j < res; j++){
      var x = j*pt_interval - x_offset - (0*bar_offset + 0*bar_width);
      var z = 0;
      obj.geometry.vertices.push(new THREE.Vector3(x,y,z));
    }


    bar.push(obj);
    scene.add(obj);
  }
  lineArray.push(bar);
}


function update_lines(){
  //wave_mag += 1;
  //wave_mag = wave_mag % 30;

  for (var lines = 0; lines < lineArray.length; lines++){

    var line2 = lineArray[lines]; //single bar, array of lines

    for (var line in line2){

      var obj = line2[line]; //single line
      var new_pos = [];
      var l_freq = 1/(1/freq + line*4);
      //l_freq = freq;
      for (var i =1; i < res; i++){
	var x =  i*pt_interval - x_offset  - (bar_offset + lines*bar_width);
	var y = (line*v_height - y_offset) + Math.sin((lines*10 +  i + counter + line*(1.0/freq)/num_lines)*l_freq*2*Math.PI)*wave_mag;
	var z = lines*lines*0;
	new_pos.push(new THREE.Vector3(x,y,z));
      }
      obj.material.linewidth = line_width_val*Math.abs(base_line_width + Math.sin(counter*line/num_lines*2*Math.PI*freq/10));
    //obj.material.linewidth = 1;
    obj.geometry.vertices = new_pos;
    obj.geometry.verticesNeedUpdate = true;

  }

  }
}
function render() {
  counter += 1;
  update_lines();
  requestAnimationFrame( render );
	renderer.render( scene, camera );
}
render();

