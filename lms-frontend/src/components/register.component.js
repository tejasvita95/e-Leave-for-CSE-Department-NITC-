import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import DatePicker from 'react-datepicker';
import Select from 'react-select'

import 'react-datepicker/dist/react-datepicker.css'

import AuthService from "../services/auth.service";


//options for marital status 
const designationOptions = [
  { value: "Scholar", label: "Scholar" },
  { value: "Professor", label: "Professor" },
  { value: "HOD", label: "HOD" },
  { value: "AssistentProfessor", label: "Assistent Professor" },
  { value: "NonTeachingStaff", label: "Non-Teaching Staff" }
];

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 3 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};


const vfirstName = value => {
  if (value.length < 3 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The firstName must be between 3 and 20 characters.
      </div>
    );
  }
};

// const vlastName = value => {
//   if (value.length < 3 || value.length > 40) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         The lastName must be between 3 and 40 characters.
//       </div>
//     );
//   }
// };

//using regex to check for mobile number
const vmobileNo = value => {
  if (!(value.length == 10 && /^([0-9]*)$/g.test(value.trim()))) {
    return (
      <div className="alert alert-danger" role="alert">
        Please enter a valid mobile number.
      </div>
    );
  }
};

export default class Register extends Component {

  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeconfirmPassword = this.onChangeconfirmPassword.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    //this.onChangeJoinDate = this.onChangeJoinDate.bind(this);
    this.onChangeMobileNo = this.onChangeMobileNo.bind(this);

    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      joinDate: new Date(),
      email: "",
      mobileNo: "",
      designation: "",
      sickLeave: 0,
      casualLeave: 0,
      earnedLeave: 0,
      successful: false,
      message: "",
      formErrors:{
        confirmPassword:""
      }
    };
  }

  onChangeUsername(e) { this.setState({ username: e.target.value }); }
  onChangeEmail(e) { this.setState({ email: e.target.value }); }
  onChangePassword(e) { this.setState({ password: e.target.value }); }
  onChangeconfirmPassword(e) { this.setState({ confirmPassword: e.target.value }); }
  onChangeFirstName(e) { this.setState({ firstName: e.target.value }); }
  onChangeLastName(e) { this.setState({ lastName: e.target.value }); }
  //handleDateChange(e) { this.setState({ joinDate: e.target.value});}
  onChangeMobileNo(e) { this.setState({ mobileNo: e.target.value }); }
  //handleDesignationChange(e) { this.setState({ designation: e.target.value});}


  handleDesignationChange = (op) => {
    this.setState({
      designation: op
    })
    // console.log("maritalstatus",this.state.designation)
  }

  handleDateChange = (date) => {
    this.setState({
      joinDate: date
    })
    //console.log("DOB",this.state.joinDate)
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });
    this.form.validateAll();

    if(!this.matchPassword()){
        return ;
    }
    var joiningDate = this.state.joinDate.getDate() + '-' + (this.state.joinDate.getMonth() + 1) + '-' + this.state.joinDate.getFullYear();
    let user = {
      username: this.state.username,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      joinDate: joiningDate,
      email: this.state.email,
      mobileNo: this.state.mobileNo,
      designation: this.state.designation.value
    }
    console.log("User", user);
    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(user).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }
  matchPassword(){
    let errors = {};
    let isValid=true;
    if(this.state.password != this.state.confirmPassword){
      isValid=false;
      errors["confirmPassword"] = "Passwords don't match";
    }
    this.setState({
      formErrors: errors
    });
    return isValid;
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="container col-md-6">
          {/* <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          /> */}

          <Form
            onSubmit={this.handleRegister}
            ref={c => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="required" htmlFor="username">Username</label>

                    <Input
                      type="text"
                      className="form-control"
                      name="username"
                      value={this.state.username}
                      onChange={this.onChangeUsername}
                      validations={[required, vusername]}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label className="required" htmlFor="password">Password</label>
                    <Input
                      type="password"
                      className="form-control"
                      name="password"
                      value={this.state.password}
                      onChange={this.onChangePassword}
                      validations={[required, vpassword]}
                    />
                  </div>


                  <div className="form-group col-md-6">
                    <label className="required" htmlFor="password">Confirm Password</label>
                    <Input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={this.state.confirmPassword}
                      onChange={this.onChangeconfirmPassword}
                      validations={[required]}
                    />
                     <div className="text-danger">{this.state.formErrors.confirmPassword}</div>
                  </div>


                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="required" htmlFor="email">Email</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="email"
                      value={this.state.email}
                      onChange={this.onChangeEmail}
                      validations={[required, email]}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label className="required" htmlFor="joinDate">Join Date</label>
                    <DatePicker
                      name="joinDate"
                      selected={this.state.joinDate}
                      dateFormat='dd-MM-yyyy'
                      maxDate={new Date()}
                      showYearDropdown
                      scrollableYearDropdown="true"
                      onChange={this.handleDateChange}
                    />

                  </div>
                </div>

                <div className="form-group">
                  <label className="required" htmlFor="firstName">First Name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={this.onChangeFirstName}
                    validations={[required, vfirstName]}
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.onChangeLastName}
                  //validations={[vlastName]}
                  />
                </div>

                <div className="form-group">
                  <label className="required" htmlFor="mobileNo">Contact </label>
                  <Input
                    className="form-control"
                    name="mobileNo"
                    value={this.state.mobileNo}
                    onChange={this.onChangeMobileNo}
                    validations={[required, vmobileNo]}
                  />
                </div>

                <div className="form-group">
                  <label className="required" >Designation </label>
                  <Select name="designation"
                    value={this.state.designation}
                    onChange={this.handleDesignationChange}
                    options={designationOptions}
                  />
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block">Sign Up</button>
                </div>
              </div>
            )}
              <div className="form-group" >
               <a href="/login" style={{textAlign:"center"}}> Already registered? Click here to login.</a>
              </div>
            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}
