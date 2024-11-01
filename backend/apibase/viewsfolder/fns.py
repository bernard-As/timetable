from apibase.models import *

def shedule_modify_data(item):
        Iam = Schedule.objects.get(pk=item['id'])
        item['type_name'] = Iam.type.name
        lecturer = Iam.coursegroup.lecturer
        item['lect']={
            'first_name':lecturer.user.first_name,
            'last_name':lecturer.user.last_name,
            'title':lecturer.user.title.shortname,
        }
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
    schedule = Schedule.objects.get(pk=schedulePk)
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
        elif Lecturer.objects.filter(user=user.pk).exists():
             if schedule.type.can_lect_view:
                  return True
             else:
                  return False
        
              
    