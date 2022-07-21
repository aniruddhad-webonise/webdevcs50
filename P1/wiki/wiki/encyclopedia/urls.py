from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
	path("search_result", views.search_result, name="search_result"),
	path("add_page", views.add_page, name="add_page"),
	path("submit_confirm", views.submit_confirm, name="submit_confirm"),
	path("afteredit_submit_confirm", views.afteredit_submit_confirm, name="afteredit_submit_confirm"),
	path("wiki/edit_page_<str:edit_page_t_name>", views.edit_page, name="edit_page"),
	path("wiki/<str:title_name>", views.title_page, name="title_page")
]
