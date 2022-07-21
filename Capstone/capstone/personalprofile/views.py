from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator

import json
from django.http import JsonResponse

from .models import *


def index(request):
    return render(request, "personalprofile/index.html")
	
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "personalprofile/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "personalprofile/login.html")
		
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))
	
def addpage_view(request):
    return render(request, "personalprofile/addpage.html")
	
def addcontent(request, addtype):
	if request.method == "POST":

		if addtype == "workexp":
			workexp_title = request.POST["workexp-title"]
			workexp_loc =  request.POST["workexp-loc"]
			workexp_duration = request.POST["workexp-duration"]
			workexp_desc = request.POST["workexp-desc"]
			workexp_mt = request.POST["workexp-mt"]
			workexp_url = request.POST["workexp-url"]
			
			we = WorkExp(title=workexp_title, loc=workexp_loc, duration=workexp_duration, desc=workexp_desc, mt=workexp_mt, url=workexp_url)
			we.save()
			
		elif addtype == "proj":
			proj_title = request.POST["proj-title"]
			proj_duration = request.POST["proj-duration"]
			proj_desc = request.POST["proj-desc"]
			proj_mt = request.POST["proj-mt"]
			proj_url = request.POST["proj-url"]
			proj_img_url = request.POST["proj-img_url"]
			
			p = Proj(title=proj_title, duration=proj_duration, desc=proj_desc, mt=proj_mt, url=proj_url, img_url=proj_img_url)
			p.save()
			
		elif addtype == "blog":
			blog_title = request.POST["blog-title"]
			blog_desc = request.POST["blog-desc"]
			blog_body = request.POST["blog-body"]
			blog_img_url = request.POST["blog-img_url"]
			blog_blogimg_url = request.POST["blog-blogimg_url"]
			
			b = Blog(title=blog_title, desc=blog_desc, body=blog_body, img_url=blog_img_url, blogimg_url=blog_blogimg_url)
			b.save()
			
	return HttpResponseRedirect(reverse("addpage_view"))		
	
def workexp(request, pageno):
	workexps = WorkExp.objects.all()
	workexps = workexps.order_by("-id").all()
	
	#Pagination
	paginator = Paginator(workexps, 3)
	page_number = pageno
	page_obj = paginator.get_page(page_number)
	workexps = [workexp.serialize() for workexp in page_obj.object_list]
	
	return JsonResponse({"page":{
								"current": page_obj.number,
								"has_next": page_obj.has_next(),
								"has_previous": page_obj.has_previous()
								},
						"workexps":workexps
						}, safe=False)
	
def projects(request, pageno):
	projs = Proj.objects.all()
	projs = projs.order_by("-id").all()
	
	#Pagination
	paginator = Paginator(projs, 1)
	page_number = pageno
	page_obj = paginator.get_page(page_number)
	projs = [proj.serialize() for proj in page_obj.object_list]
	
	return JsonResponse({"page":{
								"current": page_obj.number,
								"has_next": page_obj.has_next(),
								"has_previous": page_obj.has_previous()
								},
						"projs":projs
						}, safe=False)
						
def blogs(request):
	blogs = Blog.objects.all()
	blogs = blogs.order_by('-timestamp').all()

	blogs = [blog.serialize() for blog in blogs]
	
	return JsonResponse(blogs, safe=False)















