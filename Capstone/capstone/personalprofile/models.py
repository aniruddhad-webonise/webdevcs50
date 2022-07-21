from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass
	
class WorkExp(models.Model):
	title = models.CharField(max_length=64)
	loc = models.CharField(max_length=265)
	duration = models.CharField(max_length=128)
	desc = models.CharField(max_length=20480)
	mt = models.CharField(max_length=20480)
	url = models.URLField(null=True)
	
	def serialize(self):
		return {
			"title": self.title,
			"loc": self.loc,
			"duration": self.duration,
			"desc": self.desc,
			"mt": self.mt,
			"url": self.url,
			"id": self.id
		}
		
class Proj(models.Model):
	title = models.CharField(max_length=64)
	duration = models.CharField(max_length=128)
	desc = models.CharField(max_length=20480)
	mt = models.CharField(max_length=20480)
	url = models.URLField(null=True)
	img_url = models.URLField(null=True)
	
	def serialize(self):
		return {
			"title": self.title,
			"duration": self.duration,
			"desc": self.desc,
			"mt": self.mt,			
			"url": self.url, 
			"img_url": self.img_url,
			"id": self.id
		}
	
class Blog(models.Model):
	title = models.CharField(max_length=64)
	desc = models.CharField(max_length=10240)
	body = models.CharField(max_length=20480)
	img_url = models.URLField(null=True)
	blogimg_url = models.URLField(null=True)
	timestamp = models.DateTimeField(auto_now_add=True)
	
	def serialize(self):
		return {
			"title": self.title,
			"desc": self.desc, 
			"body": self.body,
			"img_url": self.img_url,
			"blogimg_url": self.blogimg_url,
			"timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
			"id": self.id
		}	