"use client";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';

function ParkingLot() {

    return (
        <div className='ml-5'>
            <section className="contact" id="ParkingLot">
                <h2 className="heading">ลานจอดรถในระบบ</h2>

                <div className='d-flex justify-content-around align-items-center'>
                    <p className='mb-0'>ชื่อ</p>
                    <Link href="UrlCamera"><p className='card pl-4 pr-4 pt-2 pb-2 mb-0 rounded'>ลานจอดรถวิศวคอมพิวเตอร์</p></Link>
                    <div className="d-flex justify-content-center align-items-center w-14 rounded-circle">
                        <a href="#"><img src="/image/delete.png" className='p-3' alt="" /></a>
                    </div>
                    {/* <div>
                        <a href="">edit</a>
                    </div> */}
                </div>
            </section>
                <div className=" d-flex justify-content-center align-items-center w-14 rounded-circle m-auto mt-5">
                    <Link onClick={()=>{
                        const div1=document.createElement("div")
                        div1.className = "d-flex justify-content-around align-items-center"
                        const p1=document.createElement("p")
                        p1.className = "mb-0"
                        p1.innerText = "ชื่อ"
                        const Link1=document.createElement("a")
                        Link1.className = "card pl-4 pr-4 pt-2 pb-2 mb-0 rounded"
                        Link1.innerText = "ลานจอดรถวิศวคอมพิวเตอร์"
                        Link1.href = "SettingPage"
                        const div2=document.createElement("div")
                        div2.className = "d-flex justify-content-center align-items-center w-14 rounded-circle"
                        const Link2=document.createElement("a")
                        const img1=document.createElement("img")
                        img1.className = "p-3"
                        img1.src = "/image/delete.png"
                        Link2.appendChild(img1)
                        div2.appendChild(Link2)
                        div1.appendChild(p1)
                        div1.appendChild(Link1)
                        div1.appendChild(div2)
                        document.getElementById("ParkingLot").appendChild(div1)
                    }} href="#"><img src="/image/add.png" className='p-3' alt="" /></Link>
                </div>
        </div>
    );
}

export default ParkingLot
