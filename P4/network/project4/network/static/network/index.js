document.addEventListener('DOMContentLoaded', function() {
	const cur_username = document.querySelector('#cur_username');
	let currentusername = cur_username.innerHTML;
	
	// Use buttons to toggle between views
	cur_username.addEventListener('click', () => userpage_view(cur_username.innerHTML,currentusername, 1));
	document.querySelector('#following').addEventListener('click', () => userfollowing(currentusername, 1));
	
	// Default view
	all_posts(currentusername, 1);
});

function all_posts(currentusername, allposts_pageno) {
	console.log("loading all posts");
	document.querySelector('#newpost').style.display = 'block';
    document.querySelector('#allposts').style.display = 'block';
	document.querySelector('#followedposts').style.display = 'none';
	document.querySelector('#userpage').style.display = 'none';
	
	fetch(`/allposts/${allposts_pageno}`)
	.then(response => response.json())
	.then(data => {
		data.posts.forEach(post => {
			post_list_view(post,currentusername,"allposts");
		})	
		//PrevPage - NxtPage
		const allposts_prev_nxt = document.querySelector('#prev_nxt_btn');
			
		const allposts_nxt_btn = document.createElement('button');
		allposts_nxt_btn.className = "nxt_btn";
		allposts_nxt_btn.innerHTML = "Next Page";
		
		const allposts_prev_btn = document.createElement('button');
		allposts_prev_btn.className = "nxt_btn";
		allposts_prev_btn.innerHTML = "Previous Page";
		
		allposts_prev_nxt.append(allposts_prev_btn);
		allposts_prev_nxt.append(allposts_nxt_btn);
		
		allposts_prev_btn.addEventListener('click', () => {
			document.querySelector('#allposts').innerHTML="";
			allposts_pageno = allposts_pageno - 1;
			all_posts(currentusername, allposts_pageno);
			allposts_prev_btn.style.display='none';
			allposts_nxt_btn.style.display='none';
		});
		
		allposts_nxt_btn.addEventListener('click', () => {
			document.querySelector('#allposts').innerHTML="";
			allposts_pageno = allposts_pageno + 1;
			all_posts(currentusername, allposts_pageno);
			allposts_nxt_btn.style.display='none';
			allposts_prev_btn.style.display='none';
		});
		
		
		if(data.page.has_next) {
			allposts_nxt_btn.style.display='block';
		}
		else{
			allposts_nxt_btn.style.display='none';
		}
			
		if(data.page.has_previous) {
			allposts_prev_btn.style.display='block';
		}
		else{
			allposts_prev_btn.style.display='none';
		}
			
			
		
	});
	
	
}


function post_list_view(post,currentusername,appendview){
	
	
	//Container for all post boxes
	const allposts = document.querySelector('#allposts');
	
	//Container for post info
	const post_box = document.createElement('div');
	post_box.className = 'postbox';
	
	const post_info = document.createElement('div');
	
	const post_user = document.createElement('h4');
	post_user.innerHTML = post.user;
	post_user.addEventListener('click', () => {
		userpage_view(post.user,currentusername,1);
	});
	
	const post_time = document.createElement('i');
	post_time.className = 'post_time';
	post_time.innerHTML = post.timestamp;
	
	const post_body = document.createElement('div');
	post_body.className = 'post_body';
	post_body.innerHTML = post.body;
	
	const post_editlink = document.createElement('div');
	post_editlink.className = 'post_editlink';
	post_editlink.innerHTML = 'Edit';
	
	// Like display
	const l_btn = document.createElement('button');
	l_btn.innerHTML = 'Like Post';
	l_btn.className = 'btn btn-sm btn-outline-success like_button';
	const u_btn = document.createElement('button');
	u_btn.innerHTML = 'Unlike Post';
	u_btn.className = 'btn btn-sm btn-outline-danger unlike_button';
	const l_disp = document.createElement('div');
	l_disp.innerHTML = post.postlikecount + " Likes";
	
	
	// Edit post
	if (currentusername === post.user){
		post_editlink.addEventListener('click', () => {
			console.log("Post can be edited");
			const editdisp = document.createElement("div");
			
			const editarea = document.createElement("textarea");
			editarea.className = "editarea";
			editarea.maxLength = "5000";
			editarea.cols = "80";
			editarea.rows = "6";
			
			const editbtn = document.createElement("button");
			editbtn.className = 'btn btn-outline-secondary editbtn';
			editbtn.innerHTML = "Edit post";
			
			editdisp.append(editarea);
			editdisp.append(editbtn);
			post_info.append(editdisp);
			post_editlink.style.display='none';
			
			editbtn.addEventListener('click', () => {
				edit(post,editarea);
				editdisp.innerHTML="";
				post_editlink.style.display='block';
				post_body.innerHTML = editarea.value;
				console.log('post edited');
			});
		});
	}
	else{
		post_editlink.addEventListener('click', () => {
			console.log("Post cannot be edited");
			
			const errordisp = document.createElement("div");
			
			const edit_errordisp = document.createElement("div");
			edit_errordisp.className = 'edit_errordisp';
			edit_errordisp.innerHTML = `${currentusername} not authorized to edit ${post.user}'s post.`;
			errordisp.append(edit_errordisp);
			
			const removeerrormsg = document.createElement("button");
			removeerrormsg.className = 'btn btn-outline-secondary removeerrormsg';
			removeerrormsg.innerHTML = "OK";
			
			errordisp.append(removeerrormsg);
			post_info.append(errordisp);
			post_editlink.style.display='none';
			
			removeerrormsg.addEventListener('click', () => {
				errordisp.innerHTML="";
				post_editlink.style.display='block';
			});
		});
	}
	
	
	if (post.postlikers.includes(currentusername)){
		console.log(`Post ${post.id} already liked by user`);
		u_btn.style.display = 'block';
		l_btn.style.display = 'none';
	}
	else {
		console.log(`Post ${post.id} not yet liked by user`);
		u_btn.style.display = 'none';
		l_btn.style.display = 'block';
	}
	
	// Like post
	l_btn.addEventListener('click', () => {
		like(post);
		let newlikeval = parseInt(l_disp.innerHTML) + 1;
		l_disp.innerHTML = `${newlikeval} Likes`;
		u_btn.style.display = 'block';
		l_btn.style.display = 'none';
	});
	
	// Unlike post
	u_btn.addEventListener('click', () => {
		unlike(post);
		let newlikeval = parseInt(l_disp.innerHTML) - 1;
		l_disp.innerHTML = `${newlikeval} Likes`;
		u_btn.style.display = 'none';
		l_btn.style.display = 'block';
	});
	
	// Add elements to post_info
	post_info.append(post_user);
	post_info.append(post_time);
	post_info.append(post_editlink);
	post_info.append(post_body);
	if (post.pic_url){
		const post_img = document.createElement('img');
		post_img.className = 'post_img';
		post_img.src = post.pic_url;
		post_info.append(post_img);
	}
	
	
	// Add elements to post_listbox
	post_box.append(post_info);
	post_box.append(l_btn);
	post_box.append(u_btn);
	post_box.append(l_disp);
	
    // Add email_listbox to DOM
    document.querySelector(`#${appendview}`).append(post_box);
}

function like(post){
	fetch(`/likepost/${post.id}`, {
		method: 'POST',
		body: JSON.stringify({
		})
	});
}

function unlike(post){
	fetch(`/unlikepost/${post.id}`, {
		method: 'POST',
		body: JSON.stringify({
		})
	});
}

function userpage_view(usrname,currentusername, userposts_pageno){
	document.querySelector('#prev_nxt_btn').innerHTML="";
	fetch(`/userpage/${usrname}/${userposts_pageno}`)
	.then(response => response.json())
	.then(data => {
		userpage(usrname, currentusername, data.countdets, data.userIsReqUser, data.posts, data.reqUserFollowsUser);
		
		//document.querySelector('#followedposts').style.display = 'block';
			
		//PrevPage - NxtPage
		const userposts_prev_nxt = document.querySelector('#prev_nxt_btn');
				
		const userposts_nxt_btn = document.createElement('button');
		userposts_nxt_btn.className = "nxt_btn";
		userposts_nxt_btn.innerHTML = "Next Page";
			
		const userposts_prev_btn = document.createElement('button');
		userposts_prev_btn.className = "prev_btn";
		userposts_prev_btn.innerHTML = "Previous Page";
			
		userposts_prev_nxt.append(userposts_prev_btn);
		userposts_prev_nxt.append(userposts_nxt_btn);
			
		userposts_prev_btn.addEventListener('click', () => {
			document.querySelector('#userpage').innerHTML="";
			userposts_pageno = userposts_pageno - 1;
			userpage_view(usrname, currentusername, userposts_pageno);
			userposts_prev_btn.style.display='none';
			userposts_nxt_btn.style.display='none';
		});
			
		userposts_nxt_btn.addEventListener('click', () => {
			document.querySelector('#userpage').innerHTML="";
			userposts_pageno = userposts_pageno + 1;
			userpage_view(usrname, currentusername, userposts_pageno);
			userposts_nxt_btn.style.display='none';
			userposts_prev_btn.style.display='none';
		});
			
			
		if(data.page.has_next) {
			userposts_nxt_btn.style.display='block';
		}
		else{
			userposts_nxt_btn.style.display='none';
		}
			
		if(data.page.has_previous) {
			userposts_prev_btn.style.display='block';
		}
		else{
			userposts_prev_btn.style.display='none';
		}
		
		//document.querySelector('#disp').append(userposts_prev_nxt);	
	});
}


function userpage(usrname, currentusername, countdets, userIsReqUser, usrposts, reqUserFollowsUser){
	console.log(`loading user page for ${usrname}`);
	document.querySelector('#newpost').style.display = 'none';
    document.querySelector('#allposts').style.display = 'none';
	document.querySelector('#followedposts').style.display = 'none';
	document.querySelector('#userpage').innerHTML = "";
	
	//Container for user details
	const usrdets = document.querySelector('#userpage');
	
	//Container for user info
	const userinfo = document.createElement('div');
	userinfo.className = 'userinfo';
	
	const username = document.createElement('h3');
	username.className = 'username';
	username.innerHTML = usrname;
	
	const usr_fby = document.createElement('button');
	usr_fby.innerHTML = `Followed by ${countdets.user_followedby}`;
	usr_fby.className = "btn btn-outline-dark usr_fby";
	
	const usr_fing = document.createElement('button');
	usr_fing.innerHTML = `Following ${countdets.user_following}`;
	usr_fing.className = "btn btn-outline-info usr_fing";
	
	const f_usr_btn = document.createElement('button');
	f_usr_btn.innerHTML = 'Follow';
	f_usr_btn.className = 'btn btn-sm btn-outline-success f_usr_btn';
	const uf_usr_btn = document.createElement('button');
	uf_usr_btn.innerHTML = 'Unfollow';
	uf_usr_btn.className = 'btn btn-sm btn-outline-danger uf_usr_btn';
	
	if(userIsReqUser) {
		f_usr_btn.style.display = 'none';
		uf_usr_btn.style.display = 'none';
	}
	else{
		if(reqUserFollowsUser) {
			f_usr_btn.style.display = 'none';
			uf_usr_btn.style.display = 'block';
		}
		else{
			f_usr_btn.style.display = 'block';
			uf_usr_btn.style.display = 'none';
		}
	}
	
	// Add elements to user details container
	userinfo.append(username);
	userinfo.append(usr_fby);
	userinfo.append(usr_fing);
	userinfo.append(f_usr_btn);
	userinfo.append(uf_usr_btn);
	
    // Add email_listbox to DOM
    usrdets.append(userinfo);
	
	// Follow user
	f_usr_btn.addEventListener('click', () => {
		follow(usrname,currentusername);
		
		let newfollowedbyval = parseInt(usr_fby.innerHTML.split(' ')[2]) + 1;
		usr_fby.innerHTML = `Followed by ${newfollowedbyval}`;
		
		f_usr_btn.style.display = 'none';
		uf_usr_btn.style.display = 'block';
	});
	
	// Unfollow user
	uf_usr_btn.addEventListener('click', () => {
		unfollow(usrname,currentusername);
		
		let newunfollowedbyval = parseInt(usr_fby.innerHTML.split(' ')[2]) - 1;
		usr_fby.innerHTML = `Followed by ${newunfollowedbyval}`;
		
		f_usr_btn.style.display = 'block';
		uf_usr_btn.style.display = 'none';
	});
	
	usrposts.forEach(usrpost => {
		console.log(usrpost);
		post_list_view(usrpost,currentusername,"userpage");
	})
	
	document.querySelector('#userpage').style.display = 'block';
}

function follow(usrname,currentusername){
	fetch('/follow', {
		method: 'POST',
		body: JSON.stringify({
			'following':usrname,
			'follower':currentusername
		})
	});
	console.log(`${usrname}, ${currentusername}`);
}

function unfollow(usrname,currentusername){
	fetch('/unfollow', {
		method: 'POST',
		body: JSON.stringify({
			'following':usrname,
			'follower':currentusername
		})
	});
	console.log(`${usrname}, ${currentusername}`);
}

function userfollowing(currentusername, followedposts_pageno){
	document.querySelector('#prev_nxt_btn').innerHTML="";
	document.querySelector('#newpost').style.display = 'none';
    document.querySelector('#allposts').style.display = 'none';
	document.querySelector('#followedposts').innerHTML = '';
	document.querySelector('#userpage').style.display = 'none';
	
	
	const fpt = document.createElement('h3');
	fpt.innerHTML = "Followed Posts";
	document.querySelector('#followedposts').append(fpt);
	
	fetch(`/${currentusername}/following/${followedposts_pageno}`)
	.then(response => response.json())
	.then(data => {
		data.posts.forEach(post => {
			post_list_view(post,currentusername,"followedposts");
			
			document.querySelector('#followedposts').style.display = 'block';
			
			//PrevPage - NxtPage
			const followedposts_prev_nxt = document.querySelector('#prev_nxt_btn');
				
			const followedposts_nxt_btn = document.createElement('button');
			followedposts_nxt_btn.className = "nxt_btn";
			followedposts_nxt_btn.innerHTML = "Next Page";
			
			const followedposts_prev_btn = document.createElement('button');
			followedposts_prev_btn.className = "prev_btn";
			followedposts_prev_btn.innerHTML = "Previous Page";
			
			followedposts_prev_nxt.append(followedposts_prev_btn);
			followedposts_prev_nxt.append(followedposts_nxt_btn);
			
			followedposts_prev_btn.addEventListener('click', () => {
				document.querySelector('#followedposts').innerHTML="";
				followedposts_pageno = followedposts_pageno - 1;
				userfollowing(currentusername, followedposts_pageno);
				followedposts_prev_btn.style.display='none';
				followedposts_nxt_btn.style.display='none';
			});
			
			followedposts_nxt_btn.addEventListener('click', () => {
				document.querySelector('#followedposts').innerHTML="";
				followedposts_pageno = followedposts_pageno + 1;
				userfollowing(currentusername, followedposts_pageno);
				followedposts_nxt_btn.style.display='none';
				followedposts_prev_btn.style.display='none';
			});
			
			
			if(data.page.has_next) {
				followedposts_nxt_btn.style.display='block';
			}
			else{
				followedposts_nxt_btn.style.display='none';
			}
				
			if(data.page.has_previous) {
				followedposts_prev_btn.style.display='block';
			}
			else{
				followedposts_prev_btn.style.display='none';
			}
			
			//document.querySelector('#disp').append(followedposts_prev_nxt);
			})
		
	});
}

function edit(post,editarea){
	fetch(`/editpost/${post.id}`, {
		method: 'POST',
		body: JSON.stringify({
		    post_newbody: editarea.value
		})
	});
}
