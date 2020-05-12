from flask import Flask, Blueprint, request, make_response
from json2html import *
import json
import base64

from api.functions.utilities import *
from api.functions.validation import *
from api.functions.helpers import *

s3_images_api = Blueprint('s3_images_api', __name__)

## --------------------------------------------------------------------##
## Images ENDPOINT Glossary
## --------------------------------------------------------------------##
##
## Upload an image to S3                       POST /api/images/s3
## TODO Retrieve an image from S3                   GET /api/images/s3/<iid>
## TODO Update an image in S3                       PATCH /api/images/s3/<iid>
## TODO Delete an Image                             DELETE /api/images/s3/<iid>
##
## --------------------------------------------------------------------##

## Declare Return Messages
msg_pass = json.dumps({"Success": "Endpoint Called"}, indent=4, separators=(',', ':'))
msg_fail = json.dumps({"Error": "Richard, what did you do?"}, indent=4, separators=(',', ':'))
msg_accept_type = json.dumps({"Error": "Accept Type Invalid - Endpoint Only Returns JSON"}, indent=3, separators=(',', ':'))
msg_content_type = json.dumps({"Error": "Content-Type Invalid - Endpoint Requires JSON"}, indent=3, separators=(',', ':'))
msg_invl = json.dumps({"Error": "Invalid Input"}, indent=4, separators=(',', ':'))
msg_miss = json.dumps({"Error": "Missing At Least One Attribute"}, indent=4, separators=(',', ':'))
msg_uniq = json.dumps({"Error": "Project 'title' must be unique"}, indent=4, separators=(',', ':'))
msg_none = json.dumps({"Error": "No asset exists with that ID"}, indent=4, separators=(',', ':'))


## -------------------------------------------##
## Upload image to S3
## -------------------------------------------##
@s3_images_api.route('/api/s3/images', methods=['POST'])
def createImage():
    if request.content_type != "application/json":
        return(makeResponse(msg_content_type), 406)
    elif 'application/json' not in request.accept_mimetypes:
        return(makeResponse(msg_accept_type), 406)
    else:
        try:
            # Get request information
            content = request.get_json()
            
            # Check for All Required Image Attributes & Validate
            try:
                if not content["base64_img_string"] and not content['key']:
                    return(makeResponse(msg_invl), 400)
                else:
                    img = base64.b64decode(content['base64_img_string'])
                    store_image(img, content['key']) 
            except:
                return(makeResponse(msg_miss), 400)

            # Write success response
            msg_pass = json.dumps(
                [{ "TODO": TODO, "self": request.url + "/" + str(new_id) }],
                indent=4, separators=(',', ':'), default=str
            )
                
            return(makeResponse(msg_pass), 201)

        except:
            try: 
                console.log("test")
            except:
                pass
            return(makeResponse(msg_fail), 500)
    
## -------------------------------------------##
## View an Image
## -------------------------------------------##
@s3_images_api.route('/api/images/<iid>', methods=['GET'])
def viewImage(iid):
    
    if 'application/json' in request.accept_mimetypes:

        try:
            # Open DB connection and query for images
            con = dbconnect()
            query = ("SELECT iid, project, observation, file_name, file_type, file_path from images "
                        "WHERE iid = " + iid + ";")
            cursor = con.cursor()
            cursor.execute(query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()

            image_list = []
            if len(results) > 0:
                for row in results:
                    url = (request.url,)
                    new_tup = row + url
                    image_list.append(dict(zip(row_headers, new_tup)))

            cursor.close()
            disconnect(con)

            return(makeResponse(json.dumps(
                image_list, 
                indent=2,
                separators=(',', ':'))), 200)

        except:
            try: 
                if cursor:
                    cursor.close()
                if con:
                    disconnect(con)
            except:
                pass
            return(makeResponse(msg_fail), 500)
    else:
        return(makeResponse(msg_accept_type), 406)


## -------------------------------------------##
## Edit an Image
## -------------------------------------------##
@s3_images_api.route('/api/images/<iid>', methods=['PATCH'])
def patchImage(iid):

    if request.content_type != "application/json":
        return(makeResponse(msg_content_type), 406)
    elif 'application/json' not in request.accept_mimetypes:
        return(makeResponse(msg_accept_type), 406)
    else:
        try:
            # Get request values
            content = request.get_json()

            valid = doesIidExist(iid)
            if not valid:
                return(makeResponse(msg_none), 404)

            ## Build UPDATE String
            update = createImageUpdateQuery(content, iid)
            
            if update[0]:
                con = dbconnect()
                cursor = con.cursor()
                cursor.execute(update[1])
                con.commit()

            ## Retrieve the updated object
            new_query = ("select iid, project, observation, file_name, file_type, file_path "
                    "from images where iid = " + iid + ";")
            cursor.execute(new_query)
            row_headers=[x[0] for x in cursor.description]
            row_headers.append('self')
            results = cursor.fetchall()

            image_list = []
            for row in results:
                url = (request.url,)
                new_tup = row + url
                image_list.append(dict(zip(row_headers, new_tup)))

            ## Return the new object JSON
            cursor.close()
            disconnect(con)

            return(makeResponse(json.dumps(
                image_list, 
                indent=2,
                separators=(',', ':'),
                default=str)), 201)

        except:
            try: 
                if cursor:
                    cursor.close()
                if con:
                    disconnect(con)
            except:
                pass
            return(makeResponse(msg_fail), 500)
 
## -------------------------------------------##
## Delete an Image
## -------------------------------------------##
@s3_images_api.route('/api/images/<iid>', methods=['DELETE'])
def deleteImage(iid):
    try:
        
        # Check if Iid exists
        if not doesIidExist(iid):
            return(makeResponse(msg_none), 404)
        else:
            # Delete Image
            query = ("DELETE from images WHERE iid = " + iid + ";")
            con = dbconnect()
            cursor = con.cursor()
            cursor.execute(query)
            con.commit()
            cursor.close()
            disconnect(con)
            return(makeResponse(''), 204)

    except:
        try: 
            if cursor:
                cursor.close()
            if con:
                disconnect(con)
        except:
            pass
        return(makeResponse(msg_fail), 500)
