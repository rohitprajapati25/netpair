import * as Yup from "yup";

export const signUpSchema = Yup.object({
    name : Yup.string().required("Please Enter Your Full Name"),
    email : Yup.string().email().required("Please Enter Valid Email Id"),
    password : Yup.string().min(8).required("Please Create Your Password"),
    agree:Yup.boolean().oneOf([true],"Please Agree First"),
    confirm_pass : Yup.string().oneOf([Yup.ref("password")],"Password Does't Match")
});
export const loginSchema = Yup.object({
    email:Yup.string().email().required("Enter Your Email Id"),
    password : Yup.string().min(8).required("Enter Your Password Hear"),
});

