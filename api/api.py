from flask import Flask, request, Response, jsonify, send_file
from flask_cors import CORS
import cv2
import os #สำหรับการจัดการไฟล์และโฟลเดอร์ในระบบ
from PIL import Image
import io
from urllib.parse import unquote
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://appb17.bd2-cloud.net"}})


#ฟังก์ชันนี้ใช้สำหรับอ่านวิดีโอจาก RTSP URL
def gen_frames(rtsp_url):
    vdo = cv2.VideoCapture(rtsp_url) #ใช้เพื่อเปิดการเชื่อมต่อกับกล้อง
    while True:
        ret, frame = vdo.read()
        if not ret:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)  #ถ้าอ่านได้สำเร็จ, จะเข้ารหัสเฟรมเป็น JPEG และแปลงเป็นไบต์
            frame = buffer.tobytes()
            #ใช้เพื่อส่งข้อมูลเฟรมในรูปแบบที่สามารถสตรีมได้
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


#Route สำหรับวิดีโอ
@app.route('/video_feed')
def video_feed():
    rtsp_url = request.args.get('url')  # รับ URL จากพารามิเตอร์
    if not rtsp_url:
        return "Error: No RTSP URL provided", 400
    return Response(gen_frames(rtsp_url), mimetype='multipart/x-mixed-replace; boundary=frame') #คืนค่าผลลัพธ์จาก gen_frames(rtsp_url) ในรูปแบบ multipart/x-mixed-replace ซึ่งเหมาะสำหรับการสตรีมวิดีโอ


#Route สำหรับดึงชื่อไฟล์
@app.route('/get_name_file', methods=['OPTIONS', 'GET'])
def get_name_data_set_in_good_train():
    if request.method == 'OPTIONS':
        response = Response(status=200)
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        return response

    #การค้นหาไฟล์
    subfile = {} #สร้างตัวแปร subfile เพื่อเก็บชื่อไฟล์
    try:
        file_path = os.path.join('/home/parkinglot/Desktop/cpe_real/plateCross')
        files = os.listdir(file_path) #ใช้ os.listdir() เพื่อดึงชื่อไฟล์ในโฟลเดอร์ที่กำหนด
        
        for folder in files:
            folder_path = os.path.join(file_path, folder)
            if os.path.isdir(folder_path):
                subfile[folder] = {}
                for subfolder in os.listdir(folder_path):
                    subfolder_path = os.path.join(folder_path, subfolder)
                    if os.path.isdir(subfolder_path):
                        subfile[folder][subfolder] = {
                            f: f'/imagecpe/{folder}/{subfolder}/{f}'
                            for f in os.listdir(subfolder_path) if f.endswith(('jpg', 'jpeg', 'png')) #ถ้าโฟลเดอร์มีโฟลเดอร์ย่อย, จะทำการดึงชื่อไฟล์ที่มีนามสกุล jpg, jpeg, png และสร้าง URL สำหรับแต่ละไฟล์
                        }

    #การจัดการข้อผิดพลาด
    except FileNotFoundError:
        return jsonify({"error": "Directory not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"files": subfile}), 200


#Route สำหรับแสดงภาพ
@app.route('/imagecpe/<path:folder>/<path:subfolder>/<path:filename>', methods=['GET'])
def show_image_bad_train(folder, subfolder, filename):
    # สร้างเส้นทางที่ถูกต้องสำหรับการเข้าถึงภาพ
    image_path = os.path.join('/home/parkinglot/Desktop/cpe_real/plateCross', folder, subfolder, filename)
    
    if not os.path.exists(image_path):
        return "File not found", 404
    try:
        image = Image.open(image_path)
        image.thumbnail((500, 500)) #เปิดภาพและปรับขนาดให้มีขนาดสูงสุด 500x500 พิกเซล
        img_io = io.BytesIO() #บันทึกภาพลงใน BytesIO และส่งกลับเป็นไฟล์ภาพ JPEG
        image.save(img_io, 'JPEG', quality=85)
        img_io.seek(0)
        return send_file(img_io, mimetype='image/jpeg')
    except Exception as e:
        return f"Error processing image: {str(e)}", 500
    
@app.route('/get_name_file1', methods=['OPTIONS', 'GET'])
def get_name_file_from_topCamSave():
    if request.method == 'OPTIONS':
        response = Response(status=200)
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        return response

    subfile = {}
    try:
        file_path = os.path.join('/home/parkinglot/Desktop/cpe_real/topCamSave')
        files = os.listdir(file_path)
        print(files)  # ตรวจสอบว่าไฟล์โฟลเดอร์ถูกดึงมาได้หรือไม่

        for folder in files:
            folder_path = os.path.join(file_path, folder)
            if os.path.isdir(folder_path):
                # สร้าง dict สำหรับโฟลเดอร์หลัก
                subfile[folder] = {}
                
                # ดึงไฟล์รูปภาพในโฟลเดอร์หลัก
                image_files = [f for f in os.listdir(folder_path) if f.endswith(('jpg', 'jpeg', 'png'))]
                print(f"Image files in {folder}: {image_files}")  # ตรวจสอบไฟล์รูปภาพในโฟลเดอร์หลัก

                subfile[folder] = {
                    f: f'/imagecpe1/{folder}/{f}' for f in image_files
                }

    except FileNotFoundError:
        return jsonify({"error": "Directory not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"files": subfile}), 200

#Route สำหรับแสดงภาพ
@app.route('/imagecpe1/<path:folder>/<path:filename>', methods=['GET'])
def show_image_good_train(folder, filename):
    # สร้างเส้นทางที่ถูกต้องสำหรับการเข้าถึงภาพ
    image_path = os.path.join('/home/parkinglot/Desktop/cpe_real/topCamSave', folder, filename)
    
    if not os.path.exists(image_path):
        return "File not found", 404
    try:
        image = Image.open(image_path)
        image.thumbnail((500, 500)) #เปิดภาพและปรับขนาดให้มีขนาดสูงสุด 500x500 พิกเซล
        img_io = io.BytesIO() #บันทึกภาพลงใน BytesIO และส่งกลับเป็นไฟล์ภาพ JPEG
        image.save(img_io, 'JPEG', quality=85)
        img_io.seek(0)
        return send_file(img_io, mimetype='image/jpeg')
    except Exception as e:
        return f"Error processing image: {str(e)}", 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
