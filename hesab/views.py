from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from hesab.models import *
from datetime import datetime, date
from jalali import GregorianToJalali, JalaliToGregorian
from django.utils import simplejson as json
from dateutil.parser import parse
import time
from django.views.decorators.csrf import csrf_exempt

from django.http import HttpResponse

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
		}, context_instance=RequestContext(request))


@login_required
def stat(request):	
	categories = Category.objects.all().order_by('-cat_used')
	today_list = GregorianToJalali(date.today().year, date.today().month, date.today().day).getJalaliList()	
	today = date(today_list[0], today_list[1], today_list[2])

	users = User.objects.all()
	return render_to_response('hesab/stat.html', {
    	'title': 'Stat',
    	'today': today,
    	'first_user': users[0].username,
    	'second_user': users[1].username,
    	'categories': categories}, context_instance=RequestContext(request))


@login_required
@csrf_exempt
def data(request):
	#import pdb; pdb.set_trace()
	response = {}
	if request.is_ajax():
		if request.method == 'POST':
			if request.POST.get('date_chart', ''):
				#datetime.strptime(time2					
				end_date = ""
				start_date = datetime.strptime(request.POST['date_start'], "%Y-%m-%d")
				if not request.POST.get('date_end', ''):
					today_list = GregorianToJalali(date.today().year, date.today().month, date.today().day).getJalaliList()	
					today = date(today_list[0], today_list[1], today_list[2])
					end_date = today
				else:
					end_date = datetime.strptime(request.POST['date_end'], "%Y-%m-%d")

				sum = 0
				date_temp = ""
				sums = {}
				_dates = {}
				sums_t = ()
				_dates_t = ()
				_sums_dates = ()

				users = User.objects.all()
				calcs_first = Calcs.objects.filter(user=users[0], pay_date__range=(start_date, end_date)).order_by('pay_date')
				calcs_second = Calcs.objects.filter(user=users[1], pay_date__range=(start_date, end_date)).order_by('pay_date')
				
				for calc in calcs_first:
					if sum == 0:
						date_temp = calc.pay_date
						sum = int(calc.cost)
					else:
						if calc.pay_date == date_temp:
							sum += int(calc.cost)
						else:
							sums['date'] = str(date_temp)
							sums['sum'] = sum
							sums['name'] = users[0].username
							_sums_dates = _sums_dates + (sums,)
							sums = {}
							_dates = {}
							sum = int(calc.cost)
							date_temp = calc.pay_date

				if sum > 0:
					sums['date'] = str(date_temp)
					sums['sum'] = sum
					sums['name'] = users[0].username
					_sums_dates = _sums_dates + (sums,)
					sums = {}
					_dates = {}

				response['costs1'] = _sums_dates

				
				sum = 0;
				date_temp = ""
				sums_t2 = ()

				sums = {}
				_dates = {}
				sums_t = ()
				_dates_t = ()
				_sums_dates = ()


				for calc in calcs_second:
					if sum == 0:
						date_temp = calc.pay_date
						sum = int(calc.cost)
					else:
						if calc.pay_date == date_temp:
							sum += int(calc.cost)
						else:
							sums['date'] = str(date_temp)
							sums['sum'] = sum
							sums['name'] = users[1].username
							_sums_dates = _sums_dates + (sums,)								
							sums = {}
							_dates = {}
							sum = int(calc.cost)
							date_temp = calc.pay_date

							'''
							sums[str(date_temp)] = sum
							sums_t2 = sums_t2 + (sums,)
							sums = {}
							sum = int(calc.cost)
							date_temp = calc.pay_date
							'''

				if sum > 0:
					sums['date'] = str(date_temp)
					sums['sum'] = sum
					sums['name'] = users[0].username
					_sums_dates = _sums_dates + (sums,)
					sums = {}
					_dates = {}

					'''
					sums[str(date_temp)] = sum
					sums_t2 = sums_t2 + (sums,)
					sums = {}
					'''

				response['costs2'] = _sums_dates

				return HttpResponse(json.dumps(response), mimetype="application/json")


			if request.POST.get('date_sum', ''):
				end_date = ""
				start_date = datetime.strptime(request.POST['date_start'], "%Y-%m-%d")
				if not request.POST.get('date_end', ''):
					today_list = GregorianToJalali(date.today().year, date.today().month, date.today().day).getJalaliList()	
					today = date(today_list[0], today_list[1], today_list[2])
					end_date = today
				else:
					end_date = datetime.strptime(request.POST['date_end'], "%Y-%m-%d")

				sum = 0
				first_sum = 0
				second_sum = 0
				sums = ()


				users = User.objects.all()
				calcs_first = Calcs.objects.filter(user=users[0], pay_date__range=(start_date, end_date)).order_by('pay_date')
				calcs_second = Calcs.objects.filter(user=users[1], pay_date__range=(start_date, end_date)).order_by('pay_date')
				
				for calc in calcs_first:						
					sum += int(calc.cost)						

				first_sum = sum
				
				sum = 0

				for calc in calcs_second:
					sum += int(calc.cost)						

				second_sum = sum

				#response['costs2'] = _sums_dates
				#sums = (first_sum, second_sum)
				response['first_sum'] = first_sum
				response['second_sum'] = second_sum

				return HttpResponse(json.dumps(response), mimetype="application/json")



			if request.POST.get('date_cat', ''):
				end_date = ""
				start_date = datetime.strptime(request.POST['date_start'], "%Y-%m-%d")
				if not request.POST.get('date_end', ''):
					today_list = GregorianToJalali(date.today().year, date.today().month, date.today().day).getJalaliList()	
					today = date(today_list[0], today_list[1], today_list[2])
					end_date = today
				else:
					end_date = datetime.strptime(request.POST['date_end'], "%Y-%m-%d")

				sum = 0
				first_cats = {}
				second_cats = {}
				sums = ()



				users = User.objects.all()
				calcs_first = Calcs.objects.filter(user=users[0], pay_date__range=(start_date, end_date)).order_by('pay_date')
				calcs_second = Calcs.objects.filter(user=users[1], pay_date__range=(start_date, end_date)).order_by('pay_date')
				cats = Category.objects.all().order_by('-cat_used')
				
				for cat in cats:
					sum = 0
					for calc in calcs_first:
						if calc.cat_id == cat.id:
							sum += calc.cost
					first_cats[cat.cat_display] = sum
					
				sums = (first_cats,)

				response['first_cats'] = sums

				sums = ()
				sum = 0
				for cat in cats:
					sum = 0
					for calc in calcs_second:
						if calc.cat_id == cat.id:
							sum += calc.cost					
					second_cats[cat.cat_display] = sum
					
				sums = (second_cats,)				
				
				response['second_cats'] = sums

				return HttpResponse(json.dumps(response), mimetype="application/json")