from apibase.models import *

def shedule_modify_data(item):
        if item==None:
             return
        Iam = Schedule.objects.get(pk=item['id'])
        item['type_name'] = Iam.type.name
        lecturer = Iam.coursegroup.lecturer
        item['lect']={
            'first_name':lecturer.user.first_name,
            'last_name':lecturer.user.last_name,
            'title':lecturer.user.title.shortname,
        }

        try:
        
             if(Lecturer.objects.filter(pk=item['invigilator']).exists()):
                    invi = Lecturer.objects.get(pk=item['invigilator'])
                  
                    item['invigilator'] = invi.user.title.shortname+' '+invi.user.first_name + ' ' + invi.user.last_name
        except:
             pass
        try:
            assistant = Assistant.objects.filter(coursegroup__in=[Iam.coursegroup,]).last()
            print(assistant)
            item['assit']={
                'first_name':assistant.student.user.first_name,
                'last_name':assistant.student.user.last_name,
                'title':'Assist. ',
            }
        except:
            pass
        room = Iam.room
        item['rm'] = {
            'code':room.code,
            'floor_num':room.floor.floor_number,
            'building':room.floor.building.name,
        }
        coursegroup = Iam.coursegroup
        item['cg'] = {
            'name': coursegroup.course.name,
            'code': coursegroup.course.code,
            'group_number':coursegroup.group_number,
        }
        type = Iam.type
        item['tp']={
            'name':type.name,   

        }
        return item
    

def canScheduleDisplay(userPk, schedulePk):
    live_semester = Semester.objects.get(is_current=True)
    try:
          schedule = Schedule.objects.get(pk=schedulePk,semester=live_semester)
    except:
        return False
    if(not userPk):
         if schedule.type.can_other_view:
              return True
         else:
              return False
    else:
          user = Users.objects.get(pk=userPk)
          if Student.objects.filter(user=user.pk).exists():
               if schedule.type.can_std_view:
                    return True
               else:
                    return False
          elif user.credential=='PADM':
              if schedule.type.can_padm_view:
                   return True
              else:
                   return False
          elif user.credential=='SYSADM':
              if schedule.type.can_system_view:
                   return True
              else:
                   return False
          elif user.credential=='VR':
              if schedule.type.can_vcr_view:
                   return True
              else:
                   return False
          elif user.credential=='AD':
              if schedule.type.can_adv_view:
                   return True
              else:
                   return False
          elif user.credential=='HOD':
              if schedule.type.can_hod_view:
                   return True
              else:
                   return False
          elif Lecturer.objects.filter(user=user.pk).exists():
              if schedule.type.can_other_view:
                   return True
              else:
                   return False

              
    