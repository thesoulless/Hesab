from django.db import models

class Category(models.Model):
    cat 			= models.CharField(max_length=200)
    cat_display 	= models.CharField(max_length=200)
    cat_used 		= models.IntegerField(default=0)
    update_date 	= models.DateTimeField(['date updated'], auto_now = True)
    pub_date	 	= models.DateTimeField(['date published'], auto_now_add = True)

    def __unicode__(self):
        return self.cat_display    