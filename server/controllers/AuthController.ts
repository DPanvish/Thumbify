import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const registerUser = async(req: Request, res: Response) => {
    try{
        const {name, email, password} = req.body;

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message: "User already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email, 
            password: hashedPassword
        })

        await newUser.save();

        req.session.isLoggedIn = true;
        req.session.userId = newUser._id;

        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        })
    }catch(error: any){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

export const loginUser = async(req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid email or password"});
        }

        req.session.isLoggedIn = true;
        req.session.userId = user._id;

        res.status(201).json({
            message: "Login Successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        })
    }catch(error: any){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

export const logoutUser = async(req: Request, res: Response) => {
    req.session.destroy((error: any) => {
        if(error){
            console.log(error);
            return res.status(500).json({message: error.message});
        }
    })

    return res.status(200).json({message: "Logout Successful"});
}

export const verifyUser = async(req: Request, res: Response) => {
    try{
        const {userId} = req.session;
        const user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(400).json({message: "Invalid user"});
        }

        return res.status(200).json({
            message: "User verified",
            user,
        });
    }catch(error: any){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}