#!/bin/bash
DJANGODIR=$(dirname $(dirname $(cd `dirname $0` && pwd)))
DJANGO_SETTINGS_MODULE=config.settings
cd $DJANGODIR
source env/bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
exec python manage.py runserver 0:9098