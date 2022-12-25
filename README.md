# image-processing
This project allows you to create resized images and save them in your local machine.
End Point is /api/images
You're expected to pass some queries (image, width, height)
 - If image query is missing, you'll get response <Bad Request .. No Image Selected!!>
 - Otherwise,
    - If Image doesn't exist, you'll get response <Image NOT Found!!>
    - If image exists, check for width & height queries
    - If any of width | height queries is missing, use original width | height
    - If request with same image, width & height queries is sent again, browser will open the previously resized image 
