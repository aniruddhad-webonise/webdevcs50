
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
	path("login", views.login_view, name="login"),
	path("logout", views.logout_view, name="logout"),
	path("addpage_view", views.addpage_view, name="addpage_view"),
	path("addcontent/<str:addtype>", views.addcontent, name="addcontent"),
	
	# API Routes
	path("workexp/<int:pageno>", views.workexp, name="workexp"),
	path("projects/<int:pageno>", views.projects, name="projects"),
	path("blogs", views.blogs, name="blogs"),
]
