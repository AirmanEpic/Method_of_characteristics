mpos = {x:0,y:0}
var ctx = {};
var clicked_lm = 0;

var phase = 1;
var mouth_height = 10
var max_width = 600
var fan_count = parseInt(prompt("Please enter the number of characteristic lines",4));
var max_height = 300;

margin = 20;
margin_top = 200;

var ray_distance = 10000000

var canvas = document.getElementById('canvas');
if (canvas.getContext) 
{
	ctx = canvas.getContext('2d');
}


function main(){
	calculate_fan()

	document.body.addEventListener('mousedown', function(){
		if (mpos.x<canvas.width && mpos.y<canvas.height && mpos.x>0 && mpos.y>0)
		clicked_lm=1;
	}, true); 

	document.body.addEventListener('mouseup', function(){
		clicked_lm=3;
	}, true); 

	$("canvas").mousemove(function(e) {
		mpos.x = e.pageX - $('canvas').offset().left;
		mpos.y = e.pageY - $('canvas').offset().top;
	})

	draw();
}

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle="white"
	ctx.fillRect(0,0,canvas.width,canvas.height)

	//phase 1 (drawing lines from fan point to the sonic line)
		if (phase == 1){
			ctx.strokeStyle="black"
			draw_line({x:0,y:0},{x:0,y:mouth_height})
			draw_line({x:0,y:mouth_height},{x:max_width,y:mouth_height})

			//fan rays
			final_points_list.forEach(function(point,ind){
				if (ind!=0)
				{
					ctx.fillStyle = "Red"
					ctx.beginPath()
					pos = ps_to_ss({x:point.position.x,y:point.position.y})
					ctx.arc(pos.x,pos.y,.2,0,Math.PI*2)
					ctx.fill();
	
					ctx.strokeStyle="Blue"
					if (fan_count<100)
					{
						draw_line(point.position,point.A)
						draw_line(point.position,point.B)
					}
				}
			})

			nozzle_points.forEach(function(point,ind){
				ctx.strokeStyle="Purple"
				if (ind!=0)
				{
					draw_line(point.pos,nozzle_points[ind-1].pos)
					ctx.strokeStyle = "blue"
					if (fan_count<100)
					draw_line(point.pos,point.seed)
				}
			})
		}
	//phase 2 (drawing initial intersects)
	//phase 3 (drawing completed thing)

	requestAnimationFrame(draw);
}

function detectmob() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}
window.onresize = function(event) {
resizeDiv();
}

function resizeDiv() {

	vpw = $(window).width();
	vph = $(window).height();

	var m=detectmob()
}

$(document).ready(resizeDiv)
$(document).ready(main)

function draw_line(p1,p2){
	p1_ss = ps_to_ss(p1)
	p2_ss = ps_to_ss(p2)

	ctx.beginPath()
	ctx.moveTo(p1_ss.x,p1_ss.y)
	ctx.lineTo(p2_ss.x,p2_ss.y)
	ctx.stroke();
}

function ps_to_ss(ps){
	//plot space to screen space. Scales and adjusts points for drawing in 2d or whatever
	//max height: 500
	//max width:1000
	return ({x:lerp_d(0,canvas.width-(margin*2),ps.x/max_width)+margin,y:lerp_d(0,canvas.height-(margin*2),(ps.y+margin_top)/(max_height))+margin})
}

function calculate_fan(){
	fan_rays = generate_fan(0.265,29.265,fan_count+1)
	// log_list = log_points(fan_rays.points)
	fan_rays = fan_rays.rays;
	sonic_line = [{x:0,y:mouth_height},{x:max_width,y:mouth_height}]

	final_points_list = []
	final_points_list.push({position:{x:0,y:0}})

	fan_rays.forEach(function(ray,ray_int){
		if (ray_int == 0){
			length_prev = 0
		}
		else{
			length_prev = fan_rays[ray_int-1].int_points.length-1
		}
		ray.int_points.forEach(function(point,point_int){
			//find out what points and angles define this.
			var point_A = {}
			var point_B = {}
			var ray_A = 0
			var ray_B = 0
			if (ray_int == 0){
				ray_B = 0 + (point.theta - point.mu)
				point_B = {x:0,y:0}
				if (point_int == 0){
					ray_A = 0
					point_A = sonic_line[0]
				}
				else{
					pa = final_points_list[final_points_list.length - 1]
					ray_A = pa.theta + pa.mu
					point_A = pa.position
				}
			}
			else{
				if (point_int == 0){
					//this one will collide with the sonic line. 
					point_A = sonic_line[0]
					ray_A = 0
				}
				else{
					//this one will colide with another raycast
					pa = final_points_list[final_points_list.length-1]
					point_A = pa.position
					ray_A = pa.theta + pa.mu
				}
				pb = final_points_list[final_points_list.length - length_prev]
				point_B = pb.position
				ray_B = pb.theta - pb.mu
			}

			var ld_a = lengthdir(ray_distance,ray_A)
			var ld_b = lengthdir(ray_distance,ray_B)

			var intersect = segment_intersection(
				point_A,{x:point_A.x+ld_a.x,y:point_A.y+ld_a.y},
				point_B,{x:point_B.x+ld_b.x,y:point_B.y+ld_b.y})

			var noz_point = false
			if (point_int == ray.int_points.length-1){
				noz_point = true}

			final_points_list.push({position:intersect,theta:point.theta,mu:point.mu,A:copy(point_A),B:copy(point_B),nozzle:noz_point,fan_ind:ray_int,ray_ind:point_int})
		})
	})

	nozzle_points = [{pos:{x:0,y:0},dir:29.265,ray_A:29.265,prev_angle:29.265}]
	final_points_list.forEach(function(point,int){
		if (point.nozzle){
			//point A is the previous nozzle position
			var pa = nozzle_points[nozzle_points.length-1]
			var ray_A = (point.theta+pa.prev_angle)/2
			var point_A = pa.pos
			var ld_a = lengthdir(ray_distance,ray_A)

			//point B is the raycast MoC point
			var pb = point;
			var ray_B = point.theta+point.mu
			var point_B = point.position;
			var ld_b = lengthdir(ray_distance,ray_B)

			var intersect = segment_intersection(
				point_A,{x:point_A.x+ld_a.x,y:point_A.y+ld_a.y},
				point_B,{x:point_B.x+ld_b.x,y:point_B.y+ld_b.y})

			//note: This uses nick's "theta-only measurement." I beleive dir should be an average of two angles.
			if (typeof intersect.x == "undefined")
				console.log("undefined point. Angle difference: "+angle_difference(ray_A,ray_B)+" Ray A: "+ray_A+" Ray B: "+ray_B+" Point_theta: "+point.theta+" Point.mu: "+point.mu+" Fan ID: "+point.fan_ind+" ray ID: "+point.ray_ind )
			else
				console.log("Defined point. Angle difference: "+angle_difference(ray_A,ray_B)+" Ray A: "+ray_A+" Ray B: "+ray_B+" Point_theta: "+point.theta+" Point.mu: "+point.mu+" Fan ID: "+point.fan_ind+" ray ID: "+point.ray_ind )
			nozzle_points.push({pos:intersect,seed:copy(point_B),prev_angle:point.theta})
		}

	})
}

function log_points(points){
	str = ""
	points.forEach(function(item,ind){
		str += item.theta+"	"+item.nu+"	"+item.mach+"	"+item.mu+"\n"
	})
	console.log(str)
}