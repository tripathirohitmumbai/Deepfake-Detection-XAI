from django.db import models

from django.contrib.auth import get_user_model

User = get_user_model()


# for store the  passord reset token
class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.email} - {self.token}'


######## S.no Image/ Video Real %age Fake %age Result (Real / Fake)


class History_DB(models.Model):
    user_name=models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)
    Image_video_data= models.CharField(max_length=1025,null=True,blank=True)
    prdicted_percentage_data=models.CharField(max_length=1025,null=True,blank=True)
    Result=models.CharField(max_length=1025,null=True,blank=True)

    def __str__(self):
        return f"data of {self.user_name}"
