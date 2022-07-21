from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required

from .models import *


def index(request):
    return render(request, "auctions/index.html",{
		"listings" : AuctionListing.objects.all()
		})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST.get("user")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["user"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

	
def createlistings(request):
	if request.method == "POST":
		title = request.POST["title"]
		desc = request.POST["desc"]
		img_url = request.POST["img_url"]
		category = request.POST["category"]
		
		cats = Category.objects.all()
		
		for cat in cats:
			if category == cat.category:
				C = cat
		
		item = AuctionListing(title=title, desc=desc, pic_url=img_url, category=C, owner=request.user)
		item.save()
		
		return render(request, "auctions/createlisting_success.html", {
                "message": "Listing created successfully!"
            })

	
	else:
		return render(request, "auctions/createlistings.html")
	
def listing(request, listing_title):
	listing = AuctionListing.objects.get(title=listing_title)
	
	user = request.user
	owner = listing.owner
	userisowner = False
	if user == owner:
		userisowner = True
	
	max = 0
	itembids = listing.item_bids.all()
	for i in range(len(itembids)):
		if itembids[i].amt > max:
			max = itembids[i].amt
		else:
			max = max
	CurrentPrice = max
	
	itmwlrecords = listing.in_watchlist.all()
	itmwlu = []
	for itmwlrecord in itmwlrecords:
		itmwlu.append(itmwlrecord.user)
		
	inWatchlist = False
	if user in itmwlu:
		inWatchlist = True
		
	itemcomments = listing.item_coms.all()
	
	
	return render(request, "auctions/listing.html", {
		"listing": listing,
		"userisowner": userisowner,
		"CurrentPrice": CurrentPrice,
		"inWatchlist": inWatchlist,
		"itemcomments": itemcomments
		})

@login_required		
def bid(request, listing_title):
	if request.method == "POST":
		amt = int(request.POST["amt"])
		
		user = request.user
		item = AuctionListing.objects.get(title=listing_title)
		
		max=0
		itembids = item.item_bids.all()
		for i in range(len(itembids)):
			if itembids[i].amt > max:
				max = itembids[i].amt
			else:
				max = max
		maxBid = max
		
		if (amt<maxBid):
			return render(request, "auctions/bid_error.html", {
			"message": "Bid amount entered has to be greater than current price"
		})
			
		else:
			bid = Bid(bidder=user, item=item, amt=amt)
			bid.save()
			
			return render(request, "auctions/bid_success.html", {
				"message": "Bid entered successfully!"
			})
		
	else:
		return render(request, "auctions/bid.html",{
			"l_title": listing_title
		})
	
def watchlist(request, listing_title):
	if request.method == "POST":
		user = request.user
		item = AuctionListing.objects.get(title=listing_title)

		watchlistitem = Watchlist(user=user, item=item)
		watchlistitem.save()
		
		return render(request, "auctions/watchlistitemadded.html", {
			"message": "Item added to watchlist successfully!"
		})
	
	else:
		pass
		
def categories(request):
	categories = Category.objects.all()
	
	return render(request, "auctions/categories.html", {
		"categories": categories
	})
	
def category_items(request, category_title):
	C = Category.objects.get(category=category_title)
	
	C_itms = C.items_in_cat.all()
	
	return render(request, "auctions/categoryitems.html", {
		"C_itms": C_itms,
		"C_title":category_title
	})
	
def viewwatchlist(request, username):
	user = request.user
	uwlis = user.watchlist_items.all()
	
	return render(request, "auctions/watchlistitems.html", {
		"uwlis": uwlis,
		"user": user
	})
	
def removewatchlistitem(request, removalitem):
	item = AuctionListing.objects.get(title=removalitem)
	user = request.user
	wli = Watchlist.objects.get(user=user, item=item)
	wli.delete()
	
	return render(request, "auctions/watchlistitemdeletedsuccessfully.html", {
		"message": "Item removed from watchlist successfully"
	})
	
def deletelisting(request, listing_title):
	item = AuctionListing.objects.get(title=listing_title)
	owner = item.owner
	
	max = 0
	itembids = item.item_bids.all()
	for i in range(len(itembids)):
		if itembids[i].amt > max:
			max = itembids[i].amt
		else:
			max = max
	maxBid = max
	bid = Bid.objects.get(item=item, amt=maxBid)
	winner = bid.bidder
	
	dl = DeletedListing(title=listing_title, owner=owner, winner=winner, winningPrice = maxBid)
	dl.save()
	item.delete()
	
	return render(request, "auctions/listingdeleted.html", {
			"message": "Listing deleted successfully"
		})
		
def deletedlistings(request):
	return render(request, "auctions/deletedlistings.html",{
		"deletedlistings" : DeletedListing.objects.all()
		})
		
def delitmdets(request, dellisting_title):
	dl = DeletedListing.objects.get(title=dellisting_title)
	
	userIsWinner = False
	if request.user == dl.winner:
		userIsWinner = True
	
	return render(request, "auctions/dellisting.html", {
		"dl": dl,
		"userIsWinner": userIsWinner
		})
		
def addcomment(request, listing_title):
	if request.method == "POST":
		comment = request.POST["comment"]	
		item = AuctionListing.objects.get(title=listing_title)
		user = request.user
		
		comm = Comment(user=user, item=item, comment=comment)
		comm.save()
		
		return render(request, "auctions/commentadded.html", {
			"message": f"Comment added for {item.title} by {user.username} successfully" 
		})
			
	else:
		pass		