function x_rotation(x, y, z, dir)
{
	xout = x
	yout = y
	zout = z

	//matrix multiplication times the x transformation matrix. https://en.wikipedia.org/wiki/Rotation_matrix
	xout = x
	yout = (Math.cos(dir) * y) - (Math.sin(dir) * z)
	zout = (Math.sin(dir) * y) + (Math.cos(dir) * z)

	//zout=z
	return {x:xout, y:yout, z:zout}
}

function y_rotation(x, y, z, dir)
{
	xout = x
	yout = y
	zout = z

	//matrix multiplication times the x transformation matrix. https://en.wikipedia.org/wiki/Rotation_matrix
	xout = (Math.cos(dir)*x) + (Math.sin(dir)*z)
	yout = y
	zout = (-Math.sin(dir)*x) + (Math.cos(dir)*z);

	//zout=z
	return {x:xout, y:yout, z:zout}
}

function z_rotation(x, y, z, dir)
{
	xout = x
	yout = y
	zout = z

	//matrix multiplication times the x transformation matrix. https://en.wikipedia.org/wiki/Rotation_matrix
	xout = (Math.cos(dir) * x)  + (Math.sin(dir) * y);
	yout = -(Math.sin(dir) * x) + (Math.cos(dir) * y);
	zout = z

	//zout=z
	return {x:xout, y:yout, z:zout}
}

function sort_by_avg_depth(a,b)
{
	depth_a = (a.verts[0].z+a.verts[1].z+a.verts[2].z)/3
	depth_b = (b.verts[0].z+b.verts[1].z+b.verts[2].z)/3

	return depth_a-depth_b;
}

function draw_sprite_rotated(sprite,pos,angle,subimage,x_flip,y_flip){
	subimage = Math.floor(Math.max(0,subimage))
	ctx.translate(pos.x-vpos.x,pos.y-vpos.y);
	ctx.rotate(dtr(-angle));
	ctx.scale(x_flip,y_flip)
	ctx.drawImage(sprite.image,sprite.width*subimage,0,sprite.width,sprite.height,-sprite.origin_x,-sprite.origin_y,sprite.width,sprite.height)
	ctx.scale(x_flip,y_flip)
	ctx.rotate(dtr(angle));	
	ctx.translate(-(pos.x-vpos.x),-(pos.y-vpos.y));
}

function draw_text_rotated(text,col,pos,angle,align){
	//subimage = Math.floor(Math.max(0,subimage))
	ctx.translate(pos.x,pos.y);
	ctx.rotate(dtr(-angle));
	ctx.textAlign=align
	ctx.fillStyle=col;
	ctx.fillText(text,0,0)
	ctx.rotate(dtr(angle));	
	ctx.translate(-(pos.x),-(pos.y));
}


function lengthdir(dis, dir)
{
	var xp=Math.cos(dtr(-dir)) * dis 
	var yp=Math.sin(dtr(-dir)) * dis

	return {x:xp, y:yp}
}
//point in un-rotated box
function collision_check(point,min_x,max_x,min_y,max_y)
{
	ret=false;

	if (point.x>min_x && point.x<max_x && point.y>min_y && point.y<max_y)
	ret=true;

	return ret;
}

function is_in_triangle (p,a,b,c){

	//credit: http://www.blackpawn.com/texts/pointinpoly/default.html

	var v0 = [c.x-a.x,c.y-a.y];
	var v1 = [b.x-a.x,b.y-a.y];
	var v2 = [p.x-a.x,p.y-a.y];

	var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
	var dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
	var dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
	var dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
	var dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);

	var invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

	var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

	return ((u >= 0) && (v >= 0) && (u + v < 1));
}

function lerp_distance(p1,p2,dis)
{
	var ret_x=p1.x+(((p2.x-p1.x)*dis)/point_distance(p1,p2));
	var ret_y=p1.y+(((p2.y-p1.y)*dis)/point_distance(p1,p2));

	return {x:ret_x,y:ret_y};
}

function lerp_2d(pos1,pos2,perc)
{
	var ret_x=pos1.x+((pos2.x-pos1.x)*perc)
	var ret_y=pos1.y+((pos2.y-pos1.y)*perc)

	return {x:ret_x,y:ret_y}
}

function angle_difference(x,y)
{
	var res=Math.atan2(Math.sin(dtr(x-y)), Math.cos(dtr(x-y)))
	return rtd(res)
}

function point_direction(p1,p2)
{
	return rtd(Math.atan2(p2.y - p1.y, p2.x - p1.x));
}
function dtr(inp)
{
	return ((inp*Math.PI)/180)
}

function rtd(inp)
{
	return (inp/Math.PI)*180
}

function point_distance(p1,p2)
{
	var dis=Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));
	return dis;
}

function i_lerp_d(pos1,pos2,pos_x)
{
	//inverse lerp
	var perc=(pos_x-pos1)/(pos2-pos1)

	return perc
}

function lerp_d(pos1,pos2,perc)
{
	var ret_x=pos1+((pos2-pos1)*perc)

	return ret_x
}
var eps = 0.0000001;

function between(a, b, c) {
    return a-eps <= b && b <= c+eps;
}


function segment_intersection(p1,p2, p3,p4) {
	x1=p1.x
	y1=p1.y

	x2=p2.x
	y2=p2.y

	x3=p3.x
	y3=p3.y

	x4=p4.x
	y4=p4.y

    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4)) /
            ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4)) /
            ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    if (isNaN(x)||isNaN(y)) {
        return false;
    } else {
        if (x1>=x2) {
            if (!between(x2, x, x1)) {return false;}
        } else {
            if (!between(x1, x, x2)) {return false;}
        }
        if (y1>=y2) {
            if (!between(y2, y, y1)) {return false;}
        } else {
            if (!between(y1, y, y2)) {return false;}
        }
        if (x3>=x4) {
            if (!between(x4, x, x3)) {return false;}
        } else {
            if (!between(x3, x, x4)) {return false;}
        }
        if (y3>=y4) {
            if (!between(y4, y, y3)) {return false;}
        } else {
            if (!between(y3, y, y4)) {return false;}
        }
    }
    return {x: x, y: y};
}

function col_poly_on_poly(a,b){
	var ret=false;
	for (var i=0; i<a.length-1; i++)
	{	
		for (var ii=0; ii<b.length-1; ii++)
		{
			if (!ret)
			{
				SI=segment_intersection(a[i],a[i+1] , b[ii],b[ii+1])
				if (SI)
				{
					ret=true;
				}
			}
		}
	}
	return ret;
}

function check_for_match(pos,list)
{
	var match=false;
	if (list.length!=0)
	{
		for (var i=0; i<list.length; i++)
		{
			if (list[i].x==pos.x && list[i].y==pos.y)
			match=true;
		}
	}
	return match
}

function point_in_polygon(polygon, point){
	avgpnt = {x:0,y:0}
	for (var i=0; i<polygon.length; i++)
	{
		avgpnt.x+=polygon[i].x;
		avgpnt.y+=polygon[i].y;
	}

	avgpnt.x/=polygon.length;
	avgpnt.y/=polygon.length;
	//we should have the average points of the polygon, which with any luck will be inside the polygon.

	var col=true;

	for (var i=0; i<polygon.length-1; i++)
	{
		if (segment_intersection(polygon[i],polygon[i+1],avgpnt,point))
		{
			col=false;
		}
	}

	if (segment_intersection(polygon[0],polygon[polygon.length-1],avgpnt,point))
		{
			col=false;
		}

	return col;
}

function ray_intersects_polygon(polygon, ray1, ray2){

	var col=false;

	for (var i=0; i<polygon.length-1; i++)
	{
		if (segment_intersection(polygon[i],polygon[i+1],ray1,ray2))
		{
			col=segment_intersection(polygon[i],polygon[i+1],ray1,ray2);
			col.i = i;
		}
	}

	if (segment_intersection(polygon[0],polygon[polygon.length-1],ray1,ray2))
		{
			col=segment_intersection(polygon[0],polygon[polygon.length-1],ray1,ray2)
			col.i = 0;
		}

	return col;
}

function choose(ar){
	pos = Math.floor(Math.random()*ar.length);
	return ar[pos];
}

function collision_rects(rect1,rect2)
{
	ret=false
	return !(rect2.min_x > rect1.min_x+rect1.w || 
           rect2.min_x+rect2.w < rect1.min_x || 
           rect2.min_y > rect1.min_y+rect1.h ||
           rect2.min_y+rect2.h < rect1.min_y);

}

function generate_rectangle(x,y,rot,h,w)
{
	var new_shape=[]
	//rectangle
	height 	= h;
	width 	= w;
	rotate 	= rot;

	v1 = lengthdir(height,rotate);
	v2 = lengthdir(width,rotate+90);

	new_shape.push({x:x+v1.x+v2.x,y:y+v1.y+v2.y})
	new_shape.push({x:x-v1.x+v2.x,y:y-v1.y+v2.y})
	new_shape.push({x:x-v1.x-v2.x,y:y-v1.y-v2.y})
	new_shape.push({x:x+v1.x-v2.x,y:y+v1.y-v2.y})
	
	return new_shape;
}

function copy(org)
{
	return JSON.parse(JSON.stringify(org))
}

function blur(map,radius){
	var r = radius;

	var chnl = map_to_channel(map)

	blurred = gaussBlur_2(chnl, map.length, map.length, r);

	var n_map = channel_to_map(blurred,map.length);

	map=n_map;

	return map;
}

function compute_centroids(diag){
	cents =[];
	for (var i=0; i<diag.length; i++)
	{
		t_x = 0
		t_y = 0;
		for (var ii=0; ii<diag[i].length; ii++)
		{
			t_x+=diag[i][ii].x;
			t_y+=diag[i][ii].y;
		}

		t_x /= diag[i].length;
		t_y /= diag[i].length;

		cents.push({x:t_x,y:t_y});
	}
	return cents;
}

function closest_projection(polygon,point,closed)
{
	var dist_min = 10000;
	var   id_min = 0;
	//console.log("length: "+polygon.length)
	for (var i=0; i<polygon.length; i++)
	{
		var start = polygon[i];
		var end = {}
		if (polygon[i+1])
		{
			end = polygon[i+1];
			looped_segment = false;
		}
		else
		{
			end = polygon[0];
			looped_segment = true;
		}

		var proj = project_real(start,end,point)

		perc = find_lerped_perc(start,end,proj)
		var proj = {}
		proj_is_extreme = false;
		if (perc>1 || perc<0)
		{

			if (perc>1)
				proj = end
			else
				proj = start;
			proj_is_extreme = true;
		}
		else
		{
			proj = project_real(start,end,point)
		}

		var dist = point_distance(proj,point);

		if (dist<dist_min && ((looped_segment && closed) || (!looped_segment)))
		{
			id_min = i;
			min_proj = proj;
			dist_min = dist;
			is_extreme = proj_is_extreme;
			final_perc = perc;
			best_start = start;
			best_end = end; 
		}
	}

	return {id: id_min, proj:min_proj, dis:dist_min,end:best_end, start:best_start, perc:final_perc}
}

function find_lerped_perc(start,end,point){
	var perc = i_lerp_d(start.x,end.x,point.x)
	if (start.x==end.x)
	{
		perc = i_lerp_d(start.y,end.y,point.y)
	}
	if (start.y==end.y)
	{
		perc = i_lerp_d(start.x,end.x,point.x)
	}

	return perc
}

function project_distance(l1,l2,p){
	x1 = l1.x;
	y1 = l1.y;
	x2 = l2.x;
	y2 = l2.y;
	x0 = p.x;
	y0 = p.y;

	toplevel = Math.abs((y2-y1)*x0 - (x2-x1)*y0 + x2*y1 - y2*x1)
	bottom = Math.sqrt(Math.pow(y2-y1,2) + Math.pow(x2-x1,2));

	return toplevel/bottom;

	//note! this may exceed limits of line.
}

function project_real(l1,l2,p){
	vx = p.x - l1.x;
	vy = p.y - l1.y;
	v = {x:vx,y:vy}

	sx = l2.x - l1.x;
	sy = l2.y - l1.y;
	s = {x:sx,y:sy}

	num = dot(v,s);
	den = dot(s,s);

	tot = num/den;
	return {x:(sx*tot)+l1.x,y:(sy*tot)+l1.y};
}

function dot(a,b){
	return( a.x*b.x)+(a.y*b.y)
}

