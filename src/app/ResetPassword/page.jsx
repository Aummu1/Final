"use client";

import React, { useEffect } from 'react'; // นำเข้า useEffect จาก React
import 'bootstrap/dist/css/bootstrap.min.css';
import { globals } from "styled-jsx/css";
import 'boxicons/css/boxicons.min.css';
import '../../app/script.js'; 
import { Dice1 } from 'bootstrap-icons-react';

function ResetPassword() {
    return (
        <div>
            <section className="vh-100">
            <div className="container py-5 h-100">
                <div className="row d-flex align-items-center justify-content-center h-100">
                    <div className="col-md-8 col-lg-7 col-xl-6">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                            className="img-fluid" alt="Phone image" />
                    </div>
                    <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                        <form>
                            {/* Email input */}
                            <div className="form-floating mb-5">
                                <input type="password" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                <label for="floatingInput">Old password</label>
                            </div>
                            {/* Password input */}
                            <div className="form-floating mb-5">
                                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                                <label for="floatingPassword">New Password</label>
                            </div>
                            {/* <div className="d-flex justify-content-around align-items-center mb-4"> */}
                                {/* Checkbox */}
                                {/* <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="form1Example3" checked />
                                    <label className="form-check-label" htmlFor="form1Example3"> Remember me </label>
                                </div>
                                <a href="#!">Forgot password?</a>
                            </div> */}
                            {/* Submit button */}
                            <div className="d-grid gap-2">
                                <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg btn-block" onClick={() => {window.location.href = 'AdminPage'}}>Confirm</button>        
                            </div>
                            {/* <div className="divider d-flex align-items-center my-4">
                                <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
                            </div>
                            <a data-mdb-ripple-init className="btn btn-primary btn-lg btn-block" style={{ backgroundColor: '#3b5998' }} href="#!"
                                role="button">
                                <i className="fab fa-facebook-f me-2"></i>Continue with Facebook
                            </a>
                            <a data-mdb-ripple-init className="btn btn-primary btn-lg btn-block" style={{ backgroundColor: '#55acee' }} href="#!"
                                role="button">
                                <i className="fab fa-twitter me-2"></i>Continue with Twitter
                            </a> */}
                        </form>
                    </div>
                </div>
            </div>
        </section>
        </div>
    );
}

export default ResetPassword;
