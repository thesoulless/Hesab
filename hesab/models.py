from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    cat 			= models.CharField(max_length=200)
    cat_display 	= models.CharField(max_length=200)
    cat_used 		= models.PositiveIntegerField(default=0)
    update_date 	= models.DateTimeField(['date updated'], auto_now = True)
    pub_date	 	= models.DateTimeField(['date published'], auto_now_add = True)

    def __unicode__(self):
        return self.cat_display
        

class Calcs(models.Model):
	cost 		= models.PositiveIntegerField(default=0)
	pay_date 	= models.DateField(['date payed'])
	user 		= models.ForeignKey(User)
	cat 		= models.ForeignKey(Category)
    
    #def __unicode__(self):
    #    return self.cost