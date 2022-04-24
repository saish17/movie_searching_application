from django.shortcuts import render

# Create your views here.
def home_view(request):
    return render(request,'omdbapp/index.html')

def watchlist_view(request):
    return render(request,'omdbapp/watchlist.html')    
