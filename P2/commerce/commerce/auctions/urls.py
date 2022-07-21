from django.urls import path

from . import views

urlpatterns = [
	path("", views.index, name="index"),
	path("login", views.login_view, name="login"),
	path("logout", views.logout_view, name="logout"),
	path("register", views.register, name="register"),
	path("createlistings", views.createlistings, name="createlistings"),
	path("listing/<str:listing_title>", views.listing, name="listing"),
	path("bid/<str:listing_title>", views.bid, name="bid"),
	path("<str:listing_title>/addtowatchlist", views.watchlist, name="watchlist"),
	path("categories", views.categories, name="categories"),
	path("<str:category_title>/categoryitems", views.category_items, name="category_items"),
	path("<str:username>/watchlist", views.viewwatchlist, name="viewwatchlist"),
	path("<str:removalitem>/removewatchlistitem", views.removewatchlistitem, name="removewatchlistitem"),
	path("<str:listing_title>/deletelisting", views.deletelisting, name="deletelisting"),
	path("deletedlistings", views.deletedlistings, name="deletedlistings"),
	path("<str:dellisting_title>/delitmdets", views.delitmdets, name="delitmdets"),
	path("<str:listing_title>/commentadded", views.addcomment, name="addcomment")
]
