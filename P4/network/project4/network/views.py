from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

import json
from django.http import JsonResponse

from .models import *

from textblob import TextBlob


def index(request):
	
	# Authenticated users view posts
	if request.user.is_authenticated:
		return render(request, "network/index.html")

    # Everyone else is prompted to sign in
	else:
		return HttpResponseRedirect(reverse("login"))
		
def allposts(request, pageno):
	posts = Post.objects.all()
	# Return posts in reverse chronologial order
	posts = posts.order_by("-timestamp").all()
	
	#Pagination
	paginator = Paginator(posts, 5)
	page_number = pageno
	page_obj = paginator.get_page(page_number)
	posts = [post.serialize() for post in page_obj.object_list]

	return JsonResponse({"page":{
								"current": page_obj.number,
								"has_next": page_obj.has_next(),
								"has_previous": page_obj.has_previous()
								},
						"posts":posts
						}, safe=False)


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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
		
		
def newpost(request):
	if request.method == "POST":
		post_t = request.POST["post-text"]		
		post_imgurl = request.POST["postimg-url"]
		user = request.user
		
		post = Post(body=post_t, pic_url=post_imgurl, user=user)
		post.save()

		blob = TextBlob(post_t)
		senti_s = blob.sentiment.polarity
		subjectivity_score = blob.sentiment.subjectivity

		if senti_s > 0:
			senti_l = "Positive"
		elif senti_s < 0:
			senti_l = "Negative"
		else:
			senti_l = "Neutral"

		senti = SentiScore(user=user, post_text=post_t, senti_score=senti_s, senti_label=senti_l, subjectivity_score=subjectivity_score)
		senti.save()
		
		return HttpResponseRedirect(reverse("index")) 
		
	else:
		return HttpResponseRedirect(reverse("index"))
		
		
def userpage(request, username, pageno):
	u = User.objects.get(username=username)
	ru = request.user
	userIsReqUser = False
	if (u == ru):
		userIsReqUser = True
		
	usrposts = Post.objects.all().filter(user=u)
	usrposts = usrposts.order_by("-timestamp").all()
	
	#Pagination
	paginator = Paginator(usrposts, 2)
	page_number = pageno
	page_obj = paginator.get_page(page_number)
	posts = [post.serialize() for post in page_obj.object_list]
	
	page = {"current": page_obj.number,"has_next": page_obj.has_next(),"has_previous": page_obj.has_previous()}
	
	countdets = {"user_following": u.user_following.count(),"user_followedby": u.user_followedby.count()}
	
	#Checking if current user follows userpage user
	followedby = []
	for ufb in u.user_followedby.all():
		followedby.append(ufb.follower)	
	reqUserFollowsUser = False
	if (ru in followedby):
		reqUserFollowsUser = True
	
	return JsonResponse({'posts':posts,
						'countdets':countdets,
						'userIsReqUser': userIsReqUser,
						'reqUserFollowsUser': reqUserFollowsUser,
						"page":page}, safe=False)

@csrf_exempt
def likepost(request, postid):
	
	if request.method != "POST":
		return JsonResponse({"error": "POST request required."}, status=400)
	
	#data = json.loads(request.body)
	user = request.user
	post = Post.objects.get(id=postid)
	
	likedpost = Like(
					user=user,
					post=post
				)
	likedpost.save()
	
	return JsonResponse({"message": "Post liked"}, status=201)
	
@csrf_exempt
def unlikepost(request, postid):
	
	if request.method != "POST":
		return JsonResponse({"error": "POST request required."}, status=400)
	
	#data = json.loads(request.body)
	user = request.user
	post = Post.objects.get(id=postid)
	
	likedpost = Like.objects.all().get(user=user,post=post)
	likedpost.delete()
	
	return JsonResponse({"message": "Post unliked"}, status=201)
	
@csrf_exempt
def follow(request):
	if request.method != "POST":
		return JsonResponse({"error": "POST request required."}, status=400)
	
	data = json.loads(request.body)
	following = data.get("following", "")
	follower = data.get("follower", "")
	
	following_user = User.objects.all().get(username=following)
	follower_user = User.objects.all().get(username=follower)
	
	f = Follow(following=following_user, follower=follower_user)
	f.save()
	
	return JsonResponse({"message": "Followed Successfuly"}, status=201)
	
@csrf_exempt
def unfollow(request):
	if request.method != "POST":
		return JsonResponse({"error": "POST request required."}, status=400)
	
	data = json.loads(request.body)
	following = data.get("following")
	follower = data.get("follower")
	
	following_user = User.objects.all().get(username=following)
	follower_user = User.objects.all().get(username=follower)
	
	f = Follow.objects.all().get(following=following_user, follower=follower_user)
	f.delete()
	
	return JsonResponse({"message": "Unollowed Successfuly"}, status=201)	


def following(request, username, pageno):
	user = User.objects.all().get(username=username)
	user_fllings = []
	for ussf in user.user_following.all():
		user_fllings.append(ussf.following)
	
	A = user_fllings[0].user_posts.all()
	for i in range(1, len(user_fllings)):
		B = user_fllings[i].user_posts.all()
		A = A.union(B).order_by('-timestamp')
		
	#Pagination
	paginator = Paginator(A, 1)
	page_number = pageno
	page_obj = paginator.get_page(page_number)
	posts = [post.serialize() for post in page_obj.object_list]

	return JsonResponse({"page":{
								"current": page_obj.number,
								"has_next": page_obj.has_next(),
								"has_previous": page_obj.has_previous()
								},
						"posts":posts
						}, safe=False)

@csrf_exempt	
def editpost(request, postid):
	post = Post.objects.all().get(id=postid)
	
	data = json.loads(request.body)
	post_newbody = data.get("post_newbody")
	
	post.body = post_newbody
	post.save()
	
	return JsonResponse({"message": "Post edited successfully"}, status=201)
	
	
	
	
	
	
	
	
	












