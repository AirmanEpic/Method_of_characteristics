pt_count = 0
function generate_fan(fan_start,fan_end,n){
	var fan_rays = [];
	//fan_rays are seed angles, essentially. They start at fan_start (i=0) and go until fan_end (i=n)
	for (var i=0; i<n; i++){
		fan_rays.push({seed_theta:lerp(fan_start,fan_end,i/(n-1))})
	}

	supposed_delta_theta = ((fan_rays[2].seed_theta-fan_rays[1].seed_theta)*2)

	fan_points = generate_int_angles(fan_rays,n-1,fan_start,supposed_delta_theta)
	return {rays: fan_rays, points:fan_points}
}

function generate_int_angles(fan,n_a,fan_start_a,delta_theta){
	//console.log("Delta theta: "+delta_theta)
	current_kp = 0;
	fan.forEach(function(item,ind){
		kp = current_kp
		if (ind==0)
			current_kp+=(delta_theta+(fan[0].seed_theta*2))
		else
			current_kp+=(delta_theta)

		item.int_points = []
	
		for (var i=0; i<((n_a-ind)+1); i++){
			if (ind!=0)
				theta = lerp(fan[0].seed_theta,fan[fan.length-1].seed_theta,(i)/(n_a))-fan[0].seed_theta
			else
				theta = lerp(fan[0].seed_theta,fan[fan.length-1].seed_theta,(i)/(n_a))

			nu = theta + kp;
			dat = find_values([nu])[0]
			item.int_points.push({
				theta:theta,
				nu:nu,
				mach:dat.M,
				mu:dat.mu
			})
			pt_count +=1
		}
		nu = item.int_points[item.int_points.length-1].nu
		dat = find_values([nu])[0]
		item.end_point = {theta:item.int_points[item.int_points.length-1].theta,nu:nu,mach:dat.M,mu:dat.mu};
		pt_count+=1
	})

	gross_points = []

	fan.forEach(function(item,ind){
		item.int_points.forEach(function(item_int,ind_int){
			gross_points.push(item_int)
		})
	})

	return gross_points;
}


//fan_count = 10
//fan_thetas = generate_fan(0.265,29.265,fan_count+1);

