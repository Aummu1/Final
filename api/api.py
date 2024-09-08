from flask import Flask, request, Response
import cv2

app = Flask(__name__)

def gen_frames(rtsp_url):
    vdo = cv2.VideoCapture(rtsp_url)
    while True:
        ret, frame = vdo.read()
        if not ret:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    rtsp_url = request.args.get('url')  # รับ URL จากพารามิเตอร์
    if not rtsp_url:
        return "Error: No RTSP URL provided", 400
    return Response(gen_frames(rtsp_url), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


# --------------------------------------------

# app = Flask(__name__)

# def gen_frames(url):
#     vdo = cv2.VideoCapture(url)
#     while True:
#         ret, frame = vdo.read()
#         if not ret:
#             break
#         ret, buffer = cv2.imencode('.jpg', frame)
#         frame = buffer.tobytes()
#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# @app.route('/video_feed')
# def video_feed():
#     url = request.args.get('url')
#     if not url:
#         return Response(status=400)
#     return Response(gen_frames(url), mimetype='multipart/x-mixed-replace; boundary=frame')

# @app.route('/')
# def index():
#     return render_template('index.html')

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)
