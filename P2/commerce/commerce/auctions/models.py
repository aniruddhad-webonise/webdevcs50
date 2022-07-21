from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Category(models.Model):
	category = models.CharField(max_length=16)
	
	def __str__(self):
		return f"{self.id}: {self.category}"

		
class AuctionListing(models.Model):
	title = models.CharField(max_length=32)
	desc = models.CharField(max_length=1024, null=True)
	pic_url = models.URLField(null=True)
	owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listed_items")
	category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="items_in_cat")
	
	def __str__(self):
		return f"Item {self.title} listed by {self.owner}"
	

class Bid(models.Model):
	bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_bids")
	item = models.ForeignKey(AuctionListing, on_delete=models.CASCADE, related_name="item_bids")
	amt = models.IntegerField(default=25)
	
	def __str__(self):
		return f"Amount ${self.amt} for {self.item.title} by {self.bidder}"
		
class Comment(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_comments")
	item = models.ForeignKey(AuctionListing, on_delete=models.CASCADE, related_name="item_coms")
	comment = models.CharField(max_length=512)
	
	def __str__(self):
		return f"Comment by {self.user} for {self.item}: {self.comment}"
		
class Watchlist(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watchlist_items")
	item = models.ForeignKey(AuctionListing, on_delete=models.CASCADE, related_name="in_watchlist")
	
	def __str__(self):
		return f"{self.item.title} added to watchlist by user {self.user}"
		
class DeletedListing(models.Model):
	title = models.CharField(max_length=32)
	owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings_deleted")
	winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings_won")
	winningPrice = models.IntegerField()
	
	def __str__(self):
		return f"{self.title} won by user {self.winner} for an amount of {self.winningPrice}"