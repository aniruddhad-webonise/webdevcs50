
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
	path("newpost", views.newpost, name="newpost"),
	
	#API path
	path("userpage/<str:username>/<int:pageno>", views.userpage, name="userpage"),
	path("allposts/<int:pageno>", views.allposts, name="allposts"),
	path("likepost/<int:postid>", views.likepost, name="likepost"),
	path("unlikepost/<int:postid>", views.unlikepost, name="unlikepost"),
	path("follow", views.follow, name="follow"),
	path("unfollow", views.unfollow, name="unfollow"),
	path("<str:username>/following/<int:pageno>", views.following, name="following"),
	path("editpost/<int:postid>", views.editpost, name="editpost"),
    path("translatepost/<int:postid>", views.translatepost, name="translatepost")
	
]
