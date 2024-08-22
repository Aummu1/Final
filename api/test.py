import cv2 as cv
vdo = cv.VideoCapture('rtsp://admin:Admin123456@192.168.1.100:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif')
ret, pic = vdo.read()
while True:
    ret, pic = vdo.read()
    cv.imshow('Full Scene', pic)
    if cv.waitKey(1) & 0xFF == ord('p'):
        break
vdo.release()
cv.destroyAllWindows()