import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { AddUser } from "../../postRequest";
import { useEffect, useState } from "react";
import { color } from "@mui/system";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [user,setUser]=useState({

    'Username':'',
    'Name':'',
    'Surname':'',
    'Email':'',
    'Phone':'',
    'Address':'',
    'Password':'',
  })



  const clearForm = () => {
    setFile('')
    setUser({
    'Username':'',
    'Name':'',
    'Surname':'',
    'Email':'',
    'Phone':'',
    'Address':'',
    'Password':'',
    })
  }
  const { mutate: CreateUser, isLoading, data, isError, isSuccess, error } = AddUser();
  function handleSubmit(e) {
    e.preventDefault();
    console.log(user)
    const formData=new FormData()
    formData.append('file',file)
    formData.append('Username',user.Username)
    formData.append('Name',user.Name)
    formData.append('Surname',user.Surname)
    formData.append('Email',user.Email)
    formData.append('Phone',user.Phone)
    formData.append('Address',user.Address)
    formData.append('Password',user.Password)
    // const PostData = { Username, Name, Surname, Email, Phone, Address, Password, file }

    CreateUser(formData)
 
    clearForm()
    

  
  }
  
  


  return (
    <>
      <div className="new">
        <Sidebar />
        <div className="newContainer">
          <Navbar />
          <div className="top">
            <h1>{title}</h1>
          </div>
          <div className="bottom">
            <div className="left">
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
              />
            </div>
            <div className="right">
              <form type="POST" onSubmit={handleSubmit}>
                <div className="formInput">
                  <label htmlFor="file">
                    Image: <DriveFolderUploadOutlinedIcon className="icon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="formInput">
                  <label>Username</label>
                  <input type="text" id="username" onChange={(e) => setUser({...user,Username:e.target.value})} value={user.Username} placeholder="john_doe" required />
                </div>
                <div className="formInput">
                  <label>Name</label>
                  <input type="text" id="name" onChange={(e) => setUser({...user,Name:e.target.value})} value={user.Name} placeholder="john" />
                </div>
                <div className="formInput">

                  <label>Last Name</label>
                  <input type="text" id="surname" onChange={(e) => setUser({...user,Surname:e.target.value})} value={user.Surname} placeholder="doe" />
                </div>

                <div className="formInput">

                  <label>Email</label>
                  <input type="email" id="email" onChange={(e) => setUser({...user,Email:e.target.value})} value={user.Email} placeholder="john_doe@gmail.com" />
                </div>

                <div className="formInput">

                  <label>Password</label>
                  <input type="password" id="password" onChange={(e) => setUser({...user,Password:e.target.value})} value={user.Password} placeholder="Password" required />
                </div>

                <div className="formInput">

                  <label>phone</label>
                  <input type="text" id="phone" onChange={(e) => setUser({...user,Phone:e.target.value})} value={user.Phone} placeholder="+1 234 567 89" required />
                </div>
                <div className="formInput">

                  <label>Address</label>
                  <input type="text" id="address" onChange={(e) => setUser({...user,Address:e.target.value})} value={user.Address} placeholder="Elton St. 216 NewYork" required />
                </div>

                {
                  isLoading && <span>loading... please Wait</span>
                }
                {
                  isError && <span style={{ color: 'red' }}>{error.message}</span>
                }

                {
                  isSuccess &&  <span style={{ color: 'Green' }}><b>User Created Succesfully</b></span>
                }




                <button>Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default New;
