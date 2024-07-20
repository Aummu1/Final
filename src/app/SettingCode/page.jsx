"use client";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';

function SettingCode() {

    return (
        <div className='ml-5'>
            <section className="contact" id="contact">
                <h2 className="heading">ข้อมูลลานจอดรถ</h2>

                <form action="">
                    <div className="input-box">
                        <p>ไอดี</p>
                        <input type="text" name="name" placeholder="ID" required />
                        <p>ชื่อลานจอดรถ</p>
                        <input type="text" placeholder="ชื่อลานจอดรถ" required />
                    </div>
                </form>
            </section>

            <section className="contact" id="contact">
                <h2 className="heading">ข้อมูลช่องจอดรถ</h2>
                <form action="">
                    <div className="input-box">
                        <p>ไอดี</p>
                        <input type="text" name="name" placeholder="ID" required />
                        <div className="bg-danger d-flex justify-content-center align-items-center w-12 h-12 rounded-circle m-auto mt-5">
                            <Link href="#"><img src="/image/delete.png" className='p-3' alt="" /></Link>
                        </div>
                        <div className="bg-primary d-flex justify-content-center align-items-center w-12 h-12 rounded-circle m-auto mt-5">
                            <Link href="#"><img src="/image/+.png" className='p-3' alt="" /></Link>
                        </div>
                    </div>
                </form>
                
            </section>

            <section className="contact" id="contact">
                <h2 className="heading">ข้อมูลกล้อง</h2>

                <form action="">
                    <div className="input-box">
                        <p>ไอดี</p>
                        <input type="text" name="name" placeholder="ID" required />
                        <p>หน้าที่ของกล้อง</p>
                        <select className="form-select" aria-label="Default select example" style={{ background: '#f6f6f6', borderRadius: '0.5rem', padding:'1.5rem' }}>
                            <option selected>เลือกเมนูนี้</option>
                            <option style={{ background: '#f6f6f6', borderRadius: '0.5rem' }} value="1">ตรวจจับช่องจอดรถ</option>
                            <option style={{ background: '#f6f6f6', borderRadius: '0.5rem' }} value="2">ตรวจจับทะเบียนรถ</option>
                        </select>
                    </div>
                </form>

                <form action="">
                    <div className="input-box">
                        <p>ไอดี</p>
                        <input type="text" name="name" placeholder="ID" required />
                        <p>หน้าที่ของกล้อง</p>
                        <select className="form-select" aria-label="Default select example" style={{ background: '#f6f6f6', borderRadius: '0.5rem', padding:'1.5rem' }}>
                            <option selected>เลือกเมนูนี้</option>
                            <option style={{ background: '#f6f6f6', borderRadius: '0.5rem' }} value="1">ตรวจจับช่องจอดรถ</option>
                            <option style={{ background: '#f6f6f6', borderRadius: '0.5rem' }} value="2">ตรวจจับทะเบียนรถ</option>
                        </select>
                    </div>
                </form>                
            </section>
        </div>
    );
}

export default SettingCode;
