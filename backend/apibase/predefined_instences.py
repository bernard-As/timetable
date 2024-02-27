from apibase.models import ActivityType


def create_predefined_instances():
    ActivityType.objects.get_or_create(name='Classroom Lecture', description="A regular lecture In a regular classroom.")
    ActivityType.objects.get_or_create(name='Classroom Tutorial', description="A tutorial session.")
    ActivityType.objects.get_or_create(name='Studio Lecture', description="A regular lecture In a regular classroom.")
    ActivityType.objects.get_or_create(name='Studio Tutorial', description="A tutorial session.")
    ActivityType.objects.get_or_create(name='Computer Laboratory Lecture', description="A tutorial session.")
    ActivityType.objects.get_or_create(name='Computer Laboratory Tutorial', description="A tutorial session.")
    ActivityType.objects.get_or_create(name='Seminar', description="Seminar session.")
    ActivityType.objects.get_or_create(name='Seminar', description="Seminar session.")
    ActivityType.objects.get_or_create(name='Workshop', description="Workshop session.")