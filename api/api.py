
from flask import Flask, render_template, Response
import cv2

app = Flask(__name__)
frame2 = 0

def gen_frames():
    vdo = cv2.VideoCapture('rtsp://admin:Admin123456@192.168.1.105:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif')
    ret, pic = vdo.read()
    while True:
        ret, frame = vdo.read()
        #cv2.imshow('frame', frame)
        if not ret:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    #Video streaming route. Put this in the src attribute of an img tag
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/')
def index():
    """Video streaming home page."""
    return "hello"


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
