from django.db import models
from django.contrib.auth.models import User
from cloudinary_storage.storage import MediaCloudinaryStorage

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to='categories/', 
        blank=True, 
        null=True,
        storage=MediaCloudinaryStorage()  
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class Author(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=100)
    profile_image = models.ImageField(
        upload_to='authors/', 
        blank=True, 
        null=True,
        storage=MediaCloudinaryStorage()  
    ) 
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.display_name


class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    content = models.TextField()
    excerpt = models.TextField(max_length=300, blank=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    featured_image = models.ImageField(
        upload_to='blog/', 
        blank=True, 
        null=True,
        storage=MediaCloudinaryStorage() 
    )  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    featured_order = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.title.replace(' ', '-').lower()
        super().save(*args, **kwargs)

    def likes_count(self):
        return self.like_set.count()
    
    def user_has_liked(self, user):
        if not user.is_authenticated:
            return False
        return self.like_set.filter(user=user).exists()
    

    


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'post'] 

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"



class HeroSection(models.Model):
    title = models.TextField(help_text="Main headline text")
    subtitle = models.CharField(max_length=200, blank=True, help_text="Subtitle or Bible verse reference")
    description = models.TextField(help_text="Quote or descriptive text")
    bible_verse = models.TextField(blank=True, help_text="Full Bible verse text")
    button_text = models.CharField(max_length=50, default="Read Full Devotion")
    button_link = models.URLField(default="https://whiteestate.org/devotional/mlt/")
    background_image = models.ImageField(
        upload_to='hero/',
        blank=True,
        null=True,
        storage=MediaCloudinaryStorage()
    )
    active = models.BooleanField(default=True, help_text="Whether this hero section is currently active")
    order = models.IntegerField(default=0, help_text="Display order if multiple hero sections exist")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return f"Hero Section - {self.title[:50]}..."