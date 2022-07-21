from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
	body = models.CharField(max_length=5120)
	pic_url = models.URLField(null=True)
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_posts")
	timestamp = models.DateTimeField(auto_now_add=True)
		
	def serialize(self):
		return {
			"id": self.id,
			"body": self.body,
			"pic_url": self.pic_url,
			"user": self.user.username,
			"timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
			"postlikecount": self.post_likes.count(),
			"postlikers": [postlike.user.username for postlike in self.post_likes.all()]
		}		

class Like(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_likes")
	post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_likes")

	def serialize(self):
		return {
			"id": self.id,
			"user": self.user,
			"post": self.post            
        }
		
class Follow(models.Model):
	follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_following")
	following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_followedby")
	
	def serialize(self):
		return {
			"id": self.id,
			"follower": self.follower,
			"following": self.following            
        }