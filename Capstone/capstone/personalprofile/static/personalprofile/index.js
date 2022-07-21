document.addEventListener('DOMContentLoaded', function() {
	
	// Use buttons to toggle between views
    document.querySelector('#we_btn').addEventListener('click', () => workexp_view(1));
	document.querySelector('#proj_btn').addEventListener('click', () => projects_view(1));
	document.querySelector('#blog_btn').addEventListener('click', () => blogs_view());

    // By default, load the inbox
    home_view();


})	

function home_view(){
	console.log("loading home view");
	document.querySelector('#homeview').style.display = 'block';
    document.querySelector('#weview').style.display = 'none';
	document.querySelector('#projview').style.display = 'none';
	document.querySelector('#courseview').style.display = 'none';
	document.querySelector('#blogview').style.display = 'none';
	
}
	
	
function workexp_view(workexp_pageno){
	
	console.log("loading work exp view");
	document.querySelector('#prev_nxt_btn').innerHTML = '';
	document.querySelector('#homeview').style.display = 'none';
    document.querySelector('#weview').style.display = 'block';
	document.querySelector('#weview').innerHTML = '';
	document.querySelector('#projview').style.display = 'none';
	document.querySelector('#courseview').style.display = 'none';
	document.querySelector('#blogview').style.display = 'none';
	
	workexperience = document.createElement('h3');
	workexperience.innerHTML = "Work Experience";
	document.querySelector('#weview').append(workexperience);
	
	fetch(`/workexp/${workexp_pageno}`)
	.then(response => response.json())
	.then(data => {
		data.workexps.forEach(workexp => {
			workexp_list_view(workexp);
		})
		
		//PrevPage - NxtPage
		const workexps_prev_nxt = document.querySelector('#prev_nxt_btn');
			
		const workexps_nxt_btn = document.createElement('button');
		workexps_nxt_btn.className = "nxt_btn";
		workexps_nxt_btn.innerHTML = "Next Page";
		
		const workexps_prev_btn = document.createElement('button');
		workexps_prev_btn.className = "prev_btn";
		workexps_prev_btn.innerHTML = "Previous Page";
		
		workexps_prev_nxt.append(workexps_prev_btn);
		workexps_prev_nxt.append(workexps_nxt_btn);
		
		workexps_prev_btn.addEventListener('click', () => {
			document.querySelector('#weview').innerHTML="";
			workexp_pageno = workexp_pageno - 1;
			workexp_view(workexp_pageno);
			workexps_prev_btn.style.display='none';
			workexps_nxt_btn.style.display='none';
		});
		
		workexps_nxt_btn.addEventListener('click', () => {
			document.querySelector('#weview').innerHTML="";
			workexp_pageno = workexp_pageno + 1;
			workexp_view(workexp_pageno);
			workexps_prev_btn.style.display='none';
			workexps_nxt_btn.style.display='none';
		});
		
		
		if(data.page.has_next) {
			workexps_nxt_btn.style.display='block';
		}
		else{
			workexps_nxt_btn.style.display='none';
		}
			
		if(data.page.has_previous) {
			workexps_prev_btn.style.display='block';
		}
		else{
			workexps_prev_btn.style.display='none';
		}
		
	});
	
}

function workexp_list_view(workexp){
	we_view = document.querySelector('#weview');
	
	we_cont = document.createElement('div');
	we_cont.className = "we_cont";
	
	we_H = document.createElement('div');
	we_title = document.createElement('h4');
	we_title.innerHTML = workexp.title;
	
	we_loc = document.createElement('b');
	we_loc.innerHTML = workexp.loc+'<br>';
	
	we_duration = document.createElement('i');
	we_duration.innerHTML = workexp.duration;
	
	we_H.append(we_title);
	we_H.append(we_loc);
	we_H.append(we_duration);
	
	we_D = document.createElement('div');
	we_desc_header = document.createElement('h5');
	we_desc_header.innerHTML = "Activities:";
	we_desc = document.createElement('ul');
	workexpdescs = workexp.desc.split(";");
	workexpdescs.forEach(workexpdesc => {
		we_desc_item = document.createElement('li');
		we_desc_item.innerHTML = workexpdesc
		we_desc.append(we_desc_item);
	});
	we_D.append(we_desc_header);
	we_D.append(we_desc);
	
	we_M = document.createElement('div');
	we_mt_header = document.createElement('h5');
	we_mt_header.innerHTML = "Major Takeaways:";
	we_mt = document.createElement('ul');
	workexpMTs = workexp.mt.split(";");
	workexpMTs.forEach(workexpMT => {
		we_mt_item = document.createElement('li');
		we_mt_item.innerHTML = workexpMT
		we_mt.append(we_mt_item);
	});
	we_M.append(we_mt_header);
	we_M.append(we_mt);
	
	we_cont.append(we_H);
	we_cont.append(we_D);
	we_cont.append(we_M);
	if(workexp.url){
		we_url_cont = document.createElement('div');
		we_url = document.createElement('a');
		we_url.innerHTML = "Link";
		we_url.href = workexp.url
		we_url_cont.append(we_url);
		we_cont.append(we_url_cont);
	}
	
	we_view.append(we_cont);
}

function projects_view(proj_pageno){
	console.log("loading projects view");
	document.querySelector('#prev_nxt_btn').innerHTML = '';
	document.querySelector('#homeview').style.display = 'none';
    document.querySelector('#weview').style.display = 'none';
	document.querySelector('#projview').style.display = 'block';
	document.querySelector('#projview').innerHTML = '';
	document.querySelector('#courseview').style.display = 'none';
	document.querySelector('#blogview').style.display = 'none';
	
	
	projects = document.createElement('h3');
	projects.innerHTML = "Projects";
	document.querySelector('#projview').append(projects);
	
	fetch(`/projects/${proj_pageno}`)
	.then(response => response.json())
	.then(data => {
		data.projs.forEach(proj => {
			project_list_view(proj);
		})
		
		//PrevPage - NxtPage
		const projs_prev_nxt = document.querySelector('#prev_nxt_btn');
			
		const projs_nxt_btn = document.createElement('button');
		projs_nxt_btn.className = "nxt_btn";
		projs_nxt_btn.innerHTML = "Next Page";
		
		const projs_prev_btn = document.createElement('button');
		projs_prev_btn.className = "prev_btn";
		projs_prev_btn.innerHTML = "Previous Page";
		
		projs_prev_nxt.append(projs_prev_btn);
		projs_prev_nxt.append(projs_nxt_btn);
		
		projs_prev_btn.addEventListener('click', () => {
			document.querySelector('#projview').innerHTML="";
			proj_pageno = proj_pageno - 1;
			projects_view(proj_pageno);
			projs_prev_btn.style.display='none';
			projs_nxt_btn.style.display='none';
		});
		
		projs_nxt_btn.addEventListener('click', () => {
			document.querySelector('#projview').innerHTML="";
			proj_pageno = proj_pageno + 1;
			projects_view(proj_pageno);
			projs_prev_btn.style.display='none';
			projs_nxt_btn.style.display='none';
		});
		
		
		if(data.page.has_next) {
			projs_nxt_btn.style.display='block';
		}
		else{
			projs_nxt_btn.style.display='none';
		}
			
		if(data.page.has_previous) {
			projs_prev_btn.style.display='block';
		}
		else{
			projs_prev_btn.style.display='none';
		}
		
	});
}

function project_list_view(proj){
	proj_view = document.querySelector('#projview');

	proj_cont = document.createElement('div');
	proj_cont.className = "proj_cont";
	
	proj_H = document.createElement('div');
	proj_title = document.createElement('h4');
	proj_title.innerHTML = proj.title+'<br>';
	
	proj_duration = document.createElement('i');
	proj_duration.innerHTML = proj.duration;
	
	proj_H.append(proj_title);
	proj_H.append(proj_duration);
	
	proj_D = document.createElement('div');
	proj_desc_header = document.createElement('h5');
	proj_desc_header.innerHTML = "Activities:";
	proj_desc = document.createElement('ul');
	projdescs = proj.desc.split(";");
	projdescs.forEach(projdesc => {
		proj_desc_item = document.createElement('li');
		proj_desc_item.innerHTML = projdesc
		proj_desc.append(proj_desc_item);
	});
	proj_D.append(proj_desc_header);
	proj_D.append(proj_desc);
	
	proj_M = document.createElement('div');
	proj_mt_header = document.createElement('h5');
	proj_mt_header.innerHTML = "Major Takeaways:";
	proj_mt = document.createElement('ul');
	projMTs = proj.mt.split(";");
	projMTs.forEach(projMT => {
		proj_mt_item = document.createElement('li');
		proj_mt_item.innerHTML = projMT
		proj_mt.append(proj_mt_item);
	});
	proj_M.append(proj_mt_header);
	proj_M.append(proj_mt);
	
	
	if(proj.img_url){
		proj_img_cont = document.createElement('div');
		proj_img = document.createElement('img');
		proj_img.className = "proj_img";
		proj_img.src = proj.img_url;
		proj_img_cont.append(proj_img);
		proj_cont.append(proj_img_cont);
	}
	proj_cont.append(proj_H);
	proj_cont.append(proj_D);
	proj_cont.append(proj_M);
	if(proj.url){
		proj_url_cont = document.createElement('div');
		proj_url = document.createElement('a');
		proj_url.innerHTML = "Link";
		proj_url.href = proj.url
		proj_url_cont.append(proj_url);
		proj_cont.append(proj_url_cont);
	}
	
	proj_view.append(proj_cont);
}

function blogs_view(){
	console.log("loading blogs view");
	document.querySelector('#prev_nxt_btn').innerHTML = '';
	document.querySelector('#homeview').style.display = 'none';
    document.querySelector('#weview').style.display = 'none';
	document.querySelector('#projview').style.display = 'none';
	document.querySelector('#courseview').style.display = 'none';
	document.querySelector('#blogview').style.display = 'block';
	document.querySelector('#blogview').innerHTML = '';
	
	blogs = document.createElement('h3');
	blogs.innerHTML = "Blogs";
	document.querySelector('#blogview').append(blogs);
	
	fetch(`/blogs`)
	.then(response => response.json())
	.then(blogs => {
		blogs.forEach(blog => {
			blog_list_view(blog);
		})
	});
	
}

function blog_list_view(blog){
	blog_view = document.querySelector('#blogview')
	
	blog_cont = document.createElement('div');
	blog_cont.className = "blog_cont";
	
	blog_H = document.createElement('div');
	blog_titlepic = document.createElement('img');
	blog_titlepic.className = "blog_titlepic";
	blog_titlepic.src = blog.img_url;
	
	blog_title = document.createElement('h4');
	blog_title.innerHTML = blog.title+'<br>';
	
	blog_time = document.createElement('i');
	blog_time.className = "blog_time";
	blog_time.innerHTML = blog.timestamp;
	
	blog_H.append(blog_titlepic);
	blog_H.append(blog_title);
	blog_H.append(blog_time);
	
	blog_D = document.createElement('div');
	blog_desc = document.createElement('p');
	blog_desc.className = "blog_desc";
	blog_desc.innerHTML = blog.desc;
	
	blog_D.append(blog_desc);
	
	blog_cont.append(blog_H);
	blog_cont.append(blog_D);
	
	blog_view.append(blog_cont);
	
	blog_cont.addEventListener('click', () => {
		viewtheblog(blog);
	});
}

function viewtheblog(blog){
	blog_view = document.querySelector('#blogview')
	
	blog_view.innerHTML = '';
	
	blog_cont = document.createElement('div');
	blog_cont.className = "blogdet_cont";
	
	blog_H = document.createElement('div');
	blog_titlepic = document.createElement('img');
	blog_titlepic.className = "blog_titlepic";
	blog_titlepic.src = blog.img_url;
	
	blog_title = document.createElement('h4');
	blog_title.innerHTML = blog.title+'<br>';
	
	blog_time = document.createElement('i');
	blog_time.className = "blog_time";
	blog_time.innerHTML = blog.timestamp;
	
	blog_H.append(blog_titlepic);
	blog_H.append(blog_title);
	blog_H.append(blog_time);
	
	blog_D = document.createElement('div');
	blog_desc = document.createElement('p');
	blog_desc.className = "blog_desc";
	blog_desc.innerHTML = blog.desc;
	
	blog_D.append(blog_desc);
	
	blog_B = document.createElement('div');
	blog_body = document.createElement('p');
	blog_body.className = 'blog_body';
	blog_body.innerHTML = blog.body;
	
	blog_B.append(blog_body);
	
	if(blog.blogimg_url){
		blogimgs = document.createElement('div');
		blogimgs.className = 'blogimgs';
		blogimgurls = blog.blogimg_url.split(";");
		blogimgurls.forEach(blogimgurl => {
			blogimg = document.createElement('img');
			blogimg.className = 'blogimg';
			blogimg.src = blogimgurl;
			blogimgs.append(blogimg);
		});
		blog_B.append(blogimgs);
	}
		
	blog_bodyclose = document.createElement('button');
	blog_bodyclose.innerHTML = 'btn btn-primary closeblogbodybtn';
	blog_bodyclose.innerHTML = 'Close';
	
	blog_B.append(blog_bodyclose);
	
	blog_cont.append(blog_H);
	blog_cont.append(blog_D);
	blog_cont.append(blog_B);
	
	blog_view.append(blog_cont);
	
	blog_bodyclose.addEventListener('click', () => {
		blogs_view();
	});
}
















