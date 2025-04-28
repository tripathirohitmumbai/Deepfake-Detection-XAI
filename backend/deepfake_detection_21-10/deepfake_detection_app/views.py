from django.shortcuts import render

from django.shortcuts import render
from django.db.models import Q
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import authenticate,login as django_login, logout as django_logout
from django.contrib.auth.models import User
from rest_framework.views import APIView
from .serializers import (UserSerializer,HistoryDBSerializers)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.pagination import PageNumberPagination
from django.http import JsonResponse
import os
from dotenv import load_dotenv

from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode# send the reset link to the user
from django.urls import reverse
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from .models import PasswordResetToken
from django.utils import timezone
from uuid import uuid4
from datetime import timedelta
from django.contrib.auth import get_user_model
from rest_framework import viewsets
from .models import History_DB



load_dotenv()
ACCESS_TOKEN_EXPIRES_IN = 15
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# clients = OpenAI(api_key=OPENAI_API_KEY)

# base url append
def baseurl(request):
  """
  Return a BASE_URL template context for the current request.
  """
  if request.is_secure():
    scheme = "https://"
  else:
    scheme = "http://"

  return scheme + request.get_host()


#Get User email
def get_user(email):
  try:
    user = User.objects.filter(
      # Q(email=email.lower())
      Q(email=email)
      | Q(username=email)
    ).first()
    if user:
      return [True, user]
    else:
      return [False, None]
  except:
    return [False, None]


#RegisterAPI
class UserRegistrationView(APIView):
    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            user = User.objects.filter(email=email).first()
            if user:
                token, created = Token.objects.get_or_create(user=user)
                return Response({"token": token.key},
                                status=status.HTTP_200_OK)
            else:
                user = serializer.save()
                token = Token.objects.create(user=user)
                return Response({"token": token.key,
                                 "data":serializer.data},
                                status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#Login View API
class LoginView(APIView):
  def post(self, request):
    try:
      email = request.data.get("username", None)
      password = request.data.get("password", None)

      if email and password:
        user = get_user(email)

        if user[0]:
          if not not user[1].password:
            user_data = authenticate(username=user[1], password=password)

            if user_data:
              django_login(request, user[1])
              token, created = Token.objects.get_or_create(user=user[1])
              return Response({
                "status": status.HTTP_200_OK,
                "message": "Successfully logged in",
                "user_id": user_data.id,
                "token": token.key,
                "base_url": baseurl(request),
              })
            else:
              content = {
                "status": status.HTTP_204_NO_CONTENT,
                "message": "Unable to Login with given credentials"
              }
              return Response(content)
          else:
            content = {
              "status": status.HTTP_204_NO_CONTENT,
              "message": "Please reset your password"
            }
            return Response(content)
        else:
          content = {
            "status": status.HTTP_204_NO_CONTENT,
            "message": "Unable to Login with given credentials"
          }
          return Response(content)
      return Response({
        "data": [],
        "status": status.HTTP_401_UNAUTHORIZED,
        "message": "Unable to login with given credentials"
      })
    except Exception as e:
      context = {
        "status": status.HTTP_400_BAD_REQUEST,
        "message": str(e)
      }
      return Response(context)



#LogoutView API
class LogoutView(APIView):
    authentication_classes = (TokenAuthentication,)
    def post(self, request, format=None):
        user_id = request.user.id
        # user = request.user
        if user_id:
            logged_in_user_id = User.objects.filter(id=user_id).first()
            if logged_in_user_id:
                django_logout(request)
            content = {"status": 200, "message": "LogOut Successfully"}
        else:
            content = {"status": 400, "message": "Invalid token"}

        return Response(content, status=status.HTTP_200_OK)
    


class PasswordResetAPI(APIView):
    def post(self, request):
        email = request.data.get('email')
        if email:
            user_model = get_user_model()
            try:
                user = user_model.objects.get(email=email)
            except user_model.DoesNotExist:
                return Response({'error': 'No user found with this email.'}, status=status.HTTP_404_NOT_FOUND)

            # Generate a unique token
            token = uuid4()

            # Store token in the database
            PasswordResetToken.objects.create(user=user, token=token)

            # Construct reset URL
            reset_url = f"{settings.FRONTEND_URL}/forgot-password?token={token}"

            # Send password reset email
            send_mail(
                'Password Reset Link',
                f'Use the following link to reset your password: {reset_url}',
                settings.EMAIL_HOST_USER,
                [user.email],
            )

            return Response({'message': 'Password reset link sent successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Email not provided.'}, status=status.HTTP_400_BAD_REQUEST)
        
class PasswordChangeAPI(APIView):
    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if token:
            try:
                # Retrieve the user associated with the token
                reset_token = PasswordResetToken.objects.get(token=token)
                user = reset_token.user

                # Check if the token is older than 30 minutes
                if timezone.now() > reset_token.created_at + timedelta(minutes=30):
                    return Response({'error': 'Token has expired.'}, status=status.HTTP_400_BAD_REQUEST)
            except PasswordResetToken.DoesNotExist:
                return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)

            if new_password == confirm_password:
                user.set_password(new_password)
                user.save()

                # Optionally, delete the token after use
                reset_token.delete()

                return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Token not provided.'}, status=status.HTTP_400_BAD_REQUEST)

## Imagedetection API

# from .image_detection_pipeline import predict_image
# from rest_framework.parsers import MultiPartParser, FormParser
# #
# class ImageDetectionAPIView(APIView):
#     parser_classes = (MultiPartParser, FormParser)
#
#     def post(self, request, *args, **kwargs):
#         file_obj = request.data['file']
#         print(file_obj,type(file_obj),"-----------+++++++++++++++++file obj")
#         file_path = os.path.join(settings.MEDIA_ROOT, file_obj.name)
#         print(file_path,"0000000000000000000000")
#
#         with open(file_path, 'wb+') as f:
#             for chunk in file_obj.chunks():
#                 f.write(chunk)
#             if file_obj.name.lower().endswith(('.jpg', '.jpeg', '.png')):
#                 global result
#                 result = predict_image(file_path)
#                 print(result,"--------API res")
#                 print("-------------before")
#                 # os.remove(file_path)
#                 print("----gggafter ")
#
#         return Response({'result': result})

from .video_detection_pipeline import classify_videos_in_folder,extract_frames_from_folder,loaded_model
# from .image_detection_pipeline import predict_image
# from .image_pipeline import predict_image_with_gradcam
from .image_detection_pipeline import predict_image_with_gradcam

from rest_framework.parsers import MultiPartParser, FormParser
# class ImageDetectionAPIView(APIView):
#     parser_classes = (MultiPartParser, FormParser)

# class DetectionAPIView(APIView):
#     parser_classes = (MultiPartParser, FormParser)
#
#     def post(self, request, *args, **kwargs):
#         file_obj = request.data['file']
#         print(file_obj, type(file_obj), "-----------+++++++++++++++++file obj")
#         file_path = os.path.join(settings.MEDIA_ROOT, file_obj.name)
#         print(file_path)
#
#         try:
#             # Save the file to the specified path
#             with open(file_path, 'wb+') as f:
#                 for chunk in file_obj.chunks():
#                     f.write(chunk)
#
#             # Determine if the file is an image or a video
#             if file_obj.name.lower().endswith(('.jpg', '.jpeg', '.png')):
#                 result = predict_image(file_path)
#             elif file_obj.name.lower().endswith(('.mp4', '.avi', '.mov')):
#                 result = classify_videos_in_folder(loaded_model, file_path)
#             else:
#                 result = 'Unsupported file type'
#
#             # Uncomment to remove the file after processing
#             # os.remove(file_path)
#
#         except Exception as e:
#             # Log or print the exception for debugging purposes
#             print(f"Error processing file: {e}")
#             result = 'Error processing file'
#         os.remove(file_path)
#         return Response({'result': result})

#withoutheatmap
# class DetectionAPIView(APIView):
#     parser_classes = (MultiPartParser, FormParser)
#
#     def post(self, request, *args, **kwargs):
#         file_obj = request.data['file']
#         file_path = os.path.join(settings.MEDIA_ROOT, file_obj.name)
#
#         try:
#             # Save the file to the specified path
#             with open(file_path, 'wb+') as f:
#                 for chunk in file_obj.chunks():
#                     f.write(chunk)
#
#             # Determine if the file is an image or a video
#             if file_obj.name.lower().endswith(('.jpg', '.jpeg', '.png')):
#                 result = predict_image(file_path)
#                 print(result, 'pppppppppppppppppppp')
#             elif file_obj.name.lower().endswith(('.mp4', '.avi', '.mov')):
#                 result = classify_videos_in_folder(loaded_model, file_path)
#                 # print(result, 'pppppppppppppppppppp')
#                 print(type(result))
#             else:
#                 result = ['unsupported', 0, 0]
#
#         except Exception as e:
#             print(f"Error processing file: {e}")
#             result = ['error', 0, 0]
#         finally:
#             os.remove(file_path)
#
#         return Response(result)

#new imcluded heatmap
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.conf import settings
import os
# class DetectionAPIView(APIView):
#     parser_classes = (MultiPartParser, FormParser)
#
#     def post(self, request, *args, **kwargs):
#         file_obj = request.data['file']
#         file_path = os.path.join(settings.MEDIA_ROOT, file_obj.name)
#
#         try:
#             # Save the file to the specified path
#             with open(file_path, 'wb+') as f:
#                 for chunk in file_obj.chunks():
#                     f.write(chunk)
#
#             # Determine if the file is an image or a video
#             if file_obj.name.lower().endswith(('.jpg', '.jpeg', '.png')):
#                 result = predict_image(file_path)
#             elif file_obj.name.lower().endswith(('.mp4', '.avi', '.mov')):
#                 result = classify_videos_in_folder(loaded_model, file_path)
#             else:
#                 result = {"error": "Unsupported file type"}
#
#         except Exception as e:
#             print(f"Error processing file: {e}")
#             result = {"error": str(e)}
#         finally:
#             # Clean up the uploaded file
#             if os.path.exists(file_path):
#                 os.remove(file_path)
#
#         return Response(result)

#26_aug(Heatmap_excluded)
# class DetectionAPIView(APIView):
#     parser_classes = (MultiPartParser, FormParser)
#
#     def post(self, request, *args, **kwargs):
#         file_obj = request.data['file']
#         file_path = os.path.join(settings.MEDIA_ROOT, file_obj.name)
#
#         try:
#             # Save the file to the specified path
#             with open(file_path, 'wb+') as f:
#                 for chunk in file_obj.chunks():
#                     f.write(chunk)
#
#             # Determine if the file is an image or a video
#             if file_obj.name.lower().endswith(('.jpg', '.jpeg', '.png')):
#                 result = predict_image(file_path)
#             elif file_obj.name.lower().endswith(('.mp4', '.avi', '.mov')):
#                 result = classify_videos_in_folder(loaded_model, file_path)
#             else:
#                 result = {"error": "Unsupported file type"}
#
#         except Exception as e:
#             print(f"Error processing file: {e}")
#             result = {"error": str(e)}
#         finally:
#             # Clean up the uploaded file
#             if os.path.exists(file_path):
#                 os.remove(file_path)
#
#         return Response(result)

#video detection API
# class VideoDetectionAPIView(APIView):
#     parser_classes = (MultiPartParser, FormParser)
#
#     def post(self, request, *args, **kwargs):
#         file_obj = request.data['file']
#         print(file_obj, type(file_obj), "--------------file object")
#         file_path = os.path.join(settings.MEDIA_ROOT, file_obj.name)
#         print(file_path)
#
#         with open(file_path, 'wb+') as f:
#             for chunk in file_obj.chunks():
#                 f.write(chunk)
#             if file_obj.name.lower().endswith(('.mp4', '.avi', '.mov')):
#                 # Call the classify function with the loaded model
#                 result = classify_videos_in_folder(loaded_model, file_path)
#
#                 print(result, "----------result")
#
#             else:
#                 result = 'Unsupported file type'
#             # print(result, "--------API res")
#             # print("-------------before")
#             # os.remove(file_path)  # Uncomment this to remove the file after processing
#
#
#         return Response({'result': result})

#heatmap runing 16
# class DetectionAPIView(APIView):
#     parser_classes = (MultiPartParser, FormParser)
#
#     def post(self, request, *args, **kwargs):
#         file_obj = request.FILES['file']
#         file_path = os.path.join(settings.MEDIA_ROOT, file_obj.name)
#         print('file path+++++++++++++',file_path)
#
#         try:
#             # Save the file to the specified path
#             with open(file_path, 'wb+') as f:
#                 for chunk in file_obj.chunks():
#                     f.write(chunk)
#
#
#             # Determine if the file is an image or a video
#             if file_obj.name.lower().endswith(('.jpg', '.jpeg', '.png')):
#                 # result = predict_image_with_gradcam(file_path)  # Updated function call to include Grad-CAM
#                 result = predict_image_with_gradcam(file_path)  # Updated function call to include Grad-CAM
#
#                 # Modify the gradcam_heatmap value
#                 print(type(result), result, "_________________result")
#                 for item in result:
#
#                     # item["gradcam_heatmap"] = baseurl(request)+"/"+item["gradcam_heatmap"]
#                     item["gradcam_heatmap"] = baseurl(request)+"/"+item["gradcam_heatmap"]
#                 # heatmap_img=baseurl(request)+result["gradcam_heatmap"]
#
#                     print(item["gradcam_heatmap"],"----item]--gggggggggggg-")
#
            # elif file_obj.name.lower().endswith(('.mp4', '.avi', '.mov')):
            #     # Call the classify function with the loaded model
            #     result = classify_videos_in_folder(loaded_model, file_path)
            # else:
            #     result = {"error": "Unsupported file type"}
#
#         except Exception as e:
#             print(f"Error processing file: {e}")
#             result = {"error": str(e)}
#         finally:
#             # Clean up the uploaded file
#             if os.path.exists(file_path):
#                 os.remove(file_path)
#
#         return Response(result)


###with db

# class DetectionAPIView(APIView):
#     parser_classes = (MultiPartParser, FormParser)
#     permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access this view
#
#     def post(self, request, *args, **kwargs):
#         file_obj = request.FILES['file']
#         file_path = os.path.join(settings.MEDIA_ROOT, file_obj.name)
#         print('file path+++++++++++++', file_path)
#
#         try:
#             # Save the file to the specified path
#             with open(file_path, 'wb+') as f:
#                 for chunk in file_obj.chunks():
#                     f.write(chunk)
#
#             print(file_obj.name,"------------uploaded file")
#             # Determine if the file is an image or a video
#             if file_obj.name.lower().endswith(('.jpg', '.jpeg', '.png')):
#                 result = predict_image_with_gradcam(file_path)  # Updated function call to include Grad-CAM
#
#                 print(result,"+++++++++++++++result images")
#
#                 # Modify the gradcam_heatmap value
#                 for item in result:
#                     item["gradcam_heatmap"] = baseurl(request) + "/" + item["gradcam_heatmap"]
#
#                 predicted_class = result[0]['predicted_class']
#                 fake_percentage = result[0]['fake_percentage']
#                 real_percentage = result[0]['real_percentage']
#                 gradcam_heatmap = result[0]['gradcam_heatmap']
#
#             # elif file_obj.name.lower().endswith(('.mp4', '.avi', '.mov')):
#             #     result = classify_videos_in_folder(loaded_model, file_path)
#             #     predicted_class = result['predicted_class']
#             #     fake_percentage = result['fake_percentage']
#             #     real_percentage = result['real_percentage']
#             #     gradcam_heatmap = result['gradcam_heatmap']
#             #
#             # elif file_obj.name.lower().endswith(('.mp4', '.avi', '.mov')):
#             #     # Call the classify function with the loaded model
#             #     result = classify_videos_in_folder(loaded_model, file_path)
#             # # else:
#             # #     result = {"error": "Unsupported file type"}
#             # else:
#             #     return Response({"error": "Unsupported file type"}, status=400)
#
#             # elif file_obj.name.lower().endswith(('.mp4', '.avi', '.mov')):
#             #     # Call the classify function with the loaded model
#             #     result = classify_videos_in_folder(loaded_model, file_path)
#             #
#             #     # # Assume result for videos includes similar output format
#             #     predicted_class = result['predicted_class']  # Ensure your classify function returns this
#             #     fake_percentage = result['fake_percentage']  # Ensure your classify function returns this
#             #     real_percentage = result['real_percentage']  # Ensure your classify function returns this
#
#             # #new 18
#             #
#             elif file_obj.name.lower().endswith(('.mp4', '.avi', '.mov')):
#                 # Call the classify function with the loaded model
#                 result = classify_videos_in_folder(loaded_model, file_path)
#             # else:
#             #     result = {"error": "Unsupported file type"}
#
#             else:
#                 return Response({"error": "Unsupported file type"}, status=400)
#
#             # Save the results in the database
#             history_record = History_DB(
#                 user_name=request.user,  # Associate with the authenticated user
#                 Image_video_data=file_obj.name,  # Save the file name or path if needed
#                 prdicted_percentage_data=f"Fake: {fake_percentage}, Real: {real_percentage}",
#                 Result=predicted_class
#             )
#             history_record.save()  # Save the record to the database
#
#         except Exception as e:
#             print(f"Error processing file: {e}")
#             return Response({"error": str(e)}, status=500)
#         finally:
#             # Clean up the uploaded file
#             if os.path.exists(file_path):
#                 os.remove(file_path)
#
#         return Response(result)


#####new 18 with dirok

class DetectionAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access this view

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES['file']
        file_path = os.path.join(settings.MEDIA_ROOT, file_obj.name)
        print('file path+++++++++++++', file_path)

        try:

            print(file_obj.name,"----------file uploaded name")
            # Ensure the media directory exists
            os.makedirs(settings.MEDIA_ROOT, exist_ok=True)

            # Save the file to the specified path
            with open(file_path, 'wb+') as f:
                for chunk in file_obj.chunks():
                    f.write(chunk)

            # Determine if the file is an image or a video
            if file_obj.name.lower().endswith(('.jpg', '.jpeg', '.png')):
                result = predict_image_with_gradcam(file_path)  # Updated function call to include Grad-CAM

                print(result, "+++++++++++++++result images")

                # Modify the gradcam_heatmap value
                for item in result:
                    item["gradcam_heatmap"] = baseurl(request) + "/" + item["gradcam_heatmap"]

                predicted_class = result[0]['predicted_class']
                fake_percentage = result[0]['fake_percentage']
                real_percentage = result[0]['real_percentage']
                gradcam_heatmap = result[0]['gradcam_heatmap']

            # elif file_obj.name.lower().endswith(('.mp4', '.avi', '.mov')):
            #     result = classify_videos_in_folder(loaded_model, file_path)
            #     predicted_class = result['predicted_class']
            #     fake_percentage = result['fake_percentage']
            #     real_percentage = result['real_percentage']
            #     # gradcam_heatmap = result['gradcam_heatmap']
            # else:
            #     return Response({"error": "Unsupported file type"}, status=400)

            elif file_obj.name.lower().endswith(('.mp4', '.avi', '.mov')):
                result = classify_videos_in_folder(loaded_model, file_path)

                # Check if the result is a list and handle it accordingly
                if isinstance(result, list) and len(result) > 0:
                    predicted_class = result[0]['predicted_class']
                    fake_percentage = result[0]['fake_percentage']
                    real_percentage = result[0]['real_percentage']
                    # gradcam_heatmap = result[0]['gradcam_heatmap']
                else:
                    return Response({"error": "No results found for the video."}, status=400)

            # Save the results in the database
            history_record = History_DB(
                user_name=request.user,
                Image_video_data=file_obj.name,
                prdicted_percentage_data=f"Fake: {fake_percentage}, Real: {real_percentage}",
                Result=predicted_class
            )
            history_record.save()

        except Exception as e:
            print(f"Error processing file: {e}")
            return Response({"error": str(e)}, status=500)

        finally:
            # Clean up the uploaded file
            if os.path.exists(file_path):
                os.remove(file_path)

        return Response(result)

class UserHistoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the authenticated user
        user = request.user
        print(user, "----------------user ")
        # Filter the history records for the authenticated user
        history_records = History_DB.objects.filter(user_name=user)

        # Serialize the data
        serializer = HistoryDBSerializers(history_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


