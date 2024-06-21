from django.db import models

from apibase.models import *

"""C infront stand for core to avoid confusion in imports"""
class SysSeting(models.Model):
    """
    Informations For the system requirement 
    ->will always use the last row for settings
    ->Basic system in minute base [1h=100,30min=50,1h15min=125]
    ->PreferenceImpact holds record about the preferences that impact the object
    ->Z-Index for How deep can it be use depanding on the other (for Euristc Algorithm)
    """
    time_rate = models.IntegerField(default=50)

class CommonC(models.Model):
    """
    Common Model for all models
    """
    status = models.BooleanField()
    preference_impact = models.ManyToManyField(Preference,related_name='time_frame')
    z_index = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TimeFrame(models.Model):
    frame = models.SmallIntegerField()
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='time_frame')

class DayFrame(models.Model):
    day = models.SmallIntegerField()    
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='day_frame')

class DayTimeFrame(models.Model):
    day_frame = models.ForeignKey(DayFrame,on_delete=models.CASCADE)
    time_frame = models.ForeignKey(TimeFrame,on_delete=models.CASCADE)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='day_time_frame')

class BuildingC(models.Model):
    building = models.OneToOneField(Building,on_delete=models.SET_NULL,null=True)
    time_frame = models.ManyToManyField(TimeFrame,on_delete=models.CASCADE)
    common_c = models.ForeignKey(CommonC,on_delete=models.CASCADE,related_name='building_c_frame')



