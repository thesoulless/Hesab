from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from hesab.models import *
from datetime import datetime, date
from jalali import GregorianToJalali, JalaliToGregorian
import time

@login_required
def main_page(request):
	_cat = success_message = failur_message = ""	

	if request.method == 'POST':
		if request.user.is_authenticated():
			if request.POST.get('one', ''):
				_cat = request.POST['one-cat']				
				old_cat = Category.objects.get(cat=_cat)
				if old_cat:
					old_cat.cat_used = old_cat.cat_used + 1
					old_cat.save()
					_cost = int(request.POST['one'])
					one = Calcs(cost=_cost, pay_date=request.POST['one-dp'],
					user=request.user, cat=old_cat)					
					one.save()
					if one.id:
						success_message = "Sucessfuly Added!"
					else:
						failur_message = "Something went wrong!"


			if request.POST.get('two', ''):				
				_cat = request.POST['two-cat']				
				old_cat = Category.objects.get(cat=_cat)
				if old_cat:
					old_cat.cat_used = old_cat.cat_used + 1
					old_cat.save()
					_cost = int(request.POST['two'])
					two = Calcs(cost=_cost, pay_date=request.POST['two-dp'],
					user=request.user, cat=old_cat)					
					two.save()
					if two.id:
						success_message = "Sucessfuly Added!"
					else:
						failur_message = "Something went wrong!"


			if request.POST.get('three', ''):				
				_cat = request.POST['three-cat']				
				old_cat = Category.objects.get(cat=_cat)
				if old_cat:
					old_cat.cat_used = old_cat.cat_used + 1
					old_cat.save()
					_cost = int(request.POST['three'])
					three = Calcs(cost=_cost, pay_date=request.POST['three-dp'],
					user=request.user, cat=old_cat)					
					three.save()
					if three.id:
						success_message = "Sucessfuly Added!"
					else:
						failur_message = "Something went wrong!"

			
			if request.POST.get('four', ''):				
				_cat = request.POST['four-cat']				
				old_cat = Category.objects.get(cat=_cat)
				if old_cat:
					old_cat.cat_used = old_cat.cat_used + 1
					old_cat.save()
					_cost = int(request.POST['four'])
					four = Calcs(cost=_cost, pay_date=request.POST['four-dp'],
					user=request.user, cat=old_cat)					
					four.save()
					if four.id:
						success_message = "Sucessfuly Added!"
					else:
						failur_message = "Something went wrong!"			


			if request.POST.get('five', ''):				
				_cat = request.POST['five-cat']				
				old_cat = Category.objects.get(cat=_cat)
				if old_cat:
					old_cat.cat_used = old_cat.cat_used + 1
					old_cat.save()
					_cost = int(request.POST['five'])
					five = Calcs(cost=_cost, pay_date=request.POST['five-dp'],
					user=request.user, cat=old_cat)					
					five.save()
					if five.id:
						success_message = "Sucessfuly Added!"
					else:
						failur_message = "Something went wrong!"


			if request.POST.get('six', ''):				
				_cat = request.POST['six-cat']				
				old_cat = Category.objects.get(cat=_cat)
				if old_cat:
					old_cat.cat_used = old_cat.cat_used + 1
					old_cat.save()
					_cost = int(request.POST['six'])
					six = Calcs(cost=_cost, pay_date=request.POST['six-dp'],
					user=request.user, cat=old_cat)					
					six.save()
					if six.id:
						success_message = "Sucessfuly Added!"
					else:
						failur_message = "Something went wrong!"

	categories = Category.objects.all().order_by('-cat_used')
	g_to_j = GregorianToJalali(date.today().year, date.today().month, date.today().day)
	today_list = g_to_j.getJalaliList()
	today = date(today_list[0], today_list[1], today_list[2])
	return render_to_response('hesab/index.html', {
		'success_message': success_message,
		'failur_message': failur_message,
    	'title': 'Home',
    	'today': today,    	
    	'categories': categories}, context_instance=RequestContext(request))

def logout_page(request):
    """
    Log users out and re-direct them to the main page.
    """
    logout(request)
    return HttpResponseRedirect('/')


@login_required
def add_cat(request):
	"""
	"""
	errors = []
	cat_error = ""

	_cat = _cat_display = success_message = failur_message = ""
	if request.method == 'POST':
		if not request.POST.get('cat', ''):
			errors.append('Somethings wrong!')
			cat_error = "Empty"            
		if request.POST.get('email') and '@' not in request.POST['email']:
			errors.append('Enter a valid e-mail address.')
		if not errors:
			if not request.POST.get('cat-show', ''):
				_cat_display = request.POST['cat']
			else:
				_cat_display = request.POST['cat-show']

			_cat = request.POST['cat']

        	category = Category(cat=_cat, cat_display=_cat_display, cat_used=0)
        	category.save()
        	if (category.id):
        		success_message = _cat + " successfully added to category!"
        	else:
        		failur_message = "Ooops! Something is wrong with database."

	return render_to_response('hesab/addcat.html', {
		'errors': errors,
		'success_message': success_message,
		'failur_message': failur_message,
		'cat_error':cat_error,
		'title': 'Add Category',
		'SITE_ROOT': SITE_ROOT,
		}, context_instance=RequestContext(request))


@login_required
def stat(request):
	categories = Category.objects.all().order_by('-cat_used')
	today_list = GregorianToJalali(date.today().year, date.today().month, date.today().day).g_to_j.getJalaliList()	
	today = date(today_list[0], today_list[1], today_list[2])
	return render_to_response('hesab/stat.html', {
    	'title': 'Stat',
    	'today': today,
    	'categories': categories}, context_instance=RequestContext(request))