from django.contrib import admin
from .models import Category, Author, BlogPost
from django import forms


class BlogPostForm(forms.ModelForm):
    content = forms.CharField(
        widget=forms.Textarea(attrs={
            'rows': 30,
            'cols': 80,
            'style': 'font-family: monospace; font-size: 14px; white-space: pre-wrap;'  # ADD THIS
        }),
        help_text="Write your content. Use ENTER twice to create paragraphs."
    )
    
    class Meta:
        model = BlogPost
        fields = '__all__'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'user', 'created_at']
    search_fields = ['display_name', 'user__username']

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    form = BlogPostForm 
    list_display = ['title', 'author', 'category', 'published','featured','featured_order', 'created_at', 'views']
    list_filter = ['published', 'category', 'created_at']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    list_editable=['featured','featured_order']




class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'active', 'order', 'created_at']
    list_editable = ['active', 'order']
    list_filter = ['active', 'created_at']
    search_fields = ['title', 'description']