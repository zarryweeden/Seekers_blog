from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

class AuthorSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    class Meta:
        model = Author
        fields = ['id', 'display_name', 'profile_image']
    def get_profile_image(self, obj):  # ADD THIS METHOD
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
        return None

class CategorySerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'name', 'description','image','created_at']

class BlogPostListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.display_name', read_only=True)
    author_profile_image = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'author', 'author_name', 'author_profile_image',
            'category', 'category_name', 'featured_image', 
            'created_at', 'views','featured','featured_order'
        ]
    def get_author_profile_image(self, obj):  # ADD THIS METHOD
        if obj.author.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.author.profile_image.url)
        return None
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'user_name', 'user_first_name', 'user_last_name', 
                 'content', 'created_at', 'updated_at']

class BlogPostDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.display_name', read_only=True)
    author_profile_image = serializers.SerializerMethodField()
    author_bio = serializers.CharField(source='author.bio', read_only=True)
    formatted_content = serializers.SerializerMethodField() 
    likes_count = serializers.SerializerMethodField()
    user_has_liked = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'formatted_content', 'excerpt', 'author', 'author_name', 
            'author_profile_image', 'author_bio', 'category', 'category_name', 
            'featured_image', 'created_at', 'updated_at', 'views', 'published','featured','featured_order',
            'likes_count', 'user_has_liked', 'comments'
        ]
    def get_author_profile_image(self, obj):  # ADD THIS METHOD
        if obj.author.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.author.profile_image.url)
        return None
    
    # ADD THIS METHOD - PROPERLY INDENTED
    def get_formatted_content(self, obj):
        """Convert blog content into clean, consistent paragraphs."""
        if not obj.content:
            return []
        
        # Normalize all newline types (\r\n, \r, \n)
        normalized_content = obj.content.replace('\r\n', '\n').replace('\r', '\n')

        # Split on double newlines to detect paragraph breaks
        paragraphs = [p.strip() for p in normalized_content.split('\n\n') if p.strip()]
        
        # Clean single newlines (inside same paragraph)
        paragraphs = [' '.join(p.splitlines()) for p in paragraphs]

        return paragraphs
    
    def get_likes_count(self, obj):
        return obj.likes_count()
    
    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.user_has_liked(request.user)
        return False
    
    def get_comments(self, obj):
        comments = obj.comment_set.all().order_by('-created_at')
        return CommentSerializer(comments, many=True).data
    


class HeroSectionSerializer(serializers.ModelSerializer):
    background_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HeroSection
        fields = [
            'id', 'title', 'subtitle', 'description', 
            'bible_verse', 'button_text', 'button_link',
            'background_image_url', 'active', 'order'
        ]
    
    def get_background_image_url(self, obj):
        if obj.background_image:
            return obj.background_image.url
        return None