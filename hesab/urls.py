from django.conf.urls.defaults import *
from hesab.views import *

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
	url(r'^admin/', include(admin.site.urls)),

    # Main web portal entrance.
    (r'^$', 'hesab.views.main_page'),

    # Login / logout.
	(r'^login/$', 'django.contrib.auth.views.login'),
	(r'^logout/$', logout_page),
	(r'^addcat/$', add_cat),
	(r'^stat/$', stat),
)