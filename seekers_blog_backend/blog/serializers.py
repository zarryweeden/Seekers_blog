from rest_framework import serializers
from .models import BlogPost, Category, Author

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
            'created_at', 'views'
        ]
    def get_author_profile_image(self, obj):  # ADD THIS METHOD
        if obj.author.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.author.profile_image.url)
        return None

class BlogPostDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.display_name', read_only=True)
    author_profile_image = serializers.SerializerMethodField()
    author_bio = serializers.CharField(source='author.bio', read_only=True)
    formatted_content = serializers.SerializerMethodField()  # ADD THIS LINE
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'formatted_content', 'excerpt', 'author', 'author_name', 
            'author_profile_image', 'author_bio', 'category', 'category_name', 
            'featured_image', 'created_at', 'updated_at', 'views', 'published'
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
